import express from "express";
import { createStatus, getStatuses, getStatus, updateStatus, deleteStatus } from "../../controllers/ticket/ticket_Status_Controller.js";

const router = express.Router();

router.post("/", createStatus);
router.get("/", getStatuses);
router.get("/:id", getStatus);
router.put("/:id", updateStatus);
router.delete("/:id", deleteStatus);

export default router;