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
const port = Number(process.env.PORT || 8011);
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:4173,http://localhost:5173,http://localhost:3000,http://127.0.0.1:4173,http://127.0.0.1:5173").split(",").map((origin) => origin.trim()).filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  return /(^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$)|((\.vercel\.app|\.netlify\.app|\.render\.com)$)|green-guard/i.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await connectDB();

app.get("/", (req, res) => {
  res.json({
    service: "GreenGuard API",
    status: "ok",
    message: "GreenGuard backend is running.",
    endpoints: ["/api/health", "/api/auth", "/api/detections"],
  });
});

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

const startServer = () => {
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`GreenGuard server running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use. Stop the existing process or set PORT to another value.`);
      process.exit(1);
    }

    console.error("Server startup error:", error.message);
    process.exit(1);
  });
};

startServer();
