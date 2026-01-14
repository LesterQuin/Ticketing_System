// ticket/ticket_route.js
import express from 'express'
import * as Route from '../../controllers/ticket/ticket_Controller.js'
import { authenticate, authorize } from '../../middlewares/auth_middleware';

const router = express.Router();

//USER
router.post('/', authenticate, authorize(['user']), Route.createTicket);
router.get('/', authenticate, authorize(['user', 'admin', 'superadmin']), Route.getTickets);

// ADMIN / SUPERADMIN
router.post('/assign', authenticate, authorize(['admin', 'superadmin']), Route.assignTicket);

// AGENT / ADMIN
router.post('/status', authenticate, authorize(['admin', 'superadmin']), Route.updateStatus);

// Comment
router.post('/:id/comment', authenticate, authorize(['user', 'admin', 'superadmin']), Route.addComment);

export default router;