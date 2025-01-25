'use strict';

/**
 * A set of functions called "actions" for `summit-payment`
 */

module.exports = {
  exampleAction: async (ctx, next) => {
    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },
  processPayment: async (ctx, next) => {
    try {
      const paymentDetails = ctx.request.body;
      const result = await strapi.service('api::summit-payment.summit-payment').processPayment(paymentDetails);
      console.log("Result",result)
      ctx.body = result;
    } catch (err) {
      console.log(err)
      ctx.body = err;
    }
  }
};
