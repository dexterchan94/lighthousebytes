const express = require('express');
const router  = express.Router();
const { getAllOrders, acceptOrder, completeOrder, cancelOrder } = require("../db/helpers/orders");
const { sendMessage } = require("../db/helpers/message");
const { getUsernameWithID } = require("../db/helpers/username");

module.exports = (db) => {
  router.get("/", (req, res) => {
    const templateVars = {
      userType: "",
      user_id: req.session.user_id,
      username: null
    };

    if (req.session.user_id === "1" || req.session.user_id === "2") {
      templateVars.userType = "admin";
    }
    if (req.session.user_id) {
      getUsernameWithID(db, req.session.user_id)
        .then(username => {
          templateVars.username = username;
          res.render("orders", templateVars);
        })
    } else {
      res.render("orders", templateVars);
    }
  });

  router.get("/data", (req, res) => {
    getAllOrders(db)
      .then(orders => {
        let userType;
        if (req.session.user_id === "1" || req.session.user_id === "2") {
          userType = "admin";
        }
        res.json({ orders, user_id: req.session.user_id, userType});
      })
      .catch(err => console.log(err));
  });

  router.post("/:id/accept", (req, res) => {
    acceptOrder(db, req.params.id)
      .then(() => {
        const message = `Your order was accepted and will be ready for pickup in approximately ${req.body.preptime} minutes. Order ID: ${req.params.id}.`;
        sendMessage(db, req.params.id, message);
        res.send();
      })
      .catch(err => console.log(err));
  });

  router.post("/:id/complete", (req, res) => {
    completeOrder(db, req.params.id)
      .then(() => {
        const message = `Your order is ready for pickup! Order ID: ${req.params.id}.`;
        sendMessage(db, req.params.id, message);
        res.send();
      })
      .catch(err => console.log(err));
  });

  router.post("/:id/cancel", (req, res) => {
    cancelOrder(db, req.params.id)
      .then(() => {
        const message = `Your order was successfully cancelled! Order ID: ${req.params.id}.`;
        sendMessage(db, req.params.id, message);
        res.send();
      })
      .catch(err => console.log(err));
  });

  return router;
};

