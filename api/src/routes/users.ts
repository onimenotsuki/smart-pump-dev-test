import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import { validateUserUpdate } from '../middleware/validation';

const router = Router();
const userController = new UserController();

// All user routes require authentication
router.use(authenticateToken);

router.get('/me', userController.getProfile);
router.get('/me/balance', userController.getBalance);
router.put('/me', validateUserUpdate, userController.updateProfile);

export default router;
