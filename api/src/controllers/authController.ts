import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { LoginCredentials } from '../models/User';
import logger from '../config/logger';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const credentials: LoginCredentials = req.body;
      const result = await this.authService.login(credentials);
      
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Login controller error:', error);
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };
}
