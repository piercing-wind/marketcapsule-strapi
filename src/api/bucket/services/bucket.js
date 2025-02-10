'use strict';

/**
 * bucket service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::bucket.bucket');
