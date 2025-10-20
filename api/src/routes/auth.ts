import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateLogin } from '../middleware/validation';

const router = Router();
const authController = new AuthController();

router.post('/login', validateLogin, authController.login);

export default router;
