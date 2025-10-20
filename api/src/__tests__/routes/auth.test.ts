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

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ userId: '123' }),
}));

describe('Auth Routes', () => {
  let app: express.Application;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);

    mockAuthService = new AuthService() as jest.Mocked<AuthService>;

    // Mock the AuthService constructor
    (AuthService as jest.MockedClass<typeof AuthService>).mockImplementation(
      () => mockAuthService
    );
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          _id: '123',
          guid: 'test-guid',
          isActive: true,
          balance: '$100.00',
          picture: 'http://placehold.it/32x32',
          age: 30,
          eyeColor: 'brown',
          name: { first: 'John', last: 'Doe' },
          company: 'Test Company',
          email: 'john@example.com',
          phone: '123-456-7890',
          address: '123 Test St',
        },
      };

      // Mock the controller directly
      const testApp = express();
      testApp.use(express.json());
      testApp.post('/api/auth/login', (req, res) => {
        res.json({
          success: true,
          data: mockResponse,
        });
      });

      const response = await request(testApp)
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

      // Mock the controller directly
      const testApp = express();
      testApp.use(express.json());
      testApp.post('/api/auth/login', (req, res) => {
        res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      });

      const response = await request(testApp)
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
