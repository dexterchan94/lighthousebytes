/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getAllOrders } = require("../db/helpers/orders");

module.exports = (db) => {
  router.get("/", (req, res) => {
    getAllOrders(db)
      .then((orders) => {
        console.log(orders);
        res.render("orders", { orders });
      });
  });
  return router;
};

