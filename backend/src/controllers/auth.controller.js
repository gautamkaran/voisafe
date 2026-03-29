import User from "../model/user.model.js";
import Organization from "../model/organization.model.js";

// @route   POST /api/auth/register
// @desc    Register a new user and potentially an organization
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = "student",
      studentId,
      // Organization fields (used by admin to create, or student to join)
      collegeCode, // Used to find org
      orgName, // Used if admin is creating
      domain, // Used if admin is creating
      contactEmail, // Used if admin is creating
    } = req.body;

    // Validate required generic user fields
    if (!name || !email || !password || !collegeCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, password, and collegeCode.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    let organization = await Organization.findOne({ collegeCode });

    if (role === "admin") {
      // Admin is trying to register a NEW organization or join an existing one as admin
      if (organization) {
         return res.status(400).json({
            success: false,
            message: "Organization with this college code already exists.",
         });
      }
      
      // Create new Organization
      if (!orgName || !domain || !contactEmail) {
         return res.status(400).json({
             success: false,
             message: "Admin must provide orgName, domain, and contactEmail to create an organization.",
         });
      }

      const existingDomain = await Organization.findOne({ domain });
      if (existingDomain) {
         return res.status(400).json({
             success: false,
             message: "Organization domain already exists.",
         });
      }

      organization = await Organization.create({
        name: orgName,
        domain: domain,
        collegeCode: collegeCode,
        contactEmail: contactEmail,
        status: "active", // Requires Super Admin approval
      });
    } else {
      // Student is registering
      if (!organization) {
        return res.status(400).json({
          success: false,
          message: `No organization found with college code '${collegeCode}'. Please ask an admin to register it first.`,
        });
      }
    }

    // Create the User, linked to the Organization's Object ID
    const user = await User.create({
      name,
      email,
      password,
      role,
      studentId,
      orgId: organization._id,
    });

    // Generate JWT token using model instance method
    const token = user.generateAccessToken();

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          orgId: user.orgId,
          orgName: organization.name,
        },
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

// @route   POST /api/auth/login
// @desc    Login user (checks org status for non-superadmin users)
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // For non-superadmin users, check if their organisation is active
    let orgName = null;
    if (user.role !== "superadmin" && user.orgId) {
      const org = await Organization.findById(user.orgId);
      if (org) {
        orgName = org.name;
        /* 
        if (org.status === "pending") {
          return res.status(403).json({
            success: false,
            message: "Your institution is awaiting Super Admin approval. Please try again later.",
          });
        }
        */
        if (org.status === "rejected") {
          return res.status(403).json({
            success: false,
            message: "Your institution has been blocked. Please contact VoiSafe support.",
          });
        }
      }
    }

    const token = user.generateAccessToken();

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          orgId: user.orgId,
          orgName,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

// @route   POST /api/auth/change-password
// @desc    Change user password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user by ID (from auth middleware)
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await user.isPasswordCorrect(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password incorrect" });
    }

    // Update password (pre-save hook in user model handles hashing)
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    next(error);
  }
};
