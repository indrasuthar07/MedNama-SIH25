import mongoose from "mongoose";

const diseaseSchema = new mongoose.Schema({
  icdCode: String,
  namasteCode: String,
  display: String,
  description: String,
  system: { type: String, default: "ICD-11" },
});

const Disease = mongoose.model("Disease", diseaseSchema);

export default Disease;
