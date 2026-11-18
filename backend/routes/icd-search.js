import express from "express";
import { searchTerminology } from "../services/terminology-service.js";

const router = express.Router();

router.get("/", (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);
  try {
    const results = searchTerminology({ query: q, limit: 50 });
    return res.json(results.flatMap((concept) => concept.mappings.map((mapping) => ({
      code: mapping.targets.find((target) => target.system === "ICD-11-TM2")?.code || mapping.id,
      icd: mapping.targets.find((target) => target.system === "ICD-11-TM2")?.code || "",
      namaste: mapping.namasteCode,
      display: mapping.namasteDisplay || concept.preferredTerm,
      biomedical: mapping.targets.find((target) => target.system === "BIOMEDICAL")?.code || "",
      biomedical_name: mapping.targets.find((target) => target.system === "BIOMEDICAL")?.display || "",
      description: mapping.evidence.note,
      confidence: mapping.confidence,
      confidenceReason: mapping.confidenceReason,
      reviewStatus: mapping.review.status,
    }))));
  } catch (err) {
    return res.status(500).json({ error: "Failed to search terminology" });
  }
});

export default router;
