const cronJobs = require("../helper/cron");

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // url:"http://localhost:1337",
  app: {
    keys: env.array('APP_KEYS'),
  },
  http: {
    serverOptions: {
      requestTimeout: 1800000, // 5 minutes in milliseconds
    },
  },
  cron:{
    enabled:true,
    tasks:cronJobs

  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
