module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            `${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`,
            process.env.AWS_CLOUDFRONT_BASE_URL,
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            `${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`,
            process.env.AWS_CLOUDFRONT_BASE_URL,
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      header: '*',
      origin: ['*'],
      headers: ['*']
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      parsedMethods: ['GET', 'POST', 'PUT', 'PATCH'],
      formLimit: "5120mb", // 2GB
      jsonLimit: "5120mb", // 2GB
      textLimit: "5120mb", // 2GB
      formidable: {
        maxFileSize: 1024 * 1024 * 1024 * 5, //  5GB
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
