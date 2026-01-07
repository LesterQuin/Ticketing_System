import express from 'express';
import { register, login, getAllUsers, getUser, updateUser, removeUser} from '../../controllers/auth/auth_Controller.js';
import { authenticate, authorize } from '../../middlewares/auth_middleware';
import { validateEmail } from '../../middlewares/validate_email.js';


const router = express.Router();

//--------------------------POST------------------------
// For registration of credentials
router.post('/register', validateEmail, register);
// For login of admin, user, superadmin
router.post('/login', validateEmail, login);

//--------------------------GET-------------------------
router.get('/users', getAllUsers);

router.get('/users/:id', authorize(['user', 'admin']), getUser);

router.put('/users/:id', updateUser);

router.delete('/users/:id', authenticate, authorize(['user', 'admin']), removeUser);
// Protected route
//router.get('/profile', authenticate, authorize(['user','admin']), profileController);

export default router;
