import express from "express";
import { getOrgUsers, createOrgUser, updateOrgUser, deleteOrgUser } from "../controllers/user.controller.js";
import { authenticate, authorizeRoles, requireApprovedOrganization } from "../middleware/auth.middleware.js";

const router = express.Router();

// Get internal org users
router.get(
  "/org",
  authenticate,
  requireApprovedOrganization,
  authorizeRoles("admin"),
  getOrgUsers
);

// Create internal org user
router.post(
  "/org",
  authenticate,
  requireApprovedOrganization,
  authorizeRoles("admin"),
  createOrgUser
);

// Manage org user
router.patch(
  "/org/:userId",
  authenticate,
  requireApprovedOrganization,
  authorizeRoles("admin"),
  updateOrgUser
);

// Remove org user
router.delete(
  "/org/:userId",
  authenticate,
  requireApprovedOrganization,
  authorizeRoles("admin"),
  deleteOrgUser
);

export default router;
