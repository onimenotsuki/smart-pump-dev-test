import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { User } from '../models/User';

export interface Database {
  users: User[];
}

const file = path.join(process.cwd(), process.env.DB_PATH || './data/database.json');
const adapter = new JSONFile<Database>(file);
const defaultData: Database = { users: [] };

export const db = new Low(adapter, defaultData);

export const initializeDatabase = async (): Promise<void> => {
  await db.read();
  
  // If database is empty, initialize with default data
  if (!db.data || !db.data.users || db.data.users.length === 0) {
    db.data = defaultData;
    await db.write();
  }
};
