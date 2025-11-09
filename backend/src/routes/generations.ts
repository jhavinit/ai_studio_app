import express from "express";
import multer from "multer";
import path from "path";
import {
  createNewGeneration,
  getUserGenerations,
} from "../controllers/generationsController";
import { authMiddleware } from "../middleware/auth";
import fs from "fs";
import { appConfig } from "../configs/appConfig";

const router = express.Router();

const uploadsDir = path.join(__dirname, `../${appConfig.UPLOADS_DIR}`);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for files
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, _file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(_file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  },
});

router.post("/", authMiddleware, upload.single("image"), createNewGeneration);
router.get("/", authMiddleware, getUserGenerations);

export default router;
