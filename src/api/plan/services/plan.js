'use strict';

const {convertHtmlIntoPdf} = require("../../../../helper/index");
const {uploadFileToS3} = require("../../../../helper/aws");
const { createCoreService } = require('@strapi/strapi').factories;
const {v4} = require("uuid");
const {invoiceHtml} = require("../../../../helper/htmlTemplates")

module.exports = createCoreService('api::plan.plan',({strapi})=>({
    generateInvoice:async(invoiceData)=>{
        try {
            let invoiceNo = v4()
            invoiceData.invoiceNo = invoiceNo
            let html = invoiceHtml(invoiceData);
            const pdfBuffer = await convertHtmlIntoPdf(html);
            return pdfBuffer
            const url = await uploadFileToS3(process.env.AWS_BUCKET, invoiceNo, pdfBuffer);
            let invoiceurl = `${process.env.AWS_CLOUDFRONT_BASE_URL}/${url.split(".com/")[1]}`
            console.log("url", invoiceurl);
            return invoiceurl;
    } catch (error) {
        return "";
    }
    },

    sendNotification:async(messageData,strapi)=>{
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
