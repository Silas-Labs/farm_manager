//backend/routes/expenses.js
const express = require("express");
const router = express.Router();

const expenses = [];

router.get("/", (req, res) => {
  const filters = { ...req.query };
  delete filters.id;
  let filtered = expenses.filter((expense) => {
    return Object.entries(filters).every(([key, value]) => {
      if (typeof expense[key] === "string") {
        return expense[key].toLowerCase() === String(value).toLowerCase();
      } else {
        return expense[key] == value;
      }
    });
  });
  return res.status(200).json({ message: filtered });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const exp = expenses.filter((it) => it.id == id);

  if (exp.length == 0)
    return res.status(404).json({ error: "no such expense" });

  return res.status(200).send(exp);
});

router.post("/", async (req, res) => {
  const payload = req.body;
  if (Array.isArray(payload)) {
    payload.forEach((item, idx) => {
      item.id = expenses.length + 1;
      expenses.push(item);
    });
  } else {
    payload.id = expenses.length + 1;
    expenses.push(payload);
  }
  return res.sendStatus(201);
});

module.exports = router;
