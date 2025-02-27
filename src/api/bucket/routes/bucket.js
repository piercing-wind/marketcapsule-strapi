'use strict';

/**
 * bucket router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::bucket.bucket');
