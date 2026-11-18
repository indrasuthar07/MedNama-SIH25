import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Fuse from "fuse.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storage = path.join(root, "storage");
const cataloguePath = path.join(storage, "terminology-catalogue.json");
const reviewsPath = path.join(storage, "reviews.json");
const auditPath = path.join(storage, "audit-events.json");
const normalize = (value) => String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

function ensureCatalogue() {
  if (!fs.existsSync(cataloguePath)) throw new Error("Terminology catalogue is missing. Run: npm run ingest:terminology");
  return readJson(cataloguePath);
}

function reviewedMappings(catalogue) {
  const decisions = fs.existsSync(reviewsPath) ? readJson(reviewsPath) : [];
  const latest = new Map();
  for (const decision of decisions) latest.set(decision.mappingId, decision);
  return catalogue.mappings.map((mapping) => {
    const review = latest.get(mapping.id);
    return review ? { ...mapping, targets: review.status === "OVERRIDDEN" ? review.overrideTargets : mapping.targets, review } : mapping;
  });
}

function scoreResult(query, item, fuseScore) {
  const q = normalize(query);
  const values = [item.preferredTerm, item.transliteration, item.namasteCode, ...(item.aliases || [])].map(normalize);
  if (values.includes(q)) return { score: 1, reason: "Exact preferred term, alias, transliteration, or NAMASTE code match." };
  if (values.some((value) => value.startsWith(q))) return { score: 0.92, reason: "Prefix match on a preferred term, alias, transliteration, or NAMASTE code." };
  return { score: Math.max(0.35, Number((1 - (fuseScore ?? 0.7)).toFixed(2))), reason: "Fuzzy terminology match; review the concept and mapping evidence before use." };
}

export function searchTerminology({ query, system, symptom, limit = 20 }) {
  const catalogue = ensureCatalogue();
  const filtered = catalogue.concepts.filter((concept) => !system || concept.system === system);
  const q = query || symptom;
  const candidates = symptom
    ? filtered.filter((concept) => normalize(`${concept.definition} ${concept.symptoms.join(" ")}`).includes(normalize(symptom)))
    : filtered;
  const fuse = new Fuse(candidates, { keys: ["preferredTerm", "transliteration", "aliases", "namasteCode", "definition"], includeScore: true, threshold: 0.42, ignoreLocation: true });
  const rows = q ? fuse.search(q) : candidates.slice(0, limit).map((item) => ({ item, score: 0 }));
  const mappings = reviewedMappings(catalogue);
  return rows.slice(0, limit).map(({ item, score }) => {
    const ranking = scoreResult(q, item, score);
    return {
      ...item,
      ranking,
      mappings: mappings.filter((mapping) => mapping.conceptId === item.id || mapping.namasteCode === item.namasteCode),
    };
  });
}

export function getConcept(id) {
  const catalogue = ensureCatalogue();
  const concept = catalogue.concepts.find((item) => item.id === id);
  if (!concept) return null;
  return { ...concept, mappings: reviewedMappings(catalogue).filter((mapping) => mapping.conceptId === id || mapping.namasteCode === concept.namasteCode) };
}

export function findMappings({ namasteCode, targetSystem, targetCode }) {
  const catalogue = ensureCatalogue();
  return reviewedMappings(catalogue).filter((mapping) =>
    (!namasteCode || normalize(mapping.namasteCode) === normalize(namasteCode)) &&
    (!targetSystem || mapping.targets.some((target) => target.system === targetSystem)) &&
    (!targetCode || mapping.targets.some((target) => normalize(target.code) === normalize(targetCode))),
  );
}

export function getMapping(id) {
  return findMappings({}).find((mapping) => mapping.id === id) ?? null;
}

export function reviewMapping(mappingId, input, actor) {
  if (!getMapping(mappingId)) return null;
  const decision = {
    mappingId,
    status: input.status,
    reviewer: input.reviewer || actor,
    reason: input.reason,
    overrideTargets: input.overrideTargets || null,
    reviewedAt: new Date().toISOString(),
  };
  const decisions = fs.existsSync(reviewsPath) ? readJson(reviewsPath) : [];
  decisions.push(decision);
  writeJson(reviewsPath, decisions);
  appendAudit({ actor, action: "MAPPING_REVIEWED", entityType: "Mapping", entityId: mappingId, details: { status: decision.status, reason: decision.reason } });
  return { ...getMapping(mappingId), review: decision };
}

export function appendAudit({ actor = "anonymous", action, entityType, entityId, details = {} }) {
  const events = fs.existsSync(auditPath) ? readJson(auditPath) : [];
  const previousHash = events.at(-1)?.hash ?? "GENESIS";
  const event = { id: crypto.randomUUID(), at: new Date().toISOString(), actor, action, entityType, entityId, details, previousHash };
  event.hash = crypto.createHash("sha256").update(JSON.stringify(event)).digest("hex");
  events.push(event);
  writeJson(auditPath, events);
  return event;
}

export function catalogueSummary() {
  const catalogue = ensureCatalogue();
  return { schemaVersion: catalogue.schemaVersion, generatedAt: catalogue.generatedAt, sourceVersion: catalogue.sourceVersion, counts: catalogue.counts };
}
