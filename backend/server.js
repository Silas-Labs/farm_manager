const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.get("/api/store/plants", (req, res) => {
  const filePath = path.join(__dirname, "data", "store.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Could not read file" });

    const items = JSON.parse(data);
    const { name } = req.query;

    if (!name) return res.json(items);

    const matchedKey = Object.keys(items.plants[0]).find(
      (key) => key.toLowerCase() === name.toLowerCase()
    );

    if (!matchedKey) {
      return res.status(404).json({ error: "Plant not found" });
    }

    return res.status(200).json(items.plants[0][matchedKey]);
  });
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
