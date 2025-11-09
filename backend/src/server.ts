import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

import { initializeDatabase } from "./models/database";
import authRoutes from "./routes/auth";
import generationsRoutes from "./routes/generations";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:8080",
//     credentials: true,
//   })
// );
// todo: enabled for local dev test - we can remove when we have a dns and prod
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded images
app.use(
  "/uploads",
  express.static(path.join(__dirname, `./${process.env.UPLOADS_DIR}`))
);

// Routes
app.use("/auth", authRoutes);
app.use("/generations", generationsRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
);

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}
// startServer();

export default app;
