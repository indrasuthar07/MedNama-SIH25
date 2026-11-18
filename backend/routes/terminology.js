import express from "express";
import { z } from "zod";
import { appendAudit, catalogueSummary, findMappings, getConcept, getMapping, reviewMapping, searchTerminology } from "../services/terminology-service.js";

const router = express.Router();
const systems = ["AYURVEDA", "SIDDHA", "UNANI"];
const searchSchema = z.object({ q: z.string().trim().max(120).optional(), system: z.enum(systems).optional(), symptom: z.string().trim().max(120).optional(), limit: z.coerce.number().int().min(1).max(50).default(20) }).refine((input) => input.q || input.symptom, { message: "Provide q or symptom." });
const reviewSchema = z.object({ status: z.enum(["ACCEPTED", "REJECTED", "OVERRIDDEN"]), reviewer: z.string().trim().min(2).max(120).optional(), reason: z.string().trim().min(5).max(1000), overrideTargets: z.array(z.object({ system: z.string().min(2).max(80), code: z.string().min(1).max(80), display: z.string().min(1).max(300) })).min(1).optional() }).superRefine((input, context) => { if (input.status === "OVERRIDDEN" && !input.overrideTargets) context.addIssue({ code: "custom", message: "overrideTargets are required for an overridden mapping." }); });

const validate = (schema, source) => (req, res, next) => { const result = schema.safeParse(req[source]); if (!result.success) return res.status(400).json({ error: "VALIDATION_ERROR", details: result.error.issues }); req.validated = result.data; next(); };

router.get("/metadata", (req, res) => res.json(catalogueSummary()));
router.get("/search", validate(searchSchema, "query"), (req, res, next) => { try { const results = searchTerminology({ ...req.validated, query: req.validated.q }); appendAudit({ actor: req.get("x-demo-actor") || "anonymous", action: "TERMINOLOGY_SEARCHED", entityType: "Terminology", entityId: req.validated.q || req.validated.symptom, details: { system: req.validated.system, resultCount: results.length } }); res.json({ query: req.validated, results }); } catch (error) { next(error); } });
router.get("/concepts/:id", (req, res, next) => { try { const concept = getConcept(req.params.id); if (!concept) return res.status(404).json({ error: "CONCEPT_NOT_FOUND" }); res.json(concept); } catch (error) { next(error); } });
router.get("/mappings", (req, res, next) => { try { const mappings = findMappings(req.query); res.json({ results: mappings, total: mappings.length }); } catch (error) { next(error); } });
router.get("/mappings/:id", (req, res, next) => { try { const mapping = getMapping(req.params.id); if (!mapping) return res.status(404).json({ error: "MAPPING_NOT_FOUND" }); res.json(mapping); } catch (error) { next(error); } });
router.post("/mappings/:id/reviews", validate(reviewSchema, "body"), (req, res, next) => { try { const mapping = reviewMapping(req.params.id, req.validated, req.get("x-demo-actor") || "demo-reviewer"); if (!mapping) return res.status(404).json({ error: "MAPPING_NOT_FOUND" }); res.status(201).json(mapping); } catch (error) { next(error); } });

export default router;
