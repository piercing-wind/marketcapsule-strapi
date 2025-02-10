module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/bucket/list', 
        handler: 'company-bucket.list',
      },
      {
        method: 'GET',
        path: '/bucket/detail', 
        handler: 'company-bucket.detail',
      },
      {
        method: 'GET',
        path: '/bucket/filter/:slug', 
        handler: 'company-bucket.filter',
      },

    ]
  }