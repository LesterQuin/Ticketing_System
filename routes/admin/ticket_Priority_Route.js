import express from "express";
import * as Priority from "../../controllers/admin/ticket_Priority_Controller.js"

const router = express.Router();

router.post("/", Priority.createPriority);
router.get("/", Priority.getPriorities);
router.get("/:id", Priority.getPriority);
router.put("/", Priority.updatePriority);
router.delete("/", Priority.deletePriority)

export default router;