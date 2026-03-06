//backend/routes/plants.js
const express = require("express");
const router = express.Router();
const store = require("../data/store.json");

router.get("/", (req, res) => {
  return res.status(200).json(store["plants"]);
});

router.get("/:plant", (req, res) => {
  const { plant } = req.params;
  const plants = store["plants"][0];
    console.log("pARAM: ",plants)
  const matchKey = Object.keys(plants).find(
    (it) => it.toLocaleLowerCase() === plant.toLocaleLowerCase()
  );

  if (matchKey) return res.status(200).json(plants[matchKey]);

  return res.status(400).json({ error: "Plant not found" });
});

router.get("/:plant/varieties", (req, res) => {
  const { plant } = req.params;
  const plants = store["plants"][0];
    console.log("pARAM: ",plants)
  const matchKey = Object.keys(plants).find(
    (it) => it.toLocaleLowerCase() === plant.toLocaleLowerCase()
  );

  if (matchKey) return res.status(200).json(plants[matchKey]["varieties"]);

  return res.status(404).json({ error: "No such plant or varieties" });
});

module.exports = router ;
