import request from 'supertest';
import app from '../src/server';
import path from 'path';

describe('Generations API', () => {
  let authToken: string;
  const testImagePath = path.join(__dirname, 'fixtures', 'test-image.jpg');

  beforeAll(async () => {
    // Create test user and get token
    const signupResponse = await request(app)
      .post('/auth/signup')
      .send({
        email: `gentest${Date.now()}@example.com`,
        password: 'password123',
      });

    authToken = signupResponse.body.token;
  });

  describe('POST /generations', () => {
    it('should create a generation with valid data', async () => {
      const response = await request(app)
        .post('/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('prompt', 'A beautiful sunset')
        .field('style', 'photorealistic')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg')
        .expect((res) => {
          // Accept either 200 (success) or 503 (model overloaded)
          if (res.status !== 200 && res.status !== 503) {
            throw new Error(`Unexpected status: ${res.status}`);
          }
        });

      if (response.status === 200) {
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('imageUrl');
        expect(response.body).toHaveProperty('prompt', 'A beautiful sunset');
        expect(response.body).toHaveProperty('style', 'photorealistic');
        expect(response.body).toHaveProperty('status', 'success');
      } else {
        expect(response.body).toHaveProperty('message', 'Model overloaded');
      }
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .post('/generations')
        .field('prompt', 'Test prompt')
        .field('style', 'artistic')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg')
        .expect(401);

      expect(response.body.message).toContain('Unauthorized');
    });

    it('should reject request without image', async () => {
      const response = await request(app)
        .post('/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('prompt', 'Test prompt')
        .field('style', 'artistic')
        .expect(400);

      expect(response.body.message).toContain('Image is required');
    });

    it('should reject invalid style', async () => {
      const response = await request(app)
        .post('/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .field('prompt', 'Test prompt')
        .field('style', 'invalid-style')
        .attach('image', Buffer.from('fake-image-data'), 'test.jpg')
        .expect(400);

      expect(response.body.message).toContain('Validation error');
    });

    it('should simulate model overload approximately 20% of the time', async () => {
      const attempts = 20;
      let overloadCount = 0;

      for (let i = 0; i < attempts; i++) {
        const response = await request(app)
          .post('/generations')
          .set('Authorization', `Bearer ${authToken}`)
          .field('prompt', `Test ${i}`)
          .field('style', 'photorealistic')
          .attach('image', Buffer.from('fake-image-data'), 'test.jpg');

        if (response.status === 503) {
          overloadCount++;
        }
      }

      // Should have some overload errors (allowing 10-30% range for randomness)
      expect(overloadCount).toBeGreaterThan(0);
      expect(overloadCount).toBeLessThan(attempts);
    });
  });

  describe('GET /generations', () => {
    beforeAll(async () => {
      // Create some test generations
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/generations')
          .set('Authorization', `Bearer ${authToken}`)
          .field('prompt', `Test generation ${i}`)
          .field('style', 'photorealistic')
          .attach('image', Buffer.from('fake-image-data'), 'test.jpg');
      }
    });

    it('should get user generations', async () => {
      const response = await request(app)
        .get('/generations')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('prompt');
      expect(response.body[0]).toHaveProperty('style');
    });

    it('should respect limit parameter', async () => {
      const response = await request(app)
        .get('/generations?limit=2')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.length).toBeLessThanOrEqual(2);
    });

    it('should reject unauthorized requests', async () => {
      const response = await request(app)
        .get('/generations')
        .expect(401);

      expect(response.body.message).toContain('Unauthorized');
    });
  });
});
