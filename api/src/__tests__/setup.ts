// Set environment variables for tests
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

// Mock the database module
const mockDb = {
  data: {
    users: [],
  },
  read: jest.fn().mockResolvedValue(undefined),
  write: jest.fn().mockResolvedValue(undefined),
};

jest.mock('../config/database', () => ({
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
  db: mockDb,
}));

// Setup for tests
beforeAll(async () => {
  // Database is mocked, no need to initialize
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockDb.data.users = [];
  mockDb.read.mockResolvedValue(undefined);
  mockDb.write.mockResolvedValue(undefined);
});
