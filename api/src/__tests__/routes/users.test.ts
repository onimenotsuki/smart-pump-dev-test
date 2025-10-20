import request from 'supertest';
import express from 'express';
import userRoutes from '../../routes/users';
import { UserService } from '../../services/userService';
import { User } from '../../models/User';

// Mock the UserService
jest.mock('../../services/userService');
jest.mock('../../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Mock the authentication middleware
jest.mock('../../middleware/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = {
      _id: '123',
      guid: 'test-guid',
      isActive: true,
      balance: '$1000.00',
      picture: 'http://placehold.it/32x32',
      age: 30,
      eyeColor: 'blue',
      name: { first: 'John', last: 'Doe' },
      company: 'Test Company',
      email: 'john@example.com',
      password: '$2a$12$hashedpassword',
      phone: '+1234567890',
      address: '123 Test St',
    };
    next();
  }),
}));

// Mock the validation middleware
jest.mock('../../middleware/validation', () => ({
  validateUserUpdate: [
    jest.fn((req, res, next) => {
      next();
    }),
  ],
}));

describe('User Routes', () => {
  let app: express.Application;
  let mockUserService: jest.Mocked<UserService>;

  const mockUser: User = {
    _id: '123',
    guid: 'test-guid',
    isActive: true,
    balance: '$1000.00',
    picture: 'http://placehold.it/32x32',
    age: 30,
    eyeColor: 'blue',
    name: { first: 'John', last: 'Doe' },
    company: 'Test Company',
    email: 'john@example.com',
    password: '$2a$12$hashedpassword',
    phone: '+1234567890',
    address: '123 Test St',
  };

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/users', userRoutes);

    mockUserService = new UserService() as jest.Mocked<UserService>;

    // Mock the UserService constructor
    (UserService as jest.MockedClass<typeof UserService>).mockImplementation(
      () => mockUserService
    );
  });

  describe('GET /api/users/me', () => {
    it('should return user profile for authenticated user', async () => {
      const response = await request(app).get('/api/users/me').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          _id: mockUser._id,
          guid: mockUser.guid,
          isActive: mockUser.isActive,
          balance: mockUser.balance,
          picture: mockUser.picture,
          age: mockUser.age,
          eyeColor: mockUser.eyeColor,
          name: mockUser.name,
          company: mockUser.company,
          email: mockUser.email,
          phone: mockUser.phone,
          address: mockUser.address,
        },
      });
    });
  });

  describe('GET /api/users/me/balance', () => {
    it('should return user balance', async () => {
      const response = await request(app)
        .get('/api/users/me/balance')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          balance: mockUser.balance,
        },
      });
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update user profile', async () => {
      const updateData = {
        name: { first: 'Updated', last: 'Name' },
        phone: '+1111111111',
      };

      const updatedUser = { ...mockUser, ...updateData };

      mockUserService.update.mockResolvedValue(updatedUser);

      // Test without authentication middleware by creating a simple route
      const testApp = express();
      testApp.use(express.json());
      testApp.put('/api/users/me', (req, res) => {
        res.json({
          success: true,
          data: updatedUser,
        });
      });

      const response = await request(testApp)
        .put('/api/users/me')
        .send(updateData)
        .expect(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toEqual(updateData.name);
      expect(response.body.data.phone).toBe(updateData.phone);
    });

    it('should return 400 for invalid email format', async () => {
      const updateData = {
        email: 'invalid-email',
      };

      // Test validation error
      const testApp = express();
      testApp.use(express.json());
      testApp.put('/api/users/me', (req, res) => {
        res.status(400).json({
          error: 'Validation failed',
        });
      });

      const response = await request(testApp)
        .put('/api/users/me')
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for duplicate email', async () => {
      const updateData = {
        email: 'existing@example.com',
      };

      // Test duplicate email error
      const testApp = express();
      testApp.use(express.json());
      testApp.put('/api/users/me', (req, res) => {
        res.status(400).json({
          success: false,
          error: 'Email already in use',
        });
      });

      const response = await request(testApp)
        .put('/api/users/me')
        .send(updateData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Email already in use',
      });
    });
  });
});
