import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth';
import { AuthService } from '../../services/authService';

// Mock the AuthService
jest.mock('../../services/authService');
jest.mock('../../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('Auth Routes', () => {
  let app: express.Application;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    
    mockAuthService = new AuthService() as jest.Mocked<AuthService>;
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockResponse = {
        token: 'jwt-token',
        user: {
          _id: '123',
          email: 'john@example.com',
          name: { first: 'John', last: 'Doe' },
        },
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockResponse,
      });
    });

    it('should return 400 for invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for missing password', async () => {
      const loginData = {
        email: 'john@example.com',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        error: 'Invalid credentials',
      });
    });
  });
});
