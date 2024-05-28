'use strict';

const { generateOtpToken, sanitizeUser } = require("../utils/index");
const { decode } = require('../utils/hash');
const { sendEmailNormal } = require('../../../../helper/ses');
const { testUserCheck } = require('../utils/test');
const axios = require("axios");

module.exports = {
  register: async (ctx, next) => {
    try {

      console.log("123456789");
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
      user = create





      let verifyToken = await generateOtpToken(user)
      if (!verifyToken) {
        return ctx.badRequest('Faild to send otp!')
      }
      if (process.env.MODE === "development") {
        let testEmails = testUserCheck();
        if (testEmails.includes(email)) {
          await sendEmailNormal(email, { otp: verifyToken.otp })
        }
        await sendEmailNormal(email, { otp: verifyToken.otp })
      } else {
        await sendEmailNormal(email, { otp: verifyToken.otp })
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
      console.log("123456789");
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
          await sendEmailNormal(email, { otp: verifyToken.otp })
        }
        await sendEmailNormal(email, { otp: verifyToken.otp })
      } else {
        await sendEmailNormal(email, { otp: verifyToken.otp })
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
      console.log("123456789");
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
          await sendEmailNormal(email, { otp: verifyToken.otp })
        }
        await sendEmailNormal(email, { otp: verifyToken.otp })
      } else {
        await sendEmailNormal(email, { otp: verifyToken.otp })
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

      // Use access_token or id_token to fetch user profile
      const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      let findUser = await strapi.db.query("plugin::users-permissions.user").findOne({ where: { email:profile.email } });

      if(findUser){

        const payload = {
          id: findUser.id,
          email: findUser.email
        }
  
        let jwtToken = strapi.plugin("users-permissions").services.jwt.issue(payload, { expiresIn: '3600h' })

        return ctx.response.redirect(`${process.env.GOOGLE_LOGIN_FRONTEND_REDIRECT}/accessToken=${jwtToken}&profileStatus=${findUser.profileStatus}`)
        
      }
      else{
        let userObj = {
          email:profile.email,
          role: 1,
          provider: "google",
          confirmed:true
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

      let findUser = await strapi.db.query("plugin::users-permissions.user").findOne({ where: { email:profile.email } });

      if(findUser){

        const payload = {
          id: findUser.id,
          email: findUser.email
        }
  
        let jwtToken = strapi.plugin("users-permissions").services.jwt.issue(payload, { expiresIn: '3600h' })

        return ctx.response.redirect(`${process.env.GOOGLE_LOGIN_FRONTEND_REDIRECT}/accessToken=${jwtToken}&profileStatus=${findUser.profileStatus}`)
        
      }
      else{
        let userObj = {
          email:profile.email,
          role: 1,
          provider: "facebook",
          confirmed:true
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

};
