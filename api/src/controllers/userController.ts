import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { UserUpdateInput } from '../models/User';
import logger from '../config/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user!; // User is guaranteed to exist due to auth middleware
      
      // Remove password from response
      const { password, ...userProfile } = user;
      
      res.json({
        success: true,
        data: userProfile,
      });
    } catch (error) {
      logger.error('Get profile controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user profile',
      });
    }
  };

  getBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = req.user!; // User is guaranteed to exist due to auth middleware
      
      res.json({
        success: true,
        data: {
          balance: user.balance,
        },
      });
    } catch (error) {
      logger.error('Get balance controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user balance',
      });
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user!._id;
      const updateData: UserUpdateInput = req.body;
      
      const updatedUser = await this.userService.update(userId, updateData);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      // Remove password from response
      const { password, ...userProfile } = updatedUser;
      
      res.json({
        success: true,
        data: userProfile,
      });
    } catch (error) {
      logger.error('Update profile controller error:', error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      });
    }
  };
}
