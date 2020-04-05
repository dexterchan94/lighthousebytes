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
        let userType;
        if (req.session.user_id === "1" || req.session.user_id === "2") {
          userType = "admin";
        }
        res.render("orders", { orders, user_id: req.session.user_id, userType });
      });
  });

  router.post("/:id/accept", (req, res) => {
    console.log(`Order ${req.params.id} accepted! Estimated time: ${req.body.preptime} minutes`);
    res.redirect("/orders");
  });

  router.post("/:id/complete", (req, res) => {
    console.log(`Order ${req.params.id} completed!`);
    res.redirect("/orders");
  });
  return router;
};

