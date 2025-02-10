const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region:process.env.AWS_REGION
  });

  


const uploadFileToS3 = async (bucketName, fileName, fileBuffer) =>{
  
    const params = {
      Bucket: bucketName,
      Key: `invoice/${fileName}`,
      Body: fileBuffer,
      ContentType: 'application/pdf'
    };
  
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
            console.log("err",err);
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  }

  module.exports = {uploadFileToS3}