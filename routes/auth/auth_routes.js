import express from 'express';
import { register, login } from '../../controllers/auth/auth_Controller.js';
import { authenticate, authorize } from '../../middlewares/auth_middleware';
import { validateEmail } from '../../middlewares/validate_email.js';


const router = express.Router();

//--------------------------POST------------------------
// For registration of credentials
router.post('/register', validateEmail, register);
// For login of admin, user, superadmin
router.post('/login', validateEmail, login);

//--------------------------GET-------------------------
//router.get('/users', getUsers);

// Protected route
//router.get('/profile', authenticate, authorize(['user','admin']), profileController);

export default router;
