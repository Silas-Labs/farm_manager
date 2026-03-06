//backend/server.js
const express = require("express");
const plants = require("./routes/plants");
const expenses =  require("./routes/expenses");
const { configDotenv } = require("dotenv");

configDotenv()
const app = express();
app.use(express.json())


app.use("/api/store/plants", plants);
app.use("/api/store/expenses", expenses);

app.listen(process.env.PORT, () => console.log(`Running on http://localhost:${process.env.PORT}`));
