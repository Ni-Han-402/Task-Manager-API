const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Midleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Task Manager Api");
});

app.listen(port, () => {
  console.log(`Task Manager listening on port ${port}`);
});
