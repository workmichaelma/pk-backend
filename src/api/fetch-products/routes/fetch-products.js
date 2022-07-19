module.exports = {
  routes: [
    {
      method: "GET",
      path: "/fetch-products",
      handler: "fetch-products.fetchProducts",
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/cron-products",
      handler: "fetch-products.cronProducts",
      config: {
        policies: [],
        middlewares: [],
        auth: false,
      },
    },
  ],
};
