'use strict';

const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require('path');

// Global Transporter Setup
const transporter = nodemailer.createTransport({
   host: "smtp.zeptomail.in", 
   port: 587,
   auth: {
       user: process.env.ZEPTO_MAIL_USERID,
       pass: process.env.ZEPTO_MAIL_API_KEY,
   },
});

const subjects = {
   sendOtp : "Login with OTP",
   beforeSubscriptionExpire : "Subscription Expiry Reminder",
   subscriptionExpired : "Subscription Expired",
   summitPurchase : "MarketCapsule Event Registration",
}
const sendEmail = async (email, template, templateData) => {
    try{
       const templatePath = path.join(__dirname, `../views/${template}.html`);
      
       const templateSource = fs.readFileSync(templatePath, "utf8");
       const compiledTemplate = handlebars.compile(templateSource);
       const htmlContent = compiledTemplate(JSON.parse(templateData)); // Convert JSON string to object

       const mailOptions = {
           from: process.env.EMAIL_DEFAULT_FROM,
           to: email,
           subject: subjects[template] || "MarketCapsule", // Default subject if not provided
           html: htmlContent,
           replyTo: process.env.EMAIL_DEFAULT_FROM,
       };

       const info = await transporter.sendMail(mailOptions);
       return info;
    }catch(e){
        console.log(e);
    }
 
};
module.exports = { sendEmail };