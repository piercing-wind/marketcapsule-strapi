module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/authentication/register',
     handler: 'authentication.register',
     
    },
    {
      method: 'POST',
      path: '/authentication/verify-otp',
      handler: 'authentication.verifyOtp',
      
     },
     {
      method: 'POST',
      path: '/authentication/login',
      handler: 'authentication.login',
      
     },
     {
      method: 'POST',
      path: '/authentication/resendOtp',
      handler: 'authentication.resendOtp',
      
     },
     {
      method: 'GET',
      path: '/authentication/google',
      handler: 'authentication.googleLogin',
      
     },
     {
      method: 'GET',
      path: '/authentication/google/callback',
      handler: 'authentication.googleAuthCallback',
      
     },
     {
      method: 'GET',
      path: '/authentication/facebook',
      handler: 'authentication.facebookLogin',
      
     },
     {
      method: 'GET',
      path: '/authentication/facebook/callback',
      handler: 'authentication.facebookAuthCallback',
      
     },
     {
      method: 'POST',
      path: '/authentication/socialLogin',
      handler: 'authentication.loginWithFacebookAndGoogle',
     }
  ],


};
