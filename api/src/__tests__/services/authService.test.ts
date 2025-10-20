import { AuthService } from '../../services/authService';
import { UserService } from '../../services/userService';
import { User } from '../../models/User';

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn().mockReturnValue({ userId: '123' }),
}));

// Mock the UserService
jest.mock('../../services/userService');
jest.mock('../../config/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
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
    mockUserService = new UserService() as jest.Mocked<UserService>;
    authService = new AuthService();
    (authService as any).userService = mockUserService;
  });

  describe('login', () => {
    it('should return token and user data for valid credentials', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'password123',
      };
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.validatePassword.mockResolvedValue(true);

      const result = await authService.login(credentials);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('user');
      expect(result.user).not.toHaveProperty('password');
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        credentials.email
      );
      expect(mockUserService.validatePassword).toHaveBeenCalledWith(
        credentials.password,
        mockUser.password
      );
    });

    it('should throw error for non-existent user', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(authService.login(credentials)).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw error for inactive user', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      const credentials = {
        email: 'john@example.com',
        password: 'password123',
      };
      mockUserService.findByEmail.mockResolvedValue(inactiveUser);

      await expect(authService.login(credentials)).rejects.toThrow(
        'Account is inactive'
      );
    });

    it('should throw error for invalid password', async () => {
      const credentials = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.validatePassword.mockResolvedValue(false);

      await expect(authService.login(credentials)).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('verifyToken', () => {
    it('should return user for valid token', async () => {
      const token = 'valid-token';
      mockUserService.findById.mockResolvedValue(mockUser);

      const result = await authService.verifyToken(token);
      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid token', async () => {
      const token = 'invalid-token';

      // Mock jwt.verify to throw error
      const jwt = require('jsonwebtoken');
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = await authService.verifyToken(token);
      expect(result).toBeNull();
    });

    it('should return null for inactive user', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      const token = 'valid-token';
      mockUserService.findById.mockResolvedValue(inactiveUser);

      const result = await authService.verifyToken(token);
      expect(result).toBeNull();
    });
  });
});
