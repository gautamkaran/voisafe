import mongoose from 'mongoose';
import Complaint from "../model/complant.model.js";
import User from "../model/user.model.js";

// @route   POST /api/complaints
// @desc    File a new anonymous grievance
export const createComplaint = async (req, res) => {
  try {
    const { subject, description, category, isEmergency } = req.body;
    const { _id, orgId } = req.user;

    if (!subject || !description) {
      return res.status(400).json({ success: false, message: "Subject and description required." });
    }

    // Generate unique tracking and anonymous IDs
    const trackingId = `VOI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const anonymousId = `ANON-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const complaint = await Complaint.create({
      userId: _id, // Note: Schema might not have userId, check again
      orgId,
      title: subject,
      description,
      category: category || "general",
      trackingId,
      anonymousId,
      priority: isEmergency ? "high" : "medium",
      status: "pending"
    });

    res.status(201).json({ success: true, message: "Grievance filed successfully.", data: complaint, trackingId });
  } catch (err) {
    console.error("Create complaint error:", err);
    res.status(500).json({ success: false, message: "Server error during filing." });
  }
};

// @route   GET /api/complaints/stats
// @desc    Get aggregated stats for organization summary
export const getOrgStats = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    if (!orgId) return res.status(400).json({ success: false, message: "Organization ID missing." });

    const totalUsers = await User.countDocuments({ orgId });
    const totalComplaints = await Complaint.countDocuments({ orgId });
    const resolvedComplaints = await Complaint.countDocuments({ orgId, status: "resolved" });
    const inProgressComplaints = await Complaint.countDocuments({ orgId, status: "in-progress" });
    const pendingComplaints = await Complaint.countDocuments({ orgId, status: "pending" });

    const resolutionRate = totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalComplaints,
        resolvedComplaints,
        inProgressComplaints,
        pendingComplaints,
        resolutionRate: Math.round(resolutionRate)
      }
    });
  } catch (err) {
    console.error("Get organization stats error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/complaints/org
// @desc    Get all complaints for current organization
export const getOrgComplaints = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    if (!orgId) return res.status(400).json({ success: false, message: "Organization ID missing." });

    const complaints = await Complaint.find({ orgId }).sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (err) {
    console.error("Get organization complaints error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/complaints/reports
// @desc    Get data for reports/analytics
export const getOrgReports = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    if (!orgId) return res.status(400).json({ success: false, message: "Organization ID missing." });

    // Category distribution
    const categoryData = await Complaint.aggregate([
      { $match: { orgId: new mongoose.Types.ObjectId(orgId) } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Status distribution
    const statusData = await Complaint.aggregate([
      { $match: { orgId: new mongoose.Types.ObjectId(orgId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({ success: true, data: { categoryData, statusData } });
  } catch (err) {
    console.error("Get organization reports error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// @route   GET /api/complaints/:id
// @desc    Get single complaint details
export const getComplaintDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = req.user.orgId;

    const complaint = await Complaint.findOne({ _id: id, orgId });
    if (!complaint) return res.status(404).json({ success: false, message: "Grievance not found." });

    res.json({ success: true, data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   PATCH /api/complaints/:id/status
// @desc    Update status of a grievance (Committee/Admin only)
export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const orgId = req.user.orgId;

    if (!['pending', 'in-progress', 'resolved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const complaint = await Complaint.findOneAndUpdate(
       { _id: id, orgId },
       { status, remarks },
       { new: true }
    );

    if (!complaint) return res.status(404).json({ success: false, message: "Grievance not found or authorization failed." });

    res.json({ success: true, message: "Resolution status updated.", data: complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/complaints/my
// @desc    Get all complaints submitted by the current student
export const getMyComplaints = async (req, res) => {
  try {
    const userId = req.user._id;
    const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
