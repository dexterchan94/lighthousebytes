/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

const { getAllItems, placeOrder } = require("../db/helpers/order.js");

module.exports = (db) => {
  router.get("/", (req, res) => {
    getAllItems(db)
      .then(items => {
        res.render("menu", { items });
      });
  });

  router.post("/", (req, res) => {
    console.log('happy!');
    placeOrder(db, req.body, req.session.user_id)
      .then(orderId => {
        res.send(200, orderId);
      })
      .catch(err => {
        console.log(err);
      });

  })
  return router;
};
