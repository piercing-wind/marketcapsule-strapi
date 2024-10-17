module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/ipo/list', 
        handler: 'companies-ipo.list',
      },
      {
        method: 'GET',
        path: '/ipo/detail/:slug', 
        handler: 'companies-ipo.detail',
      },
      {
        method: 'GET',
        path: '/ipo/filter', 
        handler: 'companies-ipo.filter',

      }

    ]
  }