import bcrypt from 'bcryptjs';
import { db } from '../config/database';
import { User, UserCreateInput, UserUpdateInput } from '../models/User';
import logger from '../config/logger';

export class UserService {
  async findByEmail(email: string): Promise<User | null> {
    try {
      await db.read();
      const user = db.data?.users.find(u => u.email === email) || null;
      return user;
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw new Error('Database error');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      await db.read();
      const user = db.data?.users.find(u => u._id === id) || null;
      return user;
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw new Error('Database error');
    }
  }

  async create(userData: UserCreateInput): Promise<User> {
    try {
      await db.read();

      // Check if user already exists
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      const newUser: User = {
        _id: this.generateId(),
        guid: this.generateGuid(),
        isActive: true,
        balance: '$0.00',
        picture: 'http://placehold.it/32x32',
        age: userData.age,
        eyeColor: userData.eyeColor,
        name: userData.name,
        company: userData.company,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        address: userData.address,
      };

      if (!db.data) {
        db.data = { users: [] };
      }

      db.data.users.push(newUser);
      await db.write();

      logger.info(`User created: ${newUser.email}`);
      return newUser;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async update(id: string, updateData: UserUpdateInput): Promise<User | null> {
    try {
      await db.read();

      if (!db.data) {
        throw new Error('Database not initialized');
      }

      const userIndex = db.data.users.findIndex(u => u._id === id);
      if (userIndex === -1) {
        return null;
      }

      const currentUser = db.data.users[userIndex];
      if (!currentUser) {
        return null;
      }

      // Check if email is being updated and if it's already taken
      if (updateData.email && updateData.email !== currentUser.email) {
        const existingUser = await this.findByEmail(updateData.email);
        if (existingUser) {
          throw new Error('Email already in use');
        }
      }

      // Update user data
      const updatedUser: User = {
        ...currentUser,
        ...updateData,
        name: updateData.name
          ? {
              ...currentUser.name,
              ...updateData.name,
            }
          : currentUser.name,
      };

      db.data.users[userIndex] = updatedUser;
      await db.write();

      logger.info(`User updated: ${updatedUser.email}`);
      return updatedUser;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      logger.error('Error validating password:', error);
      return false;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
