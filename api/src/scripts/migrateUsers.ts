import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { User } from '../models/User';

interface OriginalUser {
  _id: string;
  guid: string;
  isActive: boolean;
  balance: string;
  picture: string;
  age: number;
  eyeColor: string;
  name: {
    first: string;
    last: string;
  };
  company: string;
  email: string;
  password: string; // plain text password
  phone: string;
  address: string;
}

const migrateUsers = async (): Promise<void> => {
  try {
    // Read original users.json - try both local and Docker paths
    let usersPath = path.join(process.cwd(), 'data/users.json');
    if (!fs.existsSync(usersPath)) {
      usersPath = path.join(process.cwd(), '../data/users.json');
    }

    if (!fs.existsSync(usersPath)) {
      throw new Error(
        `Users file not found. Tried: ${path.join(process.cwd(), 'data/users.json')} and ${path.join(process.cwd(), '../data/users.json')}`
      );
    }

    const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const originalUsers: OriginalUser[] = usersData.users;

    // Hash passwords and create new user objects
    const migratedUsers: User[] = await Promise.all(
      originalUsers.map(async user => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    // Create database directory if it doesn't exist
    const dbDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Write migrated data to database.json
    const dbPath = path.join(dbDir, 'database.json');
    const dbData = {
      users: migratedUsers,
    };

    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    console.log(`✅ Successfully migrated ${migratedUsers.length} users`);
    console.log(`📁 Database created at: ${dbPath}`);

    migratedUsers.forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name.first} ${user.name.last}`);
      console.log(`   Password: [HASHED] (original: ${user.password})`);
      console.log(`   Balance: ${user.balance}`);
    });
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  migrateUsers();
}

export { migrateUsers };
