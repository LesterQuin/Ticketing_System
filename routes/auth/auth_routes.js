import express from 'express';
import * as Auth from '../../controllers/auth/auth_Controller.js';
import { authenticate, authorize } from '../../middlewares/auth_middleware';
import { validateEmail } from '../../middlewares/validate_email.js';

const router = express.Router();

// ---------------- POST ----------------

// Public registration for testing only
// You can send role: "user" | "admin" | "Super Admin" in Postman
router.post('/register/test', validateEmail, Auth.register);

// Admin-only registration
router.post('/register', authenticate, authorize(['admin', 'superadmin']), validateEmail, Auth.register); // done

// Login
router.post('/login', validateEmail, Auth.login); // done

// Logout
router.post('/logout', authenticate, Auth.logout);

// ---------------- GET ----------------
// Admin: get all users
router.get('/users', authenticate, authorize(['admin','Super Admin']), Auth.getAllUsers); // done

// Admin: get single user
router.get('/users/:id', authenticate, authorize(['admin','Super Admin']), Auth.getUser); // dones

// User: get own profile
router.get('/my/profile', authenticate, Auth.getMyProfile); // done

// ---------------- PUT ----------------
// Admin: update user
router.put('/users/:id', authenticate, authorize(['admin','Super Admin']), Auth.updateUser);

// User: update own profile
router.put('/my/profile', authenticate, Auth.updateMyProfile); // done 

// User: change password
router.put('/my/change-password', authenticate, Auth.changePassword); // done

// ---------------- DELETE ----------------
// Admin: delete user
router.delete('/users/:id', authenticate, authorize(['admin','Super Admin']), Auth.removeUser);

export default router;
