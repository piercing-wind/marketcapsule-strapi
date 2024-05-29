const {encode} =require('./hash');
const otpGenerator = require("otp-generator");
const timeStampOtp=10;
const generateTimeStamp=(date,minutes)=>{
    return new Date(date.getTime()+minutes*60000)
}


exports.generateOtpToken = async(obj)=>{
    let otp='1234';
    if(process.env.MODE!="development"){
        otp=otpGenerator.generate(4,{digits:true,lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
    }
    let verifyToken={
        otpCode:otp,
        id:obj.id,
        timestamp:generateTimeStamp(new Date(),timeStampOtp)
    }

    const decodeToken = await encode(JSON.stringify(verifyToken));
    return {otp,token:decodeToken}
}

exports.sanitizeUser = async (user) => {
    delete user.otp;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.password;
    delete user.resetPasswordToken;
    delete user.confirmationToken;
    delete user.otp;
    return user;
  };