const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.get('/api/store', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'store.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Could not read file' });

    const items = JSON.parse(data);
    const { name } = req.query;

    if (!name) return res.json(items);

    const filtered = items.filter(item =>
      item
    );

    res.json(filtered);
  });
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));