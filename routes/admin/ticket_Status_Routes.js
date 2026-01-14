import express from "express";
import * as Status from "../../controllers/admin/ticket_Status_Controller.js";

const router = express.Router();

router.post("/", Status.createStatus);
router.get("/", Status.getStatuses);
router.get("/:id", Status.getStatus);
router.put("/:id", Status.updateStatus);
router.delete("/:id", Status.deleteStatus);

export default router;