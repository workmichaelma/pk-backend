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
  ],
};
