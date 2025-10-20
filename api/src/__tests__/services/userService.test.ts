import { UserService } from '../../services/userService';
import { User, UserCreateInput, UserUpdateInput } from '../../models/User';
import { db } from '../../config/database';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$12$hashedpassword'),
  compare: jest.fn().mockImplementation((plain, hash) => {
    return plain === 'password123' && hash === '$2a$12$hashedpassword';
  }),
}));

// Mock the database
jest.mock('../../config/database', () => ({
  db: {
    read: jest.fn(),
    write: jest.fn(),
    data: { users: [] },
  },
}));

jest.mock('../../config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('UserService', () => {
  let userService: UserService;
  let mockDb: any;

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
    userService = new UserService();
    mockDb = db as any;
    mockDb.data = { users: [mockUser] };
    mockDb.read.mockResolvedValue(undefined);
    mockDb.write.mockResolvedValue(undefined);
  });

  describe('findByEmail', () => {
    it('should return user for existing email', async () => {
      const result = await userService.findByEmail('john@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existing email', async () => {
      const result = await userService.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      mockDb.read.mockRejectedValue(new Error('Database error'));
      await expect(userService.findByEmail('john@example.com')).rejects.toThrow(
        'Database error'
      );
    });
  });

  describe('findById', () => {
    it('should return user for existing ID', async () => {
      const result = await userService.findById('123');
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existing ID', async () => {
      const result = await userService.findById('999');
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const userData: UserCreateInput = {
      email: 'newuser@example.com',
      password: 'password123',
      name: { first: 'Jane', last: 'Smith' },
      phone: '+1987654321',
      address: '456 New St',
      company: 'New Company',
      age: 25,
      eyeColor: 'green',
    };

    it('should create new user with hashed password', async () => {
      const result = await userService.create(userData);

      expect(result).toMatchObject({
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        company: userData.company,
        age: userData.age,
        eyeColor: userData.eyeColor,
      });
      expect(result.password).not.toBe(userData.password);
      expect(result._id).toBeDefined();
      expect(result.guid).toBeDefined();
      expect(mockDb.write).toHaveBeenCalled();
    });

    it('should throw error for existing email', async () => {
      mockDb.data.users = [mockUser];
      await expect(
        userService.create({
          ...userData,
          email: mockUser.email,
        })
      ).rejects.toThrow('User already exists');
    });
  });

  describe('update', () => {
    const updateData: UserUpdateInput = {
      name: { first: 'Updated', last: 'Name' },
      phone: '+1111111111',
    };

    it('should update user data', async () => {
      const result = await userService.update('123', updateData);

      expect(result).toMatchObject({
        ...mockUser,
        name: updateData.name,
        phone: updateData.phone,
      });
      expect(mockDb.write).toHaveBeenCalled();
    });

    it('should return null for non-existing user', async () => {
      const result = await userService.update('999', updateData);
      expect(result).toBeNull();
    });

    it('should throw error for duplicate email', async () => {
      const anotherUser = {
        ...mockUser,
        _id: '456',
        email: 'another@example.com',
      };
      mockDb.data.users = [mockUser, anotherUser];

      await expect(
        userService.update('123', { email: 'another@example.com' })
      ).rejects.toThrow('Email already in use');
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const result = await userService.validatePassword(
        'password123',
        '$2a$12$hashedpassword'
      );
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const result = await userService.validatePassword(
        'wrongpassword',
        '$2a$12$hashedpassword'
      );
      expect(result).toBe(false);
    });
  });
});
