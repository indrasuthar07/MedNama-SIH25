// backend/routes/icd-search.js
import express from "express";
const router = express.Router();

// Dummy dataset of ICD-11 and NAMASTE codes
const diseases = [
  { code: "1A00", display: "Cholera", system: "ICD-11", namaste: "NMT001" },
  { code: "1A01", display: "Typhoid Fever", system: "ICD-11", namaste: "NMT002" },
  { code: "1A02", display: "Malaria", system: "ICD-11", namaste: "NMT003" },
  { code: "8E64.Z", display: "Anxiety Disorder", system: "ICD-11", namaste: "NMT004" },
  { code: "5B50", display: "Diabetes Mellitus", system: "ICD-11", namaste: "NMT005" },
  { code: "BA40", display: "Hypertension", system: "ICD-11", namaste: "NMT006" },
  { code: "CA23", display: "Asthma", system: "ICD-11", namaste: "NMT007" },
  { code: "DA11", display: "Migraine", system: "ICD-11", namaste: "NMT008" },
  { code: "EA90", display: "Tuberculosis", system: "ICD-11", namaste: "NMT009" },
  { code: "FA33", display: "Pneumonia", system: "ICD-11", namaste: "NMT010" },
  { code: "GA12", display: "Chickenpox", system: "ICD-11", namaste: "NMT011" },
  { code: "HA45", display: "Measles", system: "ICD-11", namaste: "NMT012" },
  { code: "IA27", display: "Hepatitis B", system: "ICD-11", namaste: "NMT013" },
  { code: "JA99", display: "COVID-19", system: "ICD-11", namaste: "NMT014" },
  { code: "KA10", display: "Influenza", system: "ICD-11", namaste: "NMT015" },
  { code: "LA77", display: "Dengue Fever", system: "ICD-11", namaste: "NMT016" },
  { code: "MA32", display: "Leprosy", system: "ICD-11", namaste: "NMT017" },
  { code: "NA55", display: "Rabies", system: "ICD-11", namaste: "NMT018" },
  { code: "OA88", display: "Tetanus", system: "ICD-11", namaste: "NMT019" },
  { code: "PA11", display: "Scarlet Fever", system: "ICD-11", namaste: "NMT020" },
  { code: "QA66", display: "Mumps", system: "ICD-11", namaste: "NMT021" },
  { code: "RA42", display: "Whooping Cough", system: "ICD-11", namaste: "NMT022" },
  { code: "SA13", display: "Ebola Virus Disease", system: "ICD-11", namaste: "NMT023" },
  { code: "TA09", display: "Zika Virus Infection", system: "ICD-11", namaste: "NMT024" },
  { code: "UA77", display: "Polio", system: "ICD-11", namaste: "NMT025" },
];

// GET /api/icd-search?q=<query>
router.get("/", (req, res) => {
  const q = req.query.q?.toLowerCase() || "";
  if (!q) return res.json([]);
  const matches = diseases.filter(
    (d) =>
      d.display.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.namaste.toLowerCase().includes(q)
  );
  res.json(matches);
});

export default router;
