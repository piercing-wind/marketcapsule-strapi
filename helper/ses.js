'use strict';
var aws = require('aws-sdk');

aws.config.update({
  region: process.env.AWS_REGION,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});


const awsSes = new aws.SES({ apiVersion: '2010-12-01' });

module.exports = {

  async sendEmailNormal(email,data) {
 
    console.log("sending email")
    const params = {
      Source:`${process.env.EMAIL_DEFAULT_FROM}`,
      Destination: {
        ToAddresses: [email],
      },
      ReplyToAddresses: [process.env.EMAIL_DEFAULT_FROM],
      Message: {
        Subject: {
          Data: 'Market capsule OTP',
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<h3>Use this otp ${data.otp} to login market capsule.</h3>`
          },
          
        },
      },
    };
 
    return new Promise(resolve => {
        awsSes.sendEmail(params)
      .promise()
      .then((data)=>{
        console.log(data);
        resolve(true)
      })
      .catch((err)=>{
        console.log(err);
        resolve(false)
      })
    })
  },




};
