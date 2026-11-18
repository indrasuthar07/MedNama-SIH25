import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "Data");
const outDir = path.join(root, "storage");
const sourceVersion = "NAMASTE national morbidity code files (repository snapshot 2025)";

const clean = (value) => String(value ?? "").replace(/\uFFFD/g, "").replace(/\s+/g, " ").trim();
const fold = (value) => clean(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
const aliases = (values) => [...new Set(values.map(clean).filter(Boolean))];

function rowsFromWorkbook(file) {
  const workbook = XLSX.readFile(file, { raw: false });
  return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
}

function toConcept(row, system, index) {
  const isAyurveda = system === "AYURVEDA";
  const isSiddha = system === "SIDDHA";
  const code = clean(row[isAyurveda || isSiddha ? "NAMC_CODE" : "NUMC_CODE"]);
  const term = clean(row[isAyurveda ? "NAMC_term" : isSiddha ? "NAMC_TERM" : "NUMC_TERM"]);
  const nativeTerm = clean(row[isAyurveda ? "NAMC_term_DEVANAGARI" : isSiddha ? "Tamil_term" : "Arabic_term"]);
  const diacriticTerm = clean(row[isAyurveda ? "NAMC_term_diacritical" : ""]);
  const id = `${system.toLowerCase()}:${code || `row-${index + 2}`}`;
  return {
    id,
    system,
    namasteCode: code,
    preferredTerm: term || nativeTerm || `Unnamed ${system} term`,
    transliteration: fold(term),
    aliases: aliases([term, nativeTerm, diacriticTerm, row.Short_definition]),
    symptoms: [],
    definition: clean(row.Long_definition || row.Short_definition),
    source: {
      file: path.basename(system === "AYURVEDA" ? "NATIONAL AYURVEDA MORBIDITY CODES.csv" : system === "SIDDHA" ? "NATIONAL SIDDHA MORBIDITY CODES.xls" : "NATIONAL UNANI MORBIDITY CODES.xls"),
      version: sourceVersion,
      row: index + 2,
      sourceId: clean(row.NAMC_ID || row.NUMC_ID),
      reference: clean(row.Reference),
    },
  };
}

function findConceptsByCode(concepts, code) {
  const normalized = clean(code);
  return concepts.filter((concept) =>
    concept.namasteCode === normalized || concept.namasteCode.includes(`(${normalized})`) || concept.namasteCode.includes(normalized),
  );
}

function ingest() {
  const sources = [
    { file: "NATIONAL AYURVEDA MORBIDITY CODES.csv", system: "AYURVEDA" },
    { file: "NATIONAL SIDDHA MORBIDITY CODES.xls", system: "SIDDHA" },
    { file: "NATIONAL UNANI MORBIDITY CODES.xls", system: "UNANI" },
  ];
  const concepts = sources.flatMap(({ file, system }) => rowsFromWorkbook(path.join(dataDir, file)).map((row, index) => toConcept(row, system, index)));
  const seedMappings = JSON.parse(fs.readFileSync(path.join(dataDir, "data.json"), "utf8"));
  const mappings = seedMappings.map((seed, index) => {
    const matchedConcepts = findConceptsByCode(concepts, seed.namaste);
    const concept = matchedConcepts.find((candidate) => candidate.system === "AYURVEDA") || matchedConcepts[0];
    return {
      id: `seed-${index + 1}`,
      conceptId: concept?.id ?? null,
      namasteCode: clean(seed.namaste),
      namasteDisplay: clean(seed.display),
      targets: [
        { system: "ICD-11-TM2", code: clean(seed.icd), display: clean(seed.display) },
        ...(clean(seed.biomedical) ? [{ system: "BIOMEDICAL", code: clean(seed.biomedical), display: clean(seed.biomedical_name) }] : []),
      ],
      mappingType: "curated-crosswalk",
      evidence: { source: "repository Data/data.json", row: index + 1, note: clean(seed.description) },
      confidence: 0.82,
      confidenceReason: "Curated seed crosswalk; requires clinical review before production use.",
      review: { status: "PENDING", reviewer: null, reason: null, reviewedAt: null },
      createdAt: new Date().toISOString(),
    };
  });
  const catalogue = {
    schemaVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    sourceVersion,
    counts: { concepts: concepts.length, mappings: mappings.length },
    concepts,
    mappings,
  };
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "terminology-catalogue.json"), JSON.stringify(catalogue, null, 2));
  for (const file of ["reviews.json", "audit-events.json"]) {
    const target = path.join(outDir, file);
    if (!fs.existsSync(target)) fs.writeFileSync(target, "[]\n");
  }
  console.log(`Ingested ${concepts.length} concepts and ${mappings.length} curated mapping assertions.`);
}

ingest();
