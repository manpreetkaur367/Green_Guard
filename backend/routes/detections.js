import express from "express";
import multer from "multer";
import { createIncident, getIncidents, getIncidentById, analyzeDemoImage } from "../controllers/detectionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getIncidents);
router.post("/analyze", upload.single("file"), analyzeDemoImage);
router.get("/:id", getIncidentById);
router.post("/", protect, createIncident);

export default router;
