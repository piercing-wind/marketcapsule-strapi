'use strict';

const fs = require("fs");
const { createTemplate, updateTemplate, deleteTemplate,sendEmail } = require("../../../../helper/ses")

module.exports = {
  create: async (ctx, next) => {

    try {

      // await sendEmail("rahulkumar220719999@gmail.com","beforeSubscriptionExpire",JSON.stringify({name:"Rahul", planName:"Baic",day:10}))

      // await sendEmail("rahulkumar220719999@gmail.com","subscriptionExpire",JSON.stringify({name:"Rahul", planName:"Baic"}))

      // await sendEmail("rahulkumar220719999@gmail.com","demo",JSON.stringify({otp:"123456"}))

      // return ctx.send("success")

      const { fileName, name, subject, text } = ctx.request.body;
      let file = fs.readFileSync(`./views/${fileName}.html`);
      let htmlFile = file.toString();

      const data = {
        TemplateName: name /* required */,
        HtmlPart: htmlFile,
        SubjectPart: subject,
        TextPart: text,
      }

      await createTemplate(data)

      return ctx.response.send({
        success: true,
        message: "Created successfully"
      })


    } catch (err) {
      return ctx.badRequest(err)
    }
  },
  update: async (ctx) => {
    try {
      const { fileName, name, subject, text } = ctx.request.body;
      let file = fs.readFileSync(`./views/${fileName}.html`)
      let html = file.toString()
      var data = {
        templateName: name,
        templateHtml: html,
        subject: subject,
        textPart: text
      }
      await updateTemplate(data);
      ctx.response.send({ success: { status: 200, message: "updated!" } });
    } catch (err) {
      ctx.badRequest(err);
    }
  },
  deleteTemplate: async (ctx) => {
    try {
      const {name} = ctx.request.params;
      console.log("req",ctx.request.body)
     
      await deleteTemplate(name);
      ctx.response.send({ success: { status: 200, message: "Deleted!" } });
    } catch (err) {
      ctx.badRequest(err);
    }
  },
  
};
