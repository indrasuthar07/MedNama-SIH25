import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import icdRoute from "./routes/icd-search.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGO_URI = "mongodb://127.0.0.1:27017/sih2026"; // database = sih2026
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB (sih2026)"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Mongoose Schema & Model for FHIR bundles
const diseaseSchema = new mongoose.Schema({
  bundle: { type: Object, required: true },
  savedAt: { type: Date, default: Date.now },
});
const Disease = mongoose.model("diseases", diseaseSchema);

app.use("/api/icd-search", icdRoute);

// Save FHIR diagnosis bundle
app.post("/api/save-diagnosis", async (req, res) => {
  const bundle = req.body;

  if (!bundle || bundle.resourceType !== "Bundle" || !Array.isArray(bundle.entry)) {
    return res.status(400).json({ error: "Invalid FHIR bundle format" });
  }

  try {
    const savedBundle = await Disease.create({ bundle });
    console.log("✅ Saved FHIR bundle to DB:", JSON.stringify(bundle, null, 2));

    res.json({
      success: true,
      message: "Bundle saved successfully",
      id: savedBundle._id,
    });
  } catch (err) {
    console.error("❌ Error saving bundle:", err);
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

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));;


