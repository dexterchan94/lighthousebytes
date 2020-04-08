/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { getAllItems, placeOrder } = require("../db/helpers/order.js");

const { getUsernameWithID } = require("../db/helpers/username.js");
const { sendMessage, sendMessageToAdmin } = require("../db/helpers/message.js");

module.exports = (db) => {

  router.get("/", (req, res) => {
    const templateVars = {
      user_id: req.session.user_id,
      username: null
    };

    getAllItems(db)
      .then(items => {
        templateVars.items = items;
        if (req.session.user_id) {
          getUsernameWithID(db, req.session.user_id)
            .then((username) => {
              templateVars.username = username;
              res.render("menu", templateVars);
            })
        } else {
          res.render("menu", templateVars);
        }
      });

  });

  router.post("/", (req, res) => {
    placeOrder(db, req.body, req.session.user_id)
      .then(orderId => {
        const customerMsg = `You have successfully placed an order! Order ID: ${orderId}.`;
        const adminMsg = `A customer has placed an order: ${orderId}. Please review and let the customer know!`;
        sendMessageToAdmin(db, adminMsg);
        sendMessage(db, orderId, customerMsg);
        res.send(200, orderId);
      })
      .catch(err => {
        console.log(err);
      });

  })
  return router;
};
