import Chat from "../model/chatmessage.model.js";
import Complaint from "../model/complant.model.js";

// @route   GET /api/chat/:complaintId
// @desc    Get chat messages for a grievance
export const getMessages = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const orgId = req.user.orgId;

    // Verify access: student who created or committee of same org
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ success: false, message: "Grievance session not found." });

    if (req.user.role === "student" && complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Decoupled access denied." });
    }

    if ((req.user.role === "admin" || req.user.role === "committee") && complaint.orgId.toString() !== orgId.toString()) {
       return res.status(403).json({ success: false, message: "Out of scope access restricted." });
    }

    const messages = await Chat.find({ complaintId }).sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Terminal sync fail." });
  }
};

// @route   POST /api/chat/:complaintId
// @desc    Post a message to a grievance chat session
export const sendMessage = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { message } = req.body;
    const orgId = req.user.orgId;

    if (!message) return res.status(400).json({ success: false, message: "Message content required." });

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ success: false, message: "Grievance session not found." });

    // Authorization check
    if (req.user.role === "student" && complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Decoupled access denied." });
    }

    if ((req.user.role === "admin" || req.user.role === "committee") && complaint.orgId.toString() !== orgId.toString()) {
       return res.status(403).json({ success: false, message: "Out of scope access restricted." });
    }

    const newMessage = await Chat.create({
      complaintId,
      senderRole: req.user.role,
      message,
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: "Signal transmission failed." });
  }
};
