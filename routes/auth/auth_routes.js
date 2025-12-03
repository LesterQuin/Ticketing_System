import express from 'express';
import { register, login } from '../../controllers/auth/auth_Controller.js';
import { authenticate, authorize } from '../../middlewares/auth_middleware';

const router = express.Router();

// For registration of credentials
router.post('/register', register);
// For login of admin, user, superadmin
router.post('/login', login);

// Protected route
//router.get('/profile', authenticate, authorize(['user','admin']), profileController);

export default router;
