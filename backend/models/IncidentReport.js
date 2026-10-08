import mongoose from "mongoose";

const incidentReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    detection: { type: String, required: true },
    riskLevel: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    riskScore: { type: Number, default: 0 },
    status: { type: String, default: "Under Review" },
    confidence: { type: Number, default: 0 },
    location: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "India" },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    reporter: { type: String, default: "System" },
    imageUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    detectedObjects: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("IncidentReport", incidentReportSchema);
