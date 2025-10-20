import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../../middleware/auth';
import { AuthService } from '../../services/authService';
import { User } from '../../models/User';

// Mock the AuthService
jest.mock('../../services/authService');
jest.mock('../../config/logger', () => ({
  error: jest.fn(),
}));

describe('authenticateToken middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockAuthService: jest.Mocked<AuthService>;

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
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    mockAuthService = new AuthService() as jest.Mocked<AuthService>;
  });

  it('should authenticate valid token and set user', async () => {
    mockReq.headers = { authorization: 'Bearer valid-token' };
    mockAuthService.verifyToken.mockResolvedValue(mockUser);

    await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 401 for missing token', async () => {
    await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access token required' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for malformed authorization header', async () => {
    mockReq.headers = { authorization: 'InvalidFormat' };

    await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access token required' });
  });

  it('should return 403 for invalid token', async () => {
    mockReq.headers = { authorization: 'Bearer invalid-token' };
    mockAuthService.verifyToken.mockResolvedValue(null);

    await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 500 for service errors', async () => {
    mockReq.headers = { authorization: 'Bearer valid-token' };
    mockAuthService.verifyToken.mockRejectedValue(new Error('Service error'));

    await authenticateToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
