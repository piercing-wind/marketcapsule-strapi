'use strict';

/**
 * top-loser service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::top-loser.top-loser');
