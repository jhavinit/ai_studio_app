import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { createGeneration, findGenerationsByUserId } from '../models/Generation';
import { simulateGeneration } from '../services/generationService';

const generationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt too long'),
  style: z.enum(['photorealistic', 'artistic', 'abstract', 'vintage', 'modern']),
});

export const createNewGeneration = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate request body
    const { prompt, style } = generationSchema.parse(req.body);

    // Validate image upload
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Validate file type
    const allowedMimes = ['image/jpeg', 'image/png'];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: 'Only JPEG and PNG images are allowed' });
    }

    // Validate file size (10MB max)
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'Image size must be less than 10MB' });
    }

    // Simulate AI generation
    const result = await simulateGeneration();

    if (!result.success) {
      return res.status(503).json({ message: result.message });
    }

    // Save generation to database
    const imageUrl = `http://localhost:${process.env.PORT || 3001}/uploads/${req.file.filename}`;
    const generation = await createGeneration(userId, imageUrl, prompt, style, 'success');

    res.json({
      id: generation.id,
      imageUrl: generation.image_url,
      prompt: generation.prompt,
      style: generation.style,
      createdAt: generation.created_at,
      status: generation.status,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
      });
    }
    console.error('Generation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserGenerations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 5;

    const generations = await findGenerationsByUserId(userId, limit);

    const formattedGenerations = generations.map(g => ({
      id: g.id,
      imageUrl: g.image_url,
      prompt: g.prompt,
      style: g.style,
      createdAt: g.created_at,
      status: g.status,
    }));

    res.json(formattedGenerations);
  } catch (error) {
    console.error('Get generations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
