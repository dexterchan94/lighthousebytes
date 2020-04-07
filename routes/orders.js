/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getAllOrders, acceptOrder, completeOrder } = require("../db/helpers/orders");
const { sendMessage } = require("../db/helpers/message");

module.exports = (db) => {
  router.get("/", (req, res) => {
    let userType;
    if (req.session.user_id === "1" || req.session.user_id === "2") {
      userType = "admin";
    }
    res.render("orders", { user_id: req.session.user_id, userType });
  });

  router.get("/data", (req, res) => {
    getAllOrders(db)
      .then((orders) => {
        let userType;
        if (req.session.user_id === "1" || req.session.user_id === "2") {
          userType = "admin";
        }
        res.json({ orders, user_id: req.session.user_id, userType});
      })
      .catch((err) => {
        console.log(err);
      });
  });



  router.post("/:id/accept", (req, res) => {
    acceptOrder(db, req.params.id)
      .then(() => {
        sendMessage()
        res.send();
      })
      .catch((err) => {
        console.log(err);
      });
  });




  router.post("/:id/complete", (req, res) => {
    completeOrder(db, req.params.id)
      .then(() => {
        res.send();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  return router;
};

