module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/promo-codes/check', 
        handler: 'promo-codes.checkPromoCode',
      },

    ]
  }