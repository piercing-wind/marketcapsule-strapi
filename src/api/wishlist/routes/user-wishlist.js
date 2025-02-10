module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/wishlist/list', 
        handler: 'user-wishlist.list',
      },
      {
        method: 'POST',
        path: '/wishlist/add', 
        handler: 'user-wishlist.add',

      },
      {
        method: 'DELETE',
        path: '/wishlist/:companyId', 
        handler: 'user-wishlist.remove',

      }

    ]
  }