module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/authentication/login',
     handler: 'authentication.login',
     
    },
    {
      method: 'POST',
      path: '/authentication/verify-otp',
      handler: 'authentication.verifyOtp',
      
     },
    //  {
    //   method: 'POST',
    //   path: '/authentication/login',
    //   handler: 'authentication.login',
      
    //  },
  ],
};
