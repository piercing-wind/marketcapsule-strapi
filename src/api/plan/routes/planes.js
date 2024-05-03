module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/plan/checkout',
            handler: 'planes.checkout',
            
           },
      {
       method: 'POST',
       path: '/plan/buy',
       handler: 'planes.buy',
       
      },
      {
        method: 'POST',
        path: '/plan/invoice',
        handler: 'planes.invoice',
        
       },

    ],
  };
  