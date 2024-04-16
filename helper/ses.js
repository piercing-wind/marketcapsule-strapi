'use strict';
var aws = require('aws-sdk');

aws.config.update({
  region: process.env.AWS_REGION,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});


const sesNormal = new aws.SES({ apiVersion: '2010-12-01' });

module.exports = {

  async sendEmailNormal(email,data) {
    const params = {
      Source:`${process.env.EMAIL_DEFAULT_FROM}`,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: 'Market capsule OTP',
        },
        Body: {
          Html: {
            Data: `<h3>Use this otp ${data.otp} to login market capsule.</h3>`
          },
          
        },
      },
    };
    return new Promise(resolve => {
      sesNormal.sendEmail(params)
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
