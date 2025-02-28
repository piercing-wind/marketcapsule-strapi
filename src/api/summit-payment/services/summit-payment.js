'use strict';
const Razorpay = require('razorpay');
const crypto = require("crypto");
const { sendEmail } = require('../../../../helper/zeptomail');
/**
 * summit-payment service
 */

const { createCoreService } = require('@strapi/strapi').factories;

const razorpay = new Razorpay ({
    key_id : process.env.RAZORPAY_KEY,
    key_secret : process.env.RAZORPAY_SECRET_KEY
})

const getPaymentDetails = async (paymentId) => {
  try {
      const details = await razorpay.payments.fetch(paymentId);
      return JSON.parse(JSON.stringify(details));

  } catch (error) {
      return {}
  }
}

module.exports = createCoreService('api::summit-payment.summit-payment', ({strapi}) =>({
    createOrder : async (ctx) => {
        // Custom business logic for creating a payment
        // For example, interacting with a payment gateway
        let userId = ctx.state.user.id;
        const { amount, currency , receipt} = ctx.request.body;
        if(!amount) throw new Error('Amount is required');
        if(!currency) throw new Error('Currency is required');
        if(!receipt) throw new Error('Receipt is required');

        const response = await razorpay.orders.create({
            amount: amount * 100,
            currency: currency,
            notes : {
              userId : userId,
              email : ctx.state.user.email,
              name : ctx.state.user.fullName,
              receipt : receipt
            }
        });
        return { success: true, message: 'Order created successfully', data : response };
      },
    
    grantAccessToSummit : async (ctx) => {

        const {userId, summitId, razorpay_order_id, razorpay_payment_id, razorpay_signature} = ctx.request.body;
        if(!userId) throw new Error('User Id is required'); 
        if(!summitId) throw new Error('Summit Id is required');
        if(!razorpay_order_id) throw new Error('Razorpay Order Id is required');
        if(!razorpay_payment_id) throw new Error('Razorpay Payment Id is required');
        if(!razorpay_signature) throw new Error('Razorpay Signature is required');

        // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY);
        // hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        // const generated_signature = hmac.digest('hex');

        const paymentDetails = await getPaymentDetails(razorpay_payment_id);
        if(paymentDetails.status !== 'captured') throw new Error('Payment failed');
        
        const response =  await strapi.db.query('api::summit-payment.summit-payment').create({
                          data:{ 
                           users_permissions_user : userId,
                           summit : parseInt(summitId),
                           mail : ctx.state.user.email,
                           name : ctx.state.user.fullName,
                           razorpayResponse : paymentDetails
                          }});

        const summit = await strapi.db.query('api::summit.summit').findOne({
            where: { id: parseInt(summitId) },
        });

        if(!response || !response.id) throw new Error('Something went wrong while granting access to summit');
        
        await sendEmail(
            ctx.state.user.email,
            "summitPurchase",
            JSON.stringify({
               name: ctx.state.user.fullName, 
               summit_name: summit?.title,
               event_date : new Date(summit?.organized_on).toLocaleDateString(),
               event_time : summit?.maildata.event_time,
               event_format : summit?.maildata.event_format,
               event_description : summit?.maildata.event_description,
            })
         )
       
        return { success: true, message: 'Payment successfull! Access Granted', data : response };
      },
      getUserAccess : async (ctx) =>{
        const { userId } = ctx.request.body;
        if(!userId) throw new Error('User Id is required');
        const response = await strapi.db.query('api::summit-payment.summit-payment').findMany({
          where: { users_permissions_user: userId },
          select: ['id'],
          populate: ['summit', 'users_permissions_user']
        });
        return { success: true, message: 'Payment details fetched successfully', data : response };
      }
      
}) );
