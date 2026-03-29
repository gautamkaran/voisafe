import express from "express";
import { getMessages, sendMessage } from "../controllers/chat.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:complaintId", authenticate, getMessages);
router.post("/:complaintId", authenticate, sendMessage);

export default router;
