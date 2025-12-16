// ticket/ticket_route.js
import express from 'express'
import { createTicket } from '../../controllers/ticket/ticket_Controller.js'
import { authenticate, authorize } from '../../middlewares/auth_middleware';

const router = express.Router();

//USER
router.post('/', authenticate, authorize(['user']), createTicket);

export default router;