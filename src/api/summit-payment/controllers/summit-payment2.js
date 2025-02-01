
module.exports = {
  async initiatePayment(ctx) {
    try {
      const response = await strapi.service('api::summit-payment.summit-payment').createOrder(ctx);
      ctx.body = response;
    } catch (err) {
      ctx.body = { success: false, message: err.message };
    }
  },

  async accessProvider(ctx) {
    try {
      const response = await strapi.service('api::summit-payment.summit-payment').grantAccessToSummit(ctx);
      ctx.body = response;
    } catch (err) {
      ctx.body = { success: false, message: err.message };
    }
  },
  async hasaccess(ctx) {
    try { 
      const response = await strapi.service('api::summit-payment.summit-payment').getUserAccess(ctx);
      ctx.body = response;
    } catch (err) {
      ctx.body = { success: false, message: err.message };
    }
  }
};