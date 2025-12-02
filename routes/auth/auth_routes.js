import express from 'express';
import { register, login } from '../../controllers/auth/auth_Controller.js';
//import { authenticate, authorize } from '../../middlewares/auth_middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
//router.get('/profile', authenticate, authorize(['user','admin']), profileController);

export default router;
