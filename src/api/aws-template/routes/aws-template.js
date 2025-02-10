module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/aws-template/create',
     handler: 'aws-template.create',
    },
    {
      method: 'PUT',
      path: '/aws-template/update',
      handler: 'aws-template.update',
     },
     {
      method: 'DELETE',
      path: '/aws-template/delete/:name',
      handler: 'aws-template.deleteTemplate',
     },
     
  ],
};
