import Organization from "../model/organization.model.js";
import User from "../model/user.model.js";

// @route   GET /api/admin/organizations
export const getAllOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orgs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   PATCH /api/admin/organizations/:id/approve
export const approveOrganization = async (req, res) => {
  try {
    const org = await Organization.findByIdAndUpdate(
      req.params.id,
      { status: "active" },
      { new: true }
    );
    if (!org) return res.status(404).json({ success: false, message: "Organization not found" });
    res.status(200).json({ success: true, message: `${org.name} has been approved.`, data: org });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   PATCH /api/admin/organizations/:id/block
export const blockOrganization = async (req, res) => {
  try {
    const org = await Organization.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!org) return res.status(404).json({ success: false, message: "Organization not found" });
    res.status(200).json({ success: true, message: `${org.name} has been blocked.`, data: org });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   POST /api/admin/organizations/create
// @desc    Super Admin directly creates an org + its admin account (auto-approved & active)
export const createOrganization = async (req, res) => {
  try {
    const {
      orgName, domain, collegeCode, contactEmail, typeOfOrg, address, description,
      adminName, adminEmail, adminPassword,
    } = req.body;

    // Validate required fields
    if (!orgName || !domain || !collegeCode || !contactEmail || !adminName || !adminEmail || !adminPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields (org details + admin credentials).",
      });
    }

    // Check for duplicate org
    const existingOrg = await Organization.findOne({ $or: [{ collegeCode }, { domain: domain.toLowerCase() }] });
    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: existingOrg.collegeCode === collegeCode
          ? "An organization with this College Code already exists."
          : "An organization with this Domain already exists.",
      });
    }

    // Check for duplicate admin email
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "A user with this admin email already exists." });
    }

    // Create Organization — immediately active since Super Admin is creating it
    const org = await Organization.create({
      name: orgName,
      domain: domain.toLowerCase(),
      collegeCode,
      contactEmail: contactEmail.toLowerCase(),
      typeOfOrg: typeOfOrg || "college",
      address: address || "",
      description: description || "",
      status: "active",
    });

    // Create Admin User linked to the new org
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: "admin",
      orgId: org._id,
    });

    res.status(201).json({
      success: true,
      message: `"${org.name}" onboarded successfully with admin account.`,
      data: {
        org,
        admin: {
          _id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        },
      },
    });
  } catch (error) {
    console.error("Create org error:", error);
    res.status(500).json({ success: false, message: "Server error: " + error.message });
  }
};
