import express from "express";
import { assignTicket, getAssignedTickets, getUnassignedTickets, getTicketsByAgent, unassignTicket } from "../../controllers/ticket/ticket_Assign_Controller.js";

const router = express.Router();

router.post("/", assignTicket);
router.get("/assigned", getAssignedTickets);
router.get("/unassigned", getUnassignedTickets);
router.get("/agent/:agent_id", getTicketsByAgent);
router.delete("/:id", unassignTicket);

export default router;