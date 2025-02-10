module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/feed/list', 
        handler: 'feeds.list',
      },
      {
        method: 'GET',
        path: '/feed/:slug', 
        handler: 'feeds.getBySlug',
      },

    ]
  }