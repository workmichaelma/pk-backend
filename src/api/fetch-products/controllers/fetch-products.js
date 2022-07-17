"use strict";

/**
 * A set of functions called "actions" for `fetch-products`
 */

module.exports = {
  fetchProducts: async (ctx, next) => {
    try {
      const id = ctx?.request?.query || "";

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
};
