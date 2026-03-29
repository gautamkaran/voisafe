import express from "express";
import {
  getAllOrganizations,
  approveOrganization,
  blockOrganization,
  createOrganization,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Super Admin Routes
router.get("/organizations", getAllOrganizations);
router.post("/organizations/create", createOrganization);
router.patch("/organizations/:id/approve", approveOrganization);
router.patch("/organizations/:id/block", blockOrganization);

export default router;
