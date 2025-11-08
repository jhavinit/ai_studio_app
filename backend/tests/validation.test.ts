import { z } from 'zod';

describe('Input Validation Schemas', () => {
  describe('Signup Schema', () => {
    const signupSchema = z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    });

    it('should validate correct signup data', () => {
      const data = { email: 'test@example.com', password: 'password123' };
      const result = signupSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const data = { email: 'invalid-email', password: 'password123' };
      const result = signupSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const data = { email: 'test@example.com', password: '12345' };
      const result = signupSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('Generation Schema', () => {
    const generationSchema = z.object({
      prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt too long'),
      style: z.enum(['photorealistic', 'artistic', 'abstract', 'vintage', 'modern']),
    });

    it('should validate correct generation data', () => {
      const data = { prompt: 'A beautiful sunset', style: 'photorealistic' as const };
      const result = generationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should reject empty prompt', () => {
      const data = { prompt: '', style: 'artistic' as const };
      const result = generationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject invalid style', () => {
      const data = { prompt: 'Test', style: 'invalid' };
      const result = generationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should reject prompt that is too long', () => {
      const data = { prompt: 'A'.repeat(1001), style: 'modern' as const };
      const result = generationSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
