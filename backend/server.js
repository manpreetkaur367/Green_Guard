import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import detectionRoutes from "./routes/detections.js";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
if (!process.env.MONGODB_URI && !process.env.JWT_SECRET) {
  dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });
}

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/detections", detectionRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "GreenGuard API" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    detail: err.message || "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`GreenGuard server running on http://localhost:${port}`);
});
