import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  appliedDate: { type: Date, default: Date.now },
  notes: { type: String },
});

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
