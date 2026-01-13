import express from 'express';
import { register, login, getAllUsers, getUser, updateUser, removeUser,
    getMyProfile, updateMyProfile, changePassword, logout
} from '../../controllers/auth/auth_Controller.js';
import { authenticate, authorize } from '../../middlewares/auth_middleware';
import { validateEmail } from '../../middlewares/validate_email.js';

const router = express.Router();

// ---------------- POST ----------------

// Public registration for testing only
// You can send role: "user" | "admin" | "Super Admin" in Postman
router.post('/register/test', validateEmail, register);

// Admin-only registration
router.post('/register', authenticate, authorize(['admin', 'superadmin']), validateEmail, register); // done

// Login
router.post('/login', validateEmail, login); // done

// Logout
router.post('/logout', authenticate, logout);

// ---------------- GET ----------------
// Admin: get all users
router.get('/users', authenticate, authorize(['admin','Super Admin']), getAllUsers); // done

// Admin: get single user
router.get('/users/:id', authenticate, authorize(['admin','Super Admin']), getUser); // dones

// User: get own profile
router.get('/my/profile', authenticate, getMyProfile); // done

// ---------------- PUT ----------------
// Admin: update user
router.put('/users/:id', authenticate, authorize(['admin','Super Admin']), updateUser);

// User: update own profile
router.put('/my/profile', authenticate, updateMyProfile); // done 

// User: change password
router.put('/my/change-password', authenticate, changePassword); // done

// ---------------- DELETE ----------------
// Admin: delete user
router.delete('/users/:id', authenticate, authorize(['admin','Super Admin']), removeUser);

export default router;
