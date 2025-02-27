'use strict';

const { convertHtmlIntoPdf } = require("../../../../helper/index");
const { uploadFileToS3 } = require("../../../../helper/aws");
const { createCoreService } = require('@strapi/strapi').factories;
const { v4 } = require("uuid");
const { invoiceHtml } = require("../../../../helper/htmlTemplates")
const pdf = require("pdfkit");
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');

module.exports = createCoreService('api::plan.plan', ({ strapi }) => ({
    generateInvoice: async (invoiceData) => {
        try {
            let doc = new pdf();
            invoiceData.invoiceNo = crypto.randomBytes(7).toString("hex");

            const { gstin, cin, phone, email, billTo, billToGstin, address,
                billToAddress, placeOfSupply, invoiceNo, invoiceDate, items, totalCharges, accountNumber, accountType, ifscCode, totalPayableAmountInWords, totalPayableAmount,discount } = invoiceData;

            // Set up fonts

            const fontNormal = 'Helvetica';

            const fontBold = 'Helvetica-Bold';

            doc
                .font(fontBold)

                .fontSize(15)

                .text('Market Capsule', 100, 30, { align: "center" })

                .moveDown(0.2);
            doc

                .font(fontNormal)

                .fontSize(10)

                .text(`CIN: ${cin}`, { align: 'center' })

                .moveDown(0.5);

            doc

                .text(`Address: ${address}`, { align: 'center' })

                .moveDown(0.5);

            doc

                .text(

                    `GSTIN: ${gstin} | ${phone} | ${email}`,

                    { align: 'center' }

                )

                .moveDown(0.5);

            // Tax invoice heading

            doc
                .rect(0, doc.y, doc.page.width, 40)
                .fill('#E6E6E6')
                .stroke();

            doc

                .font(fontBold)
                .fontSize(13)
                .fill('#0603AF')
                .text('TAX INVOICE', 280, 120)
                .moveDown(2)
                .fill('#000000');

            // Bill to section

            doc

                .font(fontBold)
                .fontSize(13)
                .text('Bill To', 30, doc.y)
                .moveDown(0.5);

            doc

                .font(fontNormal)
                .fontSize(13)
                .text(`Name: ${billTo}`)
                .moveDown(0.5);



            doc
                .font(fontNormal)
                .fontSize(13)
                .text(`GSTIN: ${billToGstin}`)
                .moveDown(0.5);

            doc
                .text(`Address: ${billToAddress}`, 300, 200)
                .moveDown(0.5);

            // Invoice details

            doc
                .font(fontBold)
                .fontSize(13)
                .text('Place of Supply', 30, 250)
                .text('Invoice No.', 180, 250)
                .text('Invoice Date', 300, 250)

            doc

                .font(fontNormal)
                .fontSize(13)
                .text(`${placeOfSupply}`, 30, 275)
                .text(`${invoiceNo}`, 180, 275)
                .text(`${invoiceDate}`, 300, 275)
                .moveDown(1);

            // Particulars table

            doc

                .rect(0, doc.y, doc.page.width, 40)
                .fill('#E6E6E6')
                .stroke();


            doc

                .font(fontBold)

                .fontSize(13)
                .fill('#000000')
                .text('S.NO.', 30, 320)
                .text('PARTICULARS', 100, 320)
                .text('AMOUNT', 450, 320)
                .fill('#000000')

            let itemIndex = 1;

            items.forEach(item => {

                doc
                    .font(fontNormal)
                    .fontSize(13)
                    .text(itemIndex.toString(), 30, 360)
                    .text(item.particulars, 100, 360)
                    .text(item.amount, 450, 360)

                itemIndex++;

            });

            doc
                .font(fontBold)
                .text("Discount", 100, 380)
                .text(discount, 450, 380)

            // Total charges

            doc

                .font(fontBold)

                .text('Total Charges', 100, 420)
                .text(totalCharges, 450, 420)

            // Taxes

            doc

                .font(fontNormal)

                .text(`CGST @ 9%`, 100, 460)
                .text(`SGST @ 9%`, 100, 480)
                .text(`IGST @ 18%`, 100, 500)
                .moveDown(0.5);

            doc

                .font(fontNormal)

                .text(`-`, 450, 460)
                .text(`-`, 450, 480)
                .text(`-`, 450, 500)

            // Total amount payable

            doc

                .font(fontBold)
                .fill('#040280')
                .text(`Total Amount Payable`, 100, 530)
                .fill('#000000');

            doc

                .font(fontBold)
                .fill('#040280')
                .text(`${totalPayableAmount}`, 450, 530)
                .fill('#000000');


            doc
                .font(fontBold)
                .text(`${totalPayableAmountInWords} only`, 30, 570)

            doc
                .font(fontBold)
                .text("In words", 30, 590)
                .moveDown(0.5)

            // Payment details



            doc

                .rect(0, doc.y, doc.page.width, 40)
                .fill('#E6E6E6')
                .stroke();

            doc

                .font(fontBold)

                .fontSize(13)
                .fill('#000000')
                .text('PAYMENT DETAILS', 30, 630)
                .fill('#000000')
                .moveDown(1)

            doc

                .font(fontNormal)

                .fontSize(12)

                .text(`Bank Account No.`, 30, 665)

                .text(`Account Type`, 180, 665)

                .text(`IFSC Code`, 280, 665)

            doc
                .font(fontNormal)
                .fontSize(12)
                .text(`${accountNumber}`, 30, 680)
                .text(`${accountType}`, 180, 680)
                .text(`${ifscCode}`, 280, 680)


            // Authorized signatory

            doc
                .fontSize(13)
                .text('Authorized Signatory', { align: 'right' });

            // Finish the PDF

            doc.end();
            // const outputPath = path.join(__dirname, 'invoice.pdf');

            // doc.pipe(fs.createWriteStream(outputPath));

            const url = await uploadFileToS3(process.env.AWS_BUCKET, invoiceNo, doc);
            console.log("url",url)
            let invoiceurl = `${process.env.AWS_CLOUDFRONT_BASE_URL}/${url.split(".com/")[1]}`
            console.log("url", invoiceurl);
            return invoiceurl;
        } catch (error) {
            return "";
        }
    },

    sendNotification: async (messageData, strapi) => {
        try {

            strapi.io.to(messageData.socketId).emit('notification', {
                title: "Payment completed Successfully!",
                message: `You ${messageData.planName} Plan subscription purchased successfully.`,
            })

            return true;

        } catch (error) {
            return false
        }
    },
}));
