// ticket/ticket_route.js
import express from 'express'
import { createTicket, getTickets } from '../../controllers/ticket/ticket_Controller.js'
import { authenticate, authorize } from '../../middlewares/auth_middleware';

const router = express.Router();

//USER
router.post('/', authenticate, authorize(['user']), createTicket);
router.get('/', authenticate, authorize(['user', 'admin', 'superadmin']), getTickets);

export default router;