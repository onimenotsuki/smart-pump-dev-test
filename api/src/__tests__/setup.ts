import { initializeDatabase } from '../config/database';

// Setup for tests
beforeAll(async () => {
  await initializeDatabase();
});
