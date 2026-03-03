//backend/server.js
const express = require("express");
const router = require("./routes/plants");


const app = express();
const PORT = 3000;

app.use("/api/store/plants", router);

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
