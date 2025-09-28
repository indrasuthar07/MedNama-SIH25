import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/", (req, res) => {
  const q = req.query.q?.toLowerCase() || "";
  if (!q) return res.json([]);

  let dualMap = [];
  try {
    // Make sure this path matches your backend folder structure
    const dataPath = path.join(process.cwd(), "Data", "data.json");
    dualMap = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  } catch (err) {
    console.error("Error reading data.json:", err);
    return res.status(500).json({ error: "Failed to read data.json" });
  }

const matches = dualMap
  .filter(
    (d) =>
      (d.icd?.toLowerCase() || "").includes(q) ||
      (d.biomedical?.toLowerCase() || "").includes(q) ||
      (d.namaste?.toLowerCase() || "").includes(q) ||
      (d.biomedical_name?.toLowerCase() || "").includes(q) ||
      (d.display?.toLowerCase() || "").includes(q) ||
      (d.description?.toLowerCase() || "").includes(q)
  )
  .sort((a, b) => {
    const aDisplay = (a.display || "").toLowerCase();
    const bDisplay = (b.display || "").toLowerCase();
    if (aDisplay.startsWith(q) && !bDisplay.startsWith(q)) return -1;
    if (!aDisplay.startsWith(q) && bDisplay.startsWith(q)) return 1;
    return 0; // keep original relative order otherwise
  });


  res.json(matches);
});

export default router;
