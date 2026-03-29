import express from "express";
import {
  getOrgStats,
  getOrgComplaints,
  getOrgReports,
  getComplaintDetails,
  updateComplaintStatus,
  getMyComplaints,
  createComplaint
} from "../controllers/complaint.controller.js";
import { authenticate, authorizeRoles, requireApprovedOrganization } from "../middleware/auth.middleware.js";

const router = express.Router();

// Student routes
router.get("/my", authenticate, getMyComplaints);
router.post("/", authenticate, requireApprovedOrganization, createComplaint);

// Organization-wide complaint access (Admin/Committee)
router.get("/stats", authenticate, requireApprovedOrganization, authorizeRoles("admin", "committee"), getOrgStats);
router.get("/org", authenticate, requireApprovedOrganization, authorizeRoles("admin", "committee"), getOrgComplaints);
router.get("/reports", authenticate, requireApprovedOrganization, authorizeRoles("admin", "committee"), getOrgReports);

// Individual complaint management
router.get("/:id", authenticate, requireApprovedOrganization, authorizeRoles("admin", "committee"), getComplaintDetails);
router.patch("/:id/status", authenticate, requireApprovedOrganization, authorizeRoles("admin", "committee"), updateComplaintStatus);

export default router;
