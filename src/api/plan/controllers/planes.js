
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
                    where: { orderId: orderId },
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
                let paymentDetails = getPaymentDetails(paymentId);
                console.log("paymentDetails", paymentDetails);

                let user = await strapi.db.query("plugin::users-permissions.user").findOne({
                    where: { id: findSubscription.userId.id },
                    select: ["id", "socketId", "fullName"]
                })

                let subscriptionExpiryDate = addDaysToDate(new Date(), findSubscription.plan.durationInDays)


                // generate invoice...
                let invoiceData = {
                    CIN: " fd6564564546456",
                    GSTIN: "644444444",
                    mobile: "+91-4433334434",
                    email: "johndoe@mail.com",
                    address: "Lorem Ipsum",
                    userFullName: user.fullName,
                    invoiceDate: moment(new Date()).format("MMM Do YYYY"),
                    planName: findSubscription.plan?.name,
                    totalAmount: findSubscription.plan?.price,
                    discount: 0,
                    totalPayableAmount: findSubscription.amount,
                    totalPayableAmountInWords: ""
                }

                invoiceData.discount = invoiceData.totalAmount - invoiceData.totalPayableAmount
                invoiceData.totalPayableAmountInWords = numberToWords.toWords(invoiceData.totalPayableAmount)

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
    generateInvoice: async (ctx) => {
        try {
            console.log("starting....")
            

            const doc = new pdf();
            const data = {

                name: 'Market Capsule',
                gstin: '644444444',
                address: 'Lorem Ipsum',
                phone: '4433334434',
                email: 'johndoe@mail.com',
                billTo: 'John Doe',
                billToGstin: 'Not Applicable / Unregistered',
                billToAddress: 'Online Services',
                placeOfSupply: 'City name',
                invoiceNo: 'A/2020-21/001',
                invoiceDate: '15-Jun-2022',
                items: [

                    { particulars: 'Capsule+ (Yearly)', amount: 'Germany' },
                ],

                totalCharges: '4,999',
                cgst: '-',
                sgst: '-',
                igst: '-',
                totalAmount: '4,999',
                accountNumber: 'XXXXXXXX1234',
                accountType: 'Current',
                ifscCode: 'PNBXXXXXXX'

            };

            const { name, gstin, address, phone, email, billTo, billToGstin,
                billToAddress, placeOfSupply, invoiceNo, invoiceDate, items, totalCharges, cgst, sgst, igst, totalAmount, accountNumber, accountType, ifscCode } = data;

            // Set up fonts

            const fontNormal = 'Helvetica';

            const fontBold = 'Helvetica-Bold';

            doc
                .font(fontBold)

                .fontSize(10)

                .text('Market Capsule', { align: 'center' })

                .moveDown(0.2);
            doc

                .font(fontNormal)

                .fontSize(10)

                .text(`CIN: fd6564564546456`, { align: 'center' })

                .moveDown(0.5);

            doc

                .text(`Address: Lorem Ipsum`, { align: 'center' })

                .moveDown(0.5);

            doc

                .text(

                    `GSTIN: ${gstin} | +91-${phone} | ${email}`,

                    { align: 'center' }

                )

                .moveDown(0.5);

            // Tax invoice heading

            doc

                .rect(0, doc.y, doc.page.width, 25)

                .fill('#E6E6E6')

                .stroke();

            doc

                .font(fontBold)

                .fontSize(10)

                .fill('#0603AF')

                .text('TAX INVOICE', { align: 'center' })

                .moveDown(0.5)

                .fill('#000000');

            // Bill to section

            doc

                .font(fontBold)

                .fontSize(10)

                .text('Bill To', 30, doc.y + 10)

                .moveDown(0.5);

            doc

                .font(fontNormal)

                .fontSize(10)

                .text(`Name: ${billTo}`)

                .text(`GSTIN: ${billToGstin}`)

                .moveDown(0.5);

            doc

                .text(`Address: ${billToAddress}`)

                .moveDown(1);

            // Invoice details

            doc

                .font(fontBold)

                .fontSize(10)

                .text('Place of Supply', 30)

                .text('Invoice No.', 200)

                .text('Invoice Date', 400)

                .moveDown(0.5);

            doc

                .font(fontNormal)

                .fontSize(10)

                .text(`${placeOfSupply}`, 30)

                .text(`${invoiceNo}`, 200)

                .text(`${invoiceDate}`, 400)

                .moveDown(1);

            // Particulars table

            doc

                .font(fontBold)

                .fontSize(10)

                .text('S.NO.', 30)

                .text('PARTICULARS', 100)

                .text('AMOUNT', 500)

                .moveDown(0.5);

            let itemIndex = 1;

            items.forEach(item => {

                doc

                    .font(fontNormal)

                    .fontSize(10)

                    .text(itemIndex.toString(), 30)

                    .text(item.particulars, 100)

                    .text(item.amount, 500)

                    .moveDown(0.5);

                itemIndex++;

            });

            doc
            .font(fontBold)
            .text("Discount",100)
            .text("0",500)

            // Total charges

            doc

                .font(fontBold)

                .text('Total Charges', 100)

                .text(totalCharges, 500)

                .moveDown(0.5);

            // Taxes

            doc

                .font(fontNormal)

                .text(`CGST @ 9%: ${cgst}`, 100)

                .text(`SGST @ 9%: ${sgst}`, 100)

                .text(`IGST @ 18%: ${igst}`, 100)

                .moveDown(0.5);

            // Total amount payable

            doc

                .font(fontBold)

                .fill('#040280')

                .text(`Total Amount Payable: ${totalAmount}`, 100)

                .moveDown(1)

                .fill('#000000');

            // Payment details

            doc

                .rect(0, doc.y, doc.page.width, 25)

                .fill('#E6E6E6')

                .stroke();

            doc

                .font(fontBold)

                .fontSize(10)

                .text('PAYMENT DETAILS', { align: 'left' })

                .moveDown(1);

            doc

                .font(fontNormal)

                .fontSize(10)

                .text(`Bank Account No.: ${accountNumber}`)

                .text(`Account Type: ${accountType}`)

                .text(`IFSC Code: ${ifscCode}`)

                .moveDown(1);

            // Authorized signatory

            doc

                .text('Authorized Signatory', { align: 'right' });

            // Finish the PDF

            doc.end();

            // Example usage
            const outputPath = path.join(__dirname, 'invoice.pdf');

            doc.pipe(fs.createWriteStream(outputPath));



        } catch (error) {
            console.log("error", error);
            return ctx.badRequest(error)
        }
    }
}

const getPaymentDetails = async (paymentId) => {
    try {
        const details = await razorpay.payments.fetch(paymentId);
        return JSON.parse(JSON.stringify(details));

    } catch (error) {
        return {}
    }
}

