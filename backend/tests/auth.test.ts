import request from 'supertest';
import app from '../src/server';

describe('Authentication API', () => {
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'password123',
  };

  describe('POST /auth/signup', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/auth/signup').send(testUser);

      const response = await request(app)
        .post('/auth/signup')
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'User already exists');
    });

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({ email: 'invalid-email', password: 'password123' })
        .expect(400);

      expect(response.body.message).toContain('Validation error');
    });

    it('should reject short password', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({ email: 'test@example.com', password: '12345' })
        .expect(400);

      expect(response.body.message).toContain('Validation error');
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      await request(app).post('/auth/signup').send(testUser);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send(testUser)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testUser.email);
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: 'wrong-password' })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' })
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
});
