//backend/routes/plants.js
const express = require("express");
const router = express.Router();
const store = require("../data/store.json");

router.get("/", (req, res) => {
  return res.status(200).json(store["plants"]);
});

module.exports = router;
