import mongoose from "mongoose";

const TerminologySchema = new mongoose.Schema({
  system: { type: String, required: true },
  code: { type: String, required: true },
  display: { type: String, required: true },
  description: { type: String },
  dual: [
    {
      system: String,
      code: String,
      display: String
    }
  ]
});

const Terminology = mongoose.model("Terminology", TerminologySchema);
export default Terminology;
