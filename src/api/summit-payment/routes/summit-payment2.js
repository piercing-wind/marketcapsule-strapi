module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/summit-payments/initiatePayment',
      handler: 'summit-payment2.initiatePayment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/summit-payments/accessProvider',
      handler: 'summit-payment2.accessProvider',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/summit-payments/hasaccess',
      handler: 'summit-payment2.hasaccess',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};