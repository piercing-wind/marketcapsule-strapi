'use strict';

/**
 * screener service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::screener.screener');
