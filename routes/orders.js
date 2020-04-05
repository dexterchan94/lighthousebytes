/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getAllOrders, acceptOrder, completeOrder } = require("../db/helpers/orders");

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
    acceptOrder(db, req.params.id)
      .then(() => {
        console.log(`Order ${req.params.id} accepted! Estimated time: ${req.body.preptime} minutes`);
        res.redirect("/orders");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.post("/:id/complete", (req, res) => {
    completeOrder(db, req.params.id)
      .then(() => {
        console.log(`Order ${req.params.id} completed!`);
        res.redirect("/orders");
      })
      .catch((err) => {
        console.log(err);
      });
  });
  return router;
};

