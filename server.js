// server.js
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static("public"));

// Serve family data
app.get("/api/family", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/family.json", "utf8"));
  res.json(data);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

