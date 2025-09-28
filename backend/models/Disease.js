import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema({
  icdCode: String,
  namasteCode: String,
  biomedicalCode: String,
  display: String,
  description: String,
  system: { type: String, default: "ICD-11 TM2" },
  system: { type: String, default: "Namaste" },
  system: { type: String, default: "Biomedical" },
});

const Disease = mongoose.model("Disease", diseaseSchema);

export default Disease;
