import express from "express";
import * as Assign from "../../controllers/ticket/ticket_Assign_Controller.js";
const router = express.Router();

// Assign a ticket
router.post("/", Assign.assignTicket);

// Get all assignments
router.get("/", Assign.getAllAssignments);

// Get assigned tickets
router.get("/assigned", Assign.getAssignedTickets);

// Get unassigned tickets
router.get("/unassigned", Assign.getUnassignedTickets);

// Get tickets by agent
router.get("/tickets/agent/:agent_id", Assign.getTicketsByAgent);

// Get assignments by agent
router.get("/assignments/agent/:agent_id", Assign.getAssignmentsByAgent);

// Update assignment
router.put("/:id", Assign.updateAssignment);

// Unassign ticket
router.delete("/unassign/:id", Assign.unassignTicket);

// Delete assignment
router.delete("/:id", Assign.deleteAssignment);

export default router;