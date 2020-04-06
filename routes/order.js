/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const { getAllItems } = require("../db/helpers/order.js");

module.exports = (db) => {
  router.get("/", (req, res) => {
    getAllItems(db)
      .then((items) => {
        res.render("menu", { items });
      });
  });

  router.post("/", (req, res) =>{
    console.log(req.body);

  })
  return router;
};
