'use strict';

/**
 * top-gainer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::top-gainer.top-gainer');
