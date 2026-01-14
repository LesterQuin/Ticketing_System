import express from "express";
//import { assignTicket, getAssignedTickets, getUnassignedTickets, getTicketsByAgent, unassignTicket } from "../../controllers/ticket/ticket_Assign_Controller.js";
import * as Assign from "../../controllers/ticket/ticket_Assign_Controller.js";
const router = express.Router();

router.post("/", Assign.assignTicket);
router.get("/assigned", Assign.getAssignedTickets);
router.get("/unassigned", Assign.getUnassignedTickets);
router.get("/agent/:agent_id", Assign.getTicketsByAgent);
router.delete("/:id", Assign.unassignTicket);


router.get("/", Assign.getAllAssignments);
router.get("/agent/:agent_id", Assign.getAssignmentsByAgent);
router.put("/", Assign.updateAssignment);
router.delete("/:id", Assign.deleteAssignment);

export default router;