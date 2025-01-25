module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/summit-payment',
     handler: 'summit-payment.processPayment',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
