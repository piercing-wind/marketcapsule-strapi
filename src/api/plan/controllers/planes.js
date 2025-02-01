
const { addDaysToDate } = require("../utils/index")
const crypto = require("crypto");
const Razorpay = require('razorpay');
const moment = require("moment");
const numberToWords = require('number-to-words');
const pdf = require("pdfkit");
const fs = require('fs');
const path = require('path');

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
                planName: plan.name,
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


            // check user has already active subscription...
            let findSubscription = await strapi.db.query("api::subscription.subscription").findOne(
                {
                    where: { userId: userId, active: true },
                }
            );

            if (findSubscription) {
                return ctx.badRequest("You have already active subscription.")
            }

            const { amount, planId, currency, receipt, promoCode } = ctx.request.body;
                
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
                paymentOrderJson: response,
            }

            if (promoCode) {
                let { error, promoCodeId } = await strapi.service("api::promo-code.promo-code").checkPromoCode(promoCode, planId);

                if (error) {
                    return ctx.badRequest(error)
                }

                subscriptionObj.promoCodeId = promoCodeId;
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
                    where: { orderId: orderId, },
                    populate: {
                        plan: {
                            select: ["name", "durationInDays", "price"]
                        },
                        userId: {
                            select: ["id"]
                        }
                    }
                }
            );

            if (razorpay_signature === generated_signature) {
                let paymentDetails = await getPaymentDetails(paymentId);

                let user = await strapi.db.query("plugin::users-permissions.user").findOne({
                    where: { id: findSubscription.userId.id },
                    select: ["id", "socketId", "fullName"]
                })

                let subscriptionExpiryDate = addDaysToDate(new Date(), findSubscription.plan.durationInDays)

         


                // generate invoice...
                let invoiceData = {
                    gstin: process.env.GSTIN,
                    address: process.env.ADDRESS,
                    phone: process.env.MOBILE,
                    email: process.env.ADMIN_EMAIL,
                    cin: process.env.CIN,
                    billTo: user.fullName?user.fullName:"-",
                    billToGstin: 'Not Applicable / Unregistered',
                    billToAddress: 'Online Services',
                    placeOfSupply: '-',
                    invoiceDate: moment(new Date()).format("MMM Do YYYY"),
                    items: [
    
                        { particulars: `${findSubscription.plan?.name}`, amount: `${findSubscription.plan?.price}` },
                    ],
                    regularPrice:findSubscription.plan.price,
                    planName: findSubscription.plan?.name,
                    discount: 0,
                    totalCharges: findSubscription.amount,
                    totalPayableAmount:findSubscription.amount,
                    totalPayableAmountInWords: "",
                    accountNumber: '-',
                    accountType: '-',
                    ifscCode: '-'
                }

                invoiceData.discount = invoiceData.regularPrice - invoiceData.totalCharges
                let amountInWords = numberToWords.toWords(invoiceData.totalPayableAmount);

                invoiceData.totalPayableAmountInWords = amountInWords[0].toUpperCase()+amountInWords.slice(1,amountInWords.length)


                let invoiceUrl = await strapi.service("api::plan.plan").generateInvoice(invoiceData);

                await strapi.db.query("api::subscription.subscription").update({
                    where: { id: findSubscription.id },
                    data: {
                        paymentStatus: "COMPLETED",
                        active: true,
                        transactionID: paymentId,
                        expiryDate: subscriptionExpiryDate,
                        invoiceUrl: invoiceUrl,
                        paymentVerifyJson: {
                            paymentStatus: "captured"
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

                if (findSubscription.promoCodeId) {
                    await strapi.db.query("api::promo-code.promo-code").update({
                        where: { id: findSubscription.promoCodeId },
                        data: {
                            $inc: { availedCount: 1 }
                        }

                    })
                }

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
                        paymentVerifyJson: {
                            paymentStatus: "failed"
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

const getPaymentDetails = async (paymentId) => {
    try {
        const details = await razorpay.payments.fetch(paymentId);
        return JSON.parse(JSON.stringify(details));

    } catch (error) {
        return {}
    }
}

