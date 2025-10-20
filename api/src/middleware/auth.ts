import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { User } from '../models/User';
import logger from '../config/logger';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const authService = new AuthService();
    const user = await authService.verifyToken(token);

    if (!user) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
