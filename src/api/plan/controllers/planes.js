
const { addDaysToDate } = require("../utils/index")
const crypto = require("crypto");
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

module.exports = {
    checkout: async (ctx) => {
        try {

            const { planId, promoCode } = ctx.request.body;

            if (!planId) {
                return ctx.badRequest("PlanId is missing!")
            }

            let plan = await strapi.db.query("api::plan.plan").findOne({ where: { id: planId } });
            if (!plan) {
                return ctx.badRequest("Plan not exist!")

            }

            let res = {
                amount: plan.price,
                discount: 0,
                totalPayableAmount: plan.price
            }

            if (promoCode) {
                let { error, discountAmount } = await strapi.service("api::promo-code.promo-code").checkPromoCode(promoCode, planId);

                if (error) {
                    return ctx.badRequest(error)
                }
                res.promoCodeDiscount = discountAmount;
                res.totalPayableAmount = res.totalPayableAmount - res.promoCodeDiscount
            }

            return ctx.response.send({
                success: true,
                message: "Success",
                data: res
            })

        } catch (error) {
            return ctx.badRequest(error)
        }
    },
    buy: async (ctx) => {
        try {

            let userId = ctx.state.user.id;
            const { amount, planId, currency, receipt } = ctx.request.body;

            if (!planId) {
                return ctx.badRequest("PlanId is missing!")
            }

            if (!amount) {
                return ctx.badRequest("Amount is missing!")
            }
            if (!currency) {
                return ctx.badRequest("Currency is missing!")
            }

            let plan = await strapi.db.query("api::plan.plan").findOne({
                where: { id: planId }
            })
            if (!plan) {
                return ctx.badRequest("Plan not exist!")

            }

            console.log("1111");

            //create razopay order..
            const response = await razorpay.orders.create({
                amount: amount * 100,
                currency: currency,
                receipt: receipt             // 40 character limit
            })

            // create user subscription here...
            let subscriptionObj = {
                userId: userId,
                plan: planId,
                paymentStatus: "PENDING",
                amount: amount,
                orderId: response.id,
                paymentOrderJson: response
            }

            let newSubscription = await strapi.db.query("api::subscription.subscription").create({ data: subscriptionObj });
            if (!newSubscription) {
                return ctx.response.send({ success: false, message: "Error while buying subscription." })
            }


            return ctx.response.send({
                success: true,
                message: "Payment Intiated",
                data: newSubscription
            })



        } catch (error) {
            console.log("Error", error);
            return ctx.badRequest(error)
        }
    },

    paymentVerify: async (ctx) => {
        try {

            const { orderId, paymentId } = ctx.request.body;
            const razorpay_signature = ctx.request.headers['x-razorpay-signature'];

            let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);

            hmac.update(orderId + "|" + paymentId);

            const generated_signature = hmac.digest('hex');

            let findSubscription = await strapi.db.query("api::subscription.subscription").findOne(
                {
                    where: { orderId: orderId },
                    populate: {
                        plan: {
                            select: ["name", "durationInDays"]
                        },
                        userId: {
                            select: ["id"]
                        }
                    }
                }
            );

            if (razorpay_signature === generated_signature) {

                let user = await strapi.db.query("plugin::users-permissions.user").findOne({
                    where: { id: findSubscription.userId.id },
                    select: ["id", "socketId"]
                })

                let subscriptionExpiryDate = addDaysToDate(new Date(), findSubscription.plan.durationInDays)


                // generate invoice...
                let invoiceUrl = await strapi.service("api::plan.plan").generateInvoice();

                await strapi.db.query("api::subscription.subscription").update({
                    where: { id: findSubscription.id },
                    data: {
                        paymentStatus: "COMPLETED",
                        active: true,
                        transactionID: paymentId,
                        expiryDate: subscriptionExpiryDate,
                        invoiceUrl: invoiceUrl,
                        paymentVerifyJson:{
                            paymentStatus:"captured"
                        }
                    }
                })

                await strapi.db.query("plugin::users-permissions.user").update({
                    where: { id: user.id },
                    data: {
                        capsuleplus: true
                    }
                })

                await strapi.db.query("api::notification.notification").create({
                    data: {
                        title: "Payment completed Successfully!",
                        message: `You ${findSubscription.plan.name} Plan subscription purchased successfully.`,
                        userId: findSubscription.userId.id
                    }
                })

                // send real time notification to user..

                await strapi.service("api::plan.plan").sendNotification({ socketId: user.socketId, planName: findSubscription.plan.name }, strapi);

                return ctx.response.send({
                    success: true,
                    message: "Payment Successful"
                })
            }
            else {
                await strapi.db.query("api::subscription.subscription").update({
                    where: { id: findSubscription.id },
                    data: {
                        paymentStatus: "FAILED",
                        transactionID: paymentId,
                        paymentVerifyJson:{
                            paymentStatus:"failed"
                        }
                    }
                })

                return ctx.response.send({
                    success: false,
                    message: "Paymen Failed."
                })
            }

        } catch (error) {
            console.log("error", error);
            return ctx.badRequest(error)
        }
    },
}
