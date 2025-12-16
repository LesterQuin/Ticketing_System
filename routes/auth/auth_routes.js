import express from 'express';
import { register, login } from '../../controllers/auth/auth_Controller.js';
import { authenticate, authorize } from '../../middlewares/auth_middleware';

const router = express.Router();

//--------------------------POST------------------------
// For registration of credentials
router.post('/register', authenticate, authorize(['superadmin','admin']), register);
// For login of admin, user, superadmin
router.post('/login', login);

//--------------------------GET-------------------------
//router.get('/users', getUsers);

// Protected route
//router.get('/profile', authenticate, authorize(['user','admin']), profileController);

export default router;
