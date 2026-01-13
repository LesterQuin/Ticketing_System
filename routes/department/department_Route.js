// routes/departments/department_Routes.js
import express from 'express';
import { createDepartment, getDepartments, updateDepartment, deleteDepartment } from '../../controllers/department/department_Controller.js';
import { authenticate, authorize } from '../../middlewares/auth_middleware';

const router = express.Router();

router.post('/', createDepartment);
router.get('/', getDepartments);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;