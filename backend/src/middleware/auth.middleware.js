import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import Organization from "../model/organization.model.js";
import config from "../config/config.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authorization failed. Token missing." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Authentication failed. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`,
      });
    }
    next();
  };
};

export const requireApprovedOrganization = async (req, res, next) => {
  try {
    if (!req.user.orgId) {
      return res.status(400).json({ success: false, message: "No organization associated with this user." });
    }

    const org = await Organization.findById(req.user.orgId);
    if (!org) {
      return res.status(404).json({ success: false, message: "Organization registry not found." });
    }

    /*
    if (org.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Institutional terminal is pending approval or has been suspended. Contact platform admin.",
      });
    }
    */

    next();
  } catch (error) {
    console.error("Org verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error during verification." });
  }
};
