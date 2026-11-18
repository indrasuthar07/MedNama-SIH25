import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import icdRoute from "./routes/icd-search.js";
import terminologyRoute from "./routes/terminology.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mednama";
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

// Middleware
app.use(helmet());
app.use(cors({ origin: allowedOrigin, methods: ["GET", "POST"], allowedHeaders: ["Content-Type", "X-Demo-Actor"] }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 500, standardHeaders: "draft-8", legacyHeaders: false }));

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => {
  if (process.env.ALLOW_DATABASELESS_DEMO === "true") console.warn("MongoDB unavailable; terminology API remains available in demo mode.");
  else console.error("MongoDB connection error:", err.message);
});

// Define Mongoose Schema & Model for FHIR bundles
const diseaseSchema = new mongoose.Schema({
  bundle: { type: Object, required: true },
  savedAt: { type: Date, default: Date.now },
});
const Disease = mongoose.model("diseases", diseaseSchema);

app.use("/api/icd-search", icdRoute);
app.use("/api/v1/terminology", terminologyRoute);

// Save FHIR diagnosis bundle
app.post("/api/save-diagnosis", async (req, res) => {
  const bundle = req.body;

  if (!bundle || bundle.resourceType !== "Bundle" || !Array.isArray(bundle.entry)) {
    return res.status(400).json({ error: "Invalid FHIR bundle format" });
  }

  try {
    const savedBundle = await Disease.create({ bundle });
    res.json({
      success: true,
      message: "Bundle saved successfully",
      id: savedBundle._id,
    });
  } catch (err) {
    console.error("Error saving bundle:", err);
    res.status(500).json({ error: "Failed to save bundle" });
  }
});

// Optional: Get all saved bundles
app.get("/api/saved-bundles", async (req, res) => {
  try {
    const bundles = await Disease.find();
    res.json(bundles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bundles" });
  }
});

// Simple test route
app.get("/", (req, res) => res.send("Backend running ✅"));

app.use((error, req, res, next) => {
  console.error("Unhandled API error", { path: req.path, message: error.message });
  res.status(500).json({ error: "INTERNAL_SERVER_ERROR", message: "The request could not be completed." });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


