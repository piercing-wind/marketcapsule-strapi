'use strict';
var aws = require('aws-sdk');

aws.config.update({
  region: process.env.AWS_REGION,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});


const awsSes = new aws.SES({ apiVersion: '2010-12-01' });



const sendEmailNormal = async (email, data) => {

  console.log("sending email", email)
  const params = {
    Source: `${process.env.EMAIL_DEFAULT_FROM}`,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_DEFAULT_FROM],
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: 'Market capsule OTP',
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h3>Use this otp ${data.otp} to login on market capsule.</h3>`
        },

      },
    },
  };

  return new Promise(resolve => {
    awsSes.sendEmail(params)
      .promise()
      .then((data) => {
        console.log(data);
        resolve(true)
      })
      .catch((err) => {
        console.log(err);
        resolve(false)
      })
  })
}

const createTemplate = async (data) => {
  console.log("data",data)

  var params = {
    Template: {
      TemplateName: data.TemplateName,
      HtmlPart: data.HtmlPart,
      SubjectPart: data.SubjectPart,
      TextPart: data.TextPart,

    },

  };

  var templatePromise = new aws.SES({
    region: process.env.AWS_REGION,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,

  })

    .createTemplate(params)
    .promise();
  templatePromise

    .then(function (data1) {
      console.log("data1", data1);
      return data1;

    })

    .catch((err) => {
      console.log("err", err);
      return err;

    });

};


const updateTemplate = async (data) => {
  var params = {
    Template: {
      TemplateName: data.templateName,
      HtmlPart: data.templateHtml,
      SubjectPart: data.subject,
      TextPart: data.textPart
    }
  };
  var templatePromise = new aws.SES({}).updateTemplate(params).promise();
  templatePromise.then(
    function (data) {
      console.log("data",data)
      return data;
    }).catch((err) => {
      console.log("err",err)
      return err;
    });
}

const deleteTemplate = async (templateName) => {

  const params = {
    TemplateName: templateName
  };

  console.log("params",params)

  // Create the promise and SES service object
  const templatePromise = new aws.SES({ apiVersion: "2010-12-01" })
    .deleteTemplate(params)
    .promise();

  // Handle promise's fulfilled/rejected states
  templatePromise
    .then(function (data1) {
      console.log(data1);
      return data1;
    })
    .catch(function (err) {
      console.error(err, err.stack);
      return err;
    });
};


const sendEmail = async (email, template, templateData) => {
  console.log("data===========",template,templateData)
  return new Promise(resolve => {
    var params = {
      Destination: {
        ToAddresses: [
          email,
        ]
      },
      Source: `${process.env.EMAIL_DEFAULT_FROM}`,
      Template: `${template}`,
      TemplateData: templateData,
      ReplyToAddresses: [process.env.EMAIL_DEFAULT_FROM],
      Tags: [
      ]
    };

    var sendPromise = new aws.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(params).promise();
    sendPromise.then((data) => {
      console.log("data",data)
      resolve(data);
    }).catch((err) => {
      console.log("err", err);
      resolve(err)
    });
  });
}

module.exports = { sendEmailNormal,sendEmail,createTemplate,deleteTemplate,updateTemplate }




