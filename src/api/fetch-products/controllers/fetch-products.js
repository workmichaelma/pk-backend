"use strict";

const { isString } = require("lodash");

/**
 * A set of functions called "actions" for `fetch-products`
 */

module.exports = {
  fetchProducts: async (ctx, next) => {
    try {
      const id = ctx?.request?.query?.id || "";

      if (id) {
        const data = await strapi
          .service("api::fetch-products.fetch-products")
          .fetchProducts(id);

        ctx.body = data;
      }
    } catch (err) {
      ctx.body = err;
    }
  },
  cronProducts: async (ctx, next) => {
    try {
      const id = ctx?.request?.body?.id || null;

      if (isString(id)) {
        const data = await strapi
          .service("api::fetch-products.cron-products")
          .cronProducts(id);
        ctx.body = data;
      }
    } catch (err) {
      ctx.body = err;
    }
  },
};
