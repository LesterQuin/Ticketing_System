// routes/departments/department_Routes.js
import express from 'express';
import * as Department from '../../controllers/department/department_Controller.js';
import { authenticate, authorize } from '../../middlewares/auth_middleware';

const router = express.Router();

router.post('/', Department.createDepartment);
router.get('/', Department.getDepartments);
router.put('/:id', Department.updateDepartment);
router.delete('/:id', Department.deleteDepartment);

export default router;