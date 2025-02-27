'use strict';

/**
 * summit service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::summit.summit');
