import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/family", (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, "data", "family.json"), "utf-8");
  res.json(JSON.parse(data));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
