'use strict';

const { generateOtpToken, sanitizeUser } = require("../utils/index");
const { decode } = require('../utils/hash');
const {sendEmail} = require('../../../../helper/zeptomail')
const { testUserCheck } = require('../utils/test');
const {emailTemplate} = require("../../../../config/constant")
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_AUTH_API_KEY);

module.exports = {
  register: async (ctx, next) => {
    try {

      const { email, newslettersSubscribed = false, isTermAndConditionAccept = false } = ctx.request.body;

      if (!email) {
        return ctx.badRequest('Email required!');
      }
      let user;

      let userExists = await strapi.db.query("plugin::users-permissions.user").findOne({ where: { email } });
      
      if (userExists) {
        return ctx.badRequest("Email already exist!")
      }

      // create user 
      let userObj = {
        email,
        role: 1,
        provider: "local",
        newslettersSubscribed,
        isTermAndConditionAccept
      }

      const create = await strapi.db.query("plugin::users-permissions.user").create({ data: userObj })

      if (!create) {
        return ctx.badRequest('Failed to create user!')
      }
      user = create;

      let verifyToken = await generateOtpToken(user)
      console.log("verifyToken",verifyToken)
      if (!verifyToken) {
        return ctx.badRequest('Faild to send otp!')
      }

      if (process.env.MODE === "development") {
        let testEmails = testUserCheck();
        if (testEmails.includes(email)) {

          await sendEmail(email, emailTemplate.sendOtp,JSON.stringify({name:email,otp:verifyToken.otp}))
        }
  
      } else {
        console.log("else")
        await sendEmail(email, emailTemplate.sendOtp,JSON.stringify({name:email,otp:verifyToken.otp}))
      }

      if (verifyToken && verifyToken.token) {
        await strapi.db.query("plugin::users-permissions.user").update(
          {
            where: {
              id: user.id
            },
            data: {
              confirmationToken: verifyToken?.token
            }
          }
        )
        return ctx.response.send({ success: true, message: "Please check your email for 4 Digits Code sent to you mail", data: { token: verifyToken.token } })
      }
      else {
        return ctx.badRequest('Failed to generate token!')
      }




    } catch (err) {
      return ctx.badRequest(err)
    }
  },

  verifyOtp: async (ctx, next) => {

    try {
      const { otp, verifyToken } = ctx.request.body;
      if (!verifyToken) {
        return ctx.badRequest('VerifyToken missing!')
      }

      if (!otp) {
        return ctx.badRequest('Please enter OTP!')
      }

      //decode token...
      let decodeToken = await decode(verifyToken);
      if (!decodeToken) {
        return ctx.badRequest('Failed to verify token!')
      }
      console.log(decodeToken);

      const { id, otpCode, timestamp } = decodeToken;

      let oldToken = await strapi.db.query("plugin::users-permissions.user").findOne({ where: { id: id } })

      if (verifyToken != oldToken.confirmationToken) {
        return ctx.badRequest('OTP already used!')
      }

      if (otpCode && otpCode != otp) {
        return ctx.badRequest('Invalid OTP!')
      }
      let dt = new Date();
      if (dt > decodeToken.timestamp) {
        return ctx.badRequest('Otp expired!')
      }

      let updateUser = await strapi.db.query("plugin::users-permissions.user").update({
        where: {
          id: decodeToken.id
        },
        data: {
          confirmationToken: null,
          confirmed: true
        }
      })
      if (!updateUser) {
        return ctx.badRequest('Failed to verify otp!')
      }

      // generate token

      const payload = {
        id: oldToken.id,
        email: oldToken.email
      }

      let jwtToken = strapi.plugin("users-permissions").services.jwt.issue(payload, { expiresIn: '3600h' })

      let userData = await sanitizeUser(updateUser)


      return ctx.response.send({ success: true, message: "Successfully Login", data: { token: jwtToken, user: userData } })

    } catch (error) {
      console.log(error);
      return ctx.badRequest(error)
    }
  },

  login: async (ctx, next) => {
    try {

      const { email } = ctx.request.body;
      if (!email) {
        return ctx.badRequest('Email required!');
      }

      let userExists = await strapi.db.query("plugin::users-permissions.user").findOne({ where: { email } });

      if (!userExists) {
        return ctx.badRequest('User not found!');
      }

      if (userExists && userExists.blocked) {
        return ctx.badRequest('Your account has been blocked by an administrator');
      }

      if (userExists.provider !== "local") {
        return ctx.badRequest('User exists but not signup through email!');
      }


      let verifyToken = await generateOtpToken(userExists)
      if (!verifyToken) {
        return ctx.badRequest('Faild to send otp!')
      }
      if (process.env.MODE === "development") {
        let testEmails = testUserCheck();
        if (testEmails.includes(email)) {
          console.log("email",email);
          await sendEmail(email, emailTemplate.sendOtp,JSON.stringify({name:userExists.name?userExists.name:email,otp:verifyToken.otp}))
        }

      } else {
        await sendEmail(email, emailTemplate.sendOtp,JSON.stringify({name:userExists.name?userExists.name:email,otp:verifyToken.otp}))
      }


      if (verifyToken && verifyToken.token) {
        await strapi.db.query("plugin::users-permissions.user").update(
          {
            where: {
              id: userExists.id
            },
            data: {
              confirmationToken: verifyToken?.token
            }
          }
        )
        return ctx.response.send({ success: true, message: "Please check your email for 4 Digits Code sent to you mail", data: { token: verifyToken.token, otp: verifyToken.otp } })
      }
      else {
        return ctx.badRequest('Failed to generate token!')
      }




    } catch (err) {
      return ctx.badRequest(err)
    }
  },

  resendOtp: async (ctx, next) => {
    try {
      const { email } = ctx.request.body;
      if (!email) {
        return ctx.badRequest('Email required!');
      }

      let userExists = await strapi.db.query("plugin::users-permissions.user").findOne({ where: { email } });
      if (!userExists) {
        return ctx.badRequest('Email not exist!');
      }

      let verifyToken = await generateOtpToken(userExists)
      if (!verifyToken) {
        return ctx.badRequest('Faild to resend otp!')
      }
      if (process.env.MODE === "development") {
        let testEmails = testUserCheck();

        if (testEmails.includes(email)) {
          await sendEmail(email, emailTemplate.sendOtp,JSON.stringify({name:userExists.name?userExists.name:email,otp:verifyToken.otp}))
        }

        await sendEmail(email, { otp: verifyToken.otp })
      } else {
        
        await sendEmail(email, emailTemplate.sendOtp,JSON.stringify({name:userExists.name?userExists.name:email,otp:verifyToken.otp}))
      }


      if (verifyToken && verifyToken.token) {
        await strapi.db.query("plugin::users-permissions.user").update(
          {
            where: {
              id: userExists.id
            },
            data: {
              confirmationToken: verifyToken?.token
            }
          }
        )
        return ctx.response.send({ success: true, message: "Please check your email for 4 Digits Code sent to you mail", data: { token: verifyToken.token, otp: verifyToken.otp } })
      }
      else {
        return ctx.badRequest('Failed to resent otp!')
      }




    } catch (err) {
      return ctx.badRequest(err)
    }
  },
  googleLogin: async (ctx) => {
    try {
      const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
      const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URL

      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;

      return ctx.response.redirect(url);

    } catch (error) {
      console.log("error", error);
      return ctx.badRequest(error)
    }
  },
  googleAuthCallback: async (ctx) => {
    try {
      console.log("query", ctx.request.query)
      const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
      const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URL
      const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

      const { code } = ctx.request.query;

      const { data } = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      });

      const { access_token } = data;

      console.log("access_token",access_token);
      return ctx.send("google api")

      // Use access_token or id_token to fetch user profile
      const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      let findUser = await strapi.db.query("plugin::users-permissions.user").findOne({ where: { email: profile.email } });

      if (findUser) {

        const payload = {
          id: findUser.id,
          email: findUser.email
        }

        let jwtToken = strapi.plugin("users-permissions").services.jwt.issue(payload, { expiresIn: '3600h' })

        return ctx.response.redirect(`${process.env.GOOGLE_LOGIN_FRONTEND_REDIRECT}/accessToken=${jwtToken}&profileStatus=${findUser.profileStatus}`)

      }
      else {
        let userObj = {
          email: profile.email,
          role: 1,
          provider: "google",
          confirmed: true
        }
        const create = await strapi.db.query("plugin::users-permissions.user").create({ data: userObj })

        const payload = {
          id: create.id,
          email: create.email
        }

        let jwtToken = strapi.plugin("users-permissions").services.jwt.issue(payload, { expiresIn: '3600h' })

        return ctx.response.redirect(`${process.env.GOOGLE_LOGIN_FRONTEND_REDIRECT}/accessToken=${jwtToken}&profileStatus=${create.profileStatus}`)
      }


    } catch (error) {
      console.log("err", error);
      return ctx.badRequest(error)
    }
  },
  facebookLogin: async (ctx) => {
    try {
      const APP_ID = process.env.FACEBOOK_APP_ID
      const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URL

      const url = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&scope=email`;

      return ctx.response.redirect(url);

    } catch (error) {
      console.log("error", error);
      return ctx.badRequest(error)
    }
  },
  facebookAuthCallback: async (ctx) => {
    try {
      console.log("query", ctx.request.query)

      const APP_ID = process.env.FACEBOOK_APP_ID
      const REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URL
      const APP_SECRET = process.env.FACEBOOK_APP_SECRET

      const { code } = ctx.request.query;

      const { data } = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token?client_id=${APP_ID}&client_secret=${APP_SECRET}&code=${code}&redirect_uri=${REDIRECT_URI}`);


      const { access_token } = data;

      // Use access_token to fetch user profile
      const { data: profile } = await axios.get(`https://graph.facebook.com/v13.0/me?fields=name,email&access_token=${access_token}`);

      let findUser = await strapi.db.query("plugin::users-permissions.user").findOne({ where: { email: profile.email } });

      if (findUser) {

        const payload = {
          id: findUser.id,
          email: findUser.email
        }

        let jwtToken = strapi.plugin("users-permissions").services.jwt.issue(payload, { expiresIn: '3600h' })


        return ctx.response.redirect(`${process.env.GOOGLE_LOGIN_FRONTEND_REDIRECT}/accessToken=${jwtToken}&profileStatus=${findUser.profileStatus}`)

      }
      else {
        let userObj = {
          email: profile.email,
          role: 1,
          provider: "facebook",
          confirmed: true
        }
        const create = await strapi.db.query("plugin::users-permissions.user").create({ data: userObj })

        const payload = {
          id: create.id,
          email: create.email
        }

        let jwtToken = strapi.plugin("users-permissions").services.jwt.issue(payload, { expiresIn: '3600h' })

        return ctx.response.redirect(`${process.env.GOOGLE_LOGIN_FRONTEND_REDIRECT}/accessToken=${jwtToken}&profileStatus=${create.profileStatus}`)
      }



    } catch (error) {
      console.log("err", error);
      return ctx.badRequest(error)
    }
  },
  async loginWithFacebookAndGoogle(ctx) {
    try {
      console.log("hello from google auth------")
      const token = ctx.request.body.token;
      const provider = ctx.request.body.provider;
      const type = ctx.request.body.type;

      console.log("request query",ctx.request.body)

      if (!token) {
        return ctx.badRequest("Token is missing");
      }

      if (!provider) {
        return ctx.badRequest("Provider is missing");
      }

      let socialMediaUser;

      if (provider === "google") {
        socialMediaUser = await verifyGoogleToken(token, provider);
        console.log("socialMediaUser",socialMediaUser);
      } else if (provider === "facebook") {
        socialMediaUser = await verifyFacebookToken(token, provider, type);
        console.log("socialMediaUser",socialMediaUser)
      } else {
        return ctx.badRequest("Invalid provider");
      }

      if (!socialMediaUser.success) {
        return ctx.badRequest(socialMediaUser.message);
      }

      return ctx.send({
        success: true,
        message: `Successfully logged in with ${provider}`,
        data: socialMediaUser.data,
      });
    } catch (error) {
      console.error("Error during social media login:", error.message);
      return ctx.badRequest(
        `Failed to log in with social media: ${error.message}`
      );
    }
  },




};

async function verifyGoogleToken(token, provider) {
  try {

    console.log("token", token);
    console.log("GOOGLE_TOKEN_VERIFY_URL", process.env.GOOGLE_TOKEN_VERIFY_URL);

    const { data: profile } = await axios.get(process.env.GOOGLE_TOKEN_VERIFY_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("profile",profile)

    let userInfo = {
      fullName:profile.name,
      image:profile.picture
    }

    if (!profile) {
      return { success: false, message: "Failed to verify Google token" };
    }

    if (!profile.email) {
      return {
        success: false,
        message: 'Email is not linked with your Google account. Please use different email address',
        code: "0001"
      };
    }

    console.log("after getting profile data")

    const user = await findOrCreateUser(profile.email,userInfo, provider);
    console.log("user",user)

    const jwtToken = await createJWT(user);

    let userData = await sanitizeUser(user);

    const responseObj = {
      token: jwtToken,
      user:userData
    };

    console.log("responseObj",responseObj)

    return {
      success: true,
      message:
        "Google token verified, user information stored, and JWT generated",
      data: responseObj,
    };
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    return { success: false, message: "Failed to verify Google token" };
  }
}

async function findOrCreateUser(email,userInfo, provider) {
  const user = await strapi.db.query("plugin::users-permissions.user").findOne({
    where: { email: email },
  });

  if (user) {

    return user

  }
  else {
    let userObj = {
      email: email,
      role: 1,
      provider: provider,
      profileStatus:"pending",
      confirmed: true,
      image:userInfo.image?userInfo.image:"",
      fullName:userInfo.fullName?userInfo.fullName:""
    }
    const createUser = await strapi.db.query("plugin::users-permissions.user").create({ data: userObj })

    return createUser
  }

}


// JWT creation logic
async function createJWT(user) {
  const jwt = strapi.plugins["users-permissions"].services.jwt;
  const payload = {
    id: user.id,
    email: user.email,
  };
  return jwt.issue(payload, { expiresIn: "3600h" });
}

async function verifyFacebookToken(token, provider, type) {
  try {
    console.log("in facebook veirfy fnn")
    const response = await axios.get(
      `https://graph.facebook.com/me?access_token=${token}&fields=id,email,name`
    );
    const userData = response.data;

    console.log("userData from facebook====",userData)

    const email = userData.email;

    console.log("email",email)

    if (!email) {
      return {
        success: false,
        message: 'Email is not linked with your facebook account. Please use different email address',
        code: "0001"
      };
    }

    let userInfo = {
      fullName:userData.name?userData.name:"",
      image:userData.image?userData.image:"https://d1gg24sxbl1rgc.cloudfront.net/user_868f677d6f.png"
    }

    const user = await findOrCreateUser(email,userInfo, provider);
    console.log("user",user)

    const jwtToken = await createJWT(user);
    let userDetail = await sanitizeUser(user)

    const responseObj = {
      token: jwtToken,
      user: userDetail
    };

    return {
      success: true,
      message:
        "Facebook token verified, user information stored, and JWT generated",
      data: responseObj,
    };
  } catch (error) {
    if (error.response) {
      console.error("Facebook API error:", error.response.data);
    } else if (error.request) {
      console.error("No response from Facebook API");
    } else {
      console.error("Error during Facebook token verification:", error.message);
    }

    return { success: false, message: "Failed to verify Facebook token" };
  }
}
