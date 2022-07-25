module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */

  "*/180 * * * *": ({ strapi }) => {
    strapi.api["fetch-products"].services["cron-products"].cronProducts(
      "04010000"
    );
    // Add your own logic here (e.g. send a queue of email, create a database backup, etc.).
  },
};
