module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/company/list', 
        handler: 'companies.list',
      },
      {
        method: 'GET',
        path: '/company/detail', 
        handler: 'companies.detail',

      },
      {
        method: 'GET',
        path: '/company/filter', 
        handler: 'companies.filter',

      },
      {
        method: 'GET',
        path: '/company/search', 
        handler: 'companies.search',

      },
      {
        method: 'GET',
        path: '/company/priceAndVolume', 
        handler: 'companies.priceAndVolume',

      }

    ]
  }