// Mock for lowdb
const mockData = {
  users: [],
};

const mockDb = {
  data: mockData,
  read: jest.fn().mockResolvedValue(undefined),
  write: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockReturnValue({
    value: jest.fn().mockReturnValue([]),
    push: jest.fn().mockReturnValue({
      write: jest.fn().mockResolvedValue(undefined),
    }),
    find: jest.fn().mockReturnValue({
      value: jest.fn().mockReturnValue(undefined),
      assign: jest.fn().mockReturnValue({
        write: jest.fn().mockResolvedValue(undefined),
      }),
    }),
    filter: jest.fn().mockReturnValue({
      value: jest.fn().mockReturnValue([]),
    }),
  }),
};

const Low = jest.fn().mockImplementation(() => mockDb);

module.exports = {
  Low,
  JSONFile: jest.fn(),
};
