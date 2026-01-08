import express from "express";
import { createPriority, getPriorities, getPriority, updatePriority, deletePriority } from "../../controllers/admin/ticket_Priority_Controller.js"

const router = express.Router();

router.post("/", createPriority);
router.get("/", getPriorities);
router.get("/:id", getPriority);
router.put("/", updatePriority);
router.delete("/", deletePriority)

export default router;