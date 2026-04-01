import User from "../model/user.model.js";

// @route   GET /api/users/org
// @desc    Get all users in organization (Admins can see all)
export const getOrgUsers = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    if (!orgId)
      return res
        .status(400)
        .json({ success: false, message: "Organization ID missing." });

    const users = await User.find({ orgId })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    console.error("Get organization users error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   POST /api/users/org
// @desc    Admin creates a user manually (e.g., committee member)
export const createOrgUser = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all user details." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered." });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      orgId,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "User created successfully.",
        data: user,
      });
  } catch (err) {
    console.error("Create organization user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   PATCH /api/users/org/:userId
// @desc    Admin updates user role/status
export const updateOrgUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, status } = req.body;
    const orgId = req.user.orgId;

    const user = await User.findOne({ _id: userId, orgId });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    if (role) user.role = role;
    // status could be used for blocking/unblocking

    await user.save();
    res.json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });
  } catch (err) {
    console.error("Update org user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   DELETE /api/users/org/:userId
// @desc    Admin removes a user from organization
export const deleteOrgUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orgId = req.user.orgId;

    // Find user to check role
    const user = await User.findOne({ _id: userId, orgId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    // Allow deletion of all registered organization roles (Committee, Student, etc.)

    await User.deleteOne({ _id: userId, orgId });
    res.json({ success: true, message: "User removed successfully." });
  } catch (err) {
    console.error("Delete org user error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
