'use strict';

/**
 * share-holding service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::share-holding.share-holding');
