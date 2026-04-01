import express from "express";
import {
  getAllOrganizations,
  approveOrganization,
  blockOrganization,
  createOrganization,
  getMyOrganization,
  updateMyOrganization,
  getMyOrganizationMembers,
} from "../controllers/admin.controller.js";
import {
  authenticate,
  authorizeRoles,
  requireApprovedOrganization,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Super Admin Routes
router.get(
  "/organizations",
  authenticate,
  authorizeRoles("superadmin"),
  getAllOrganizations,
); // Added auth/protect missing in original
router.post(
  "/organizations/create",
  authenticate,
  authorizeRoles("superadmin"),
  createOrganization,
);
router.patch(
  "/organizations/:id/approve",
  authenticate,
  authorizeRoles("superadmin"),
  approveOrganization,
);
router.patch(
  "/organizations/:id/block",
  authenticate,
  authorizeRoles("superadmin"),
  blockOrganization,
);

// Org Admin Routes
router.get(
  "/my-organization",
  authenticate,
  authorizeRoles("admin"),
  getMyOrganization,
);
router.patch(
  "/my-organization",
  authenticate,
  requireApprovedOrganization,
  authorizeRoles("admin"),
  updateMyOrganization,
);
router.get(
  "/my-organization/members",
  authenticate,
  authorizeRoles("admin"),
  getMyOrganizationMembers,
);

export default router;
