import IncidentReport from "../models/IncidentReport.js";

export const createIncident = async (req, res) => {
  try {
    const incident = await IncidentReport.create({
      ...req.body,
      user: req.user?.id,
    });

    return res.status(201).json(incident);
  } catch (error) {
    console.error("Incident create error:", error);
    return res.status(500).json({ detail: "Unable to store incident report" });
  }
};

export const getIncidents = async (req, res) => {
  try {
    const incidents = await IncidentReport.find().sort({ createdAt: -1 });
    return res.json(incidents);
  } catch (error) {
    console.error("Get incidents error:", error);
    return res.status(500).json({ detail: "Unable to fetch incidents" });
  }
};

export const getIncidentById = async (req, res) => {
  try {
    const incident = await IncidentReport.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ detail: "Incident not found" });
    }
    return res.json(incident);
  } catch (error) {
    console.error("Get incident error:", error);
    return res.status(500).json({ detail: "Unable to fetch incident" });
  }
};

export const analyzeDemoImage = async (req, res) => {
  const fileName = req.file?.originalname || "forest-image.jpg";
  const lowered = fileName.toLowerCase();

  if (lowered.includes("cut") || lowered.includes("chainsaw") || lowered.includes("stump") || lowered.includes("timber")) {
    return res.json({
      relevant: true,
      activity_detected: true,
      risk_level: "HIGH",
      risk_score: 82,
      detections: [
        { label: "stump", confidence: 91 },
        { label: "timber", confidence: 88 },
        { label: "person", confidence: 84 },
      ],
      message: "Possible tree-cutting activity detected. Demo analysis result.",
      gps: null,
    });
  }

  return res.json({
    relevant: true,
    activity_detected: false,
    risk_level: "LOW",
    risk_score: 12,
    detections: [{ label: "tree", confidence: 93 }],
    message: "Tree/forest area detected. No clear cutting signs found.",
    gps: null,
  });
};
