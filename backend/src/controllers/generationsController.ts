import { Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../middleware/auth";
import {
  createGeneration,
  findGenerationsByUserId,
} from "../models/Generation";
import { simulateGeneration } from "../services/generationService";
import fs from "fs";
import path from "path";
import { mockGenerateImage } from "../services/mockImageGenerator";

const generationSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1000, "Prompt too long"),
  style: z.enum([
    "photorealistic",
    "artistic",
    "abstract",
    "vintage",
    "modern",
  ]),
});

const deleteUploadedFile = (filePath?: string) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
      else console.log("🗑️ Deleted unused uploaded file:", filePath);
    });
  }
};

export const createNewGeneration = async (req: AuthRequest, res: Response) => {
  const uploadedFilePath = req.file
    ? path.join(__dirname, "../../uploads", req.file.filename)
    : undefined;

  try {
    const userId = req.userId;
    if (!userId) {
      deleteUploadedFile(uploadedFilePath);
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { prompt, style } = generationSchema.parse(req.body);

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const allowedMimes = ["image/jpeg", "image/png"];
    if (!allowedMimes.includes(req.file.mimetype)) {
      deleteUploadedFile(uploadedFilePath);
      return res
        .status(400)
        .json({ message: "Only JPEG and PNG images are allowed" });
    }

    if (req.file.size > 10 * 1024 * 1024) {
      deleteUploadedFile(uploadedFilePath);
      return res
        .status(400)
        .json({ message: "Image size must be less than 10MB" });
    }

    // Simulate AI generation process
    const result = await simulateGeneration();

    if (!result.success) {
      deleteUploadedFile(uploadedFilePath);
      return res.status(503).json({ message: result.message });
    }

    // ✅ MOCK AI GENERATION USING SHARP
    const generatedFilePath = await mockGenerateImage(
      uploadedFilePath!,
      prompt
    );

    // You can optionally delete the original uploaded image if you want
    deleteUploadedFile(uploadedFilePath);

    // Construct the new image URL for the generated version
    const generatedFilename = path.basename(generatedFilePath);
    const imageUrl = `http://localhost:${
      process.env.PORT || 3001
    }/uploads/${generatedFilename}`;

    // Save generation record in DB
    const generation = await createGeneration(
      userId,
      imageUrl,
      prompt,
      style,
      "success"
    );

    res.json({
      id: generation.id,
      imageUrl: generation.image_url,
      prompt: generation.prompt,
      style: generation.style,
      createdAt: generation.created_at,
      status: generation.status,
    });
  } catch (error: any) {
    deleteUploadedFile(uploadedFilePath);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    console.error("Generation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserGenerations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const limit = parseInt(req.query.limit as string) || 5;

    const generations = await findGenerationsByUserId(userId, limit);

    const formattedGenerations = generations.map((g) => ({
      id: g.id,
      imageUrl: g.image_url,
      prompt: g.prompt,
      style: g.style,
      createdAt: g.created_at,
      status: g.status,
    }));

    res.json(formattedGenerations);
  } catch (error) {
    console.error("Get generations error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
