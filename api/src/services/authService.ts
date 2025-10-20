import jwt from 'jsonwebtoken';
import { UserService } from './userService';
import { User, LoginCredentials, AuthResponse } from '../models/User';
import logger from '../config/logger';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      // Find user by email
      const user = await this.userService.findByEmail(email);
      if (!user) {
        logger.warn(`Login attempt with non-existent email: ${email}`);
        throw new Error('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        logger.warn(`Login attempt with inactive user: ${email}`);
        throw new Error('Account is inactive');
      }

      // Validate password
      const isValidPassword = await this.userService.validatePassword(password, user.password);
      if (!isValidPassword) {
        logger.warn(`Invalid password attempt for user: ${email}`);
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = this.generateToken(user);

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      logger.info(`User logged in successfully: ${email}`);
      return {
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await this.userService.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        return null;
      }

      return user;
    } catch (error) {
      logger.error('Token verification error:', error);
      return null;
    }
  }

  private generateToken(user: User): string {
    const payload = {
      userId: user._id,
      email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });
  }
}
