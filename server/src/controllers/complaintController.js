const Complaint = require('../models/Complaint');
const ComplaintTracking = require('../models/ComplaintTracking');
const User = require('../models/User');
const { generateUniqueTrackingId } = require('../utils/trackingIdGenerator');

/**
 * COMPLAINT CONTROLLER - MULTI-TENANT & ANONYMOUS
 */

/**
 * @route   POST /api/complaints
 * @desc    File a new complaint (ANONYMOUS)
 * @access  Private (Student)
 */
const fileComplaint = async (req, res, next) => {
    try {
        const { title, description, category } = req.body;
        const userId = req.user._id;
        const college = req.user.college;
        const orgId = req.user.orgId; // Get Org ID

        // Validate required fields
        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, description, and category'
            });
        }

        // STEP 1: Generate unique tracking ID
        const trackingId = await generateUniqueTrackingId(async (id) => {
            const exists = await Complaint.findOne({ trackingId: id });
            return !!exists;
        });

        console.log(`🔐 Generated tracking ID: ${trackingId} for user: ${userId}`);

        // STEP 2: Create complaint WITHOUT userId (CORE ANONYMITY FEATURE)
        const complaint = await Complaint.create({
            trackingId,
            title,
            description,
            category,
            college,
            orgId, // Link to Organization
            status: 'pending',
            // NOTE: No userId field! This is intentional for anonymity
        });

        // STEP 3: Create encrypted identity mapping in separate collection
        await ComplaintTracking.createTracking(
            trackingId,
            userId,
            college,
            orgId, // Link mapping to Organization too
            null // No TTL
        );

        console.log(`✅ Complaint filed anonymously. TrackingId: ${trackingId}`);

        // STEP 4: Return trackingId to student
        res.status(201).json({
            success: true,
            message: 'Complaint filed successfully. Save your tracking ID to check status.',
            data: {
                trackingId,
                complaint: {
                    title: complaint.title,
                    category: complaint.category,
                    status: complaint.status,
                    createdAt: complaint.createdAt
                }
            }
        });

    } catch (error) {
        console.error('Error filing complaint:', error);
        next(error);
    }
};

/**
 * @route   GET /api/complaints/track/:trackingId
 * @desc    Get complaint by tracking ID (STUDENT ACCESS)
 * @access  Private (Student)
 */
const getComplaintByTracking = async (req, res, next) => {
    try {
        const { trackingId } = req.params;
        const userId = req.user._id;

        // Find complaint by tracking ID
        const complaint = await Complaint.findOne({ trackingId });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found with this tracking ID'
            });
        }

        // SECURITY: Verify that this tracking ID belongs to the requesting user
        const isOwner = await ComplaintTracking.verifyOwnership(trackingId, userId);

        if (!isOwner) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. This tracking ID does not belong to you.'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                complaint: {
                    trackingId: complaint.trackingId,
                    title: complaint.title,
                    description: complaint.description,
                    category: complaint.category,
                    status: complaint.status,
                    priority: complaint.priority,
                    statusHistory: complaint.statusHistory,
                    createdAt: complaint.createdAt,
                    updatedAt: complaint.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Error retrieving complaint:', error);
        next(error);
    }
};

/**
 * @route   GET /api/complaints/my-complaints
 * @desc    Get all complaints filed by the logged-in student
 * @access  Private (Student)
 */
const getMyComplaints = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Use orgId filter if available, otherwise college
        const filter = req.user.orgId
            ? { orgId: req.user.orgId }
            : { college: req.user.college };

        // Get all tracking IDs for this user
        // We filter by College/Org first to optimize
        const trackingEntries = await ComplaintTracking.find(filter)
            .select('trackingId encryptedUserId');

        // Filter to get only this user's tracking IDs
        const myTrackingIds = [];
        for (const entry of trackingEntries) {
            // Decrypt and compare (slow but secure)
            // Ideally we'd optimize this but keeping it simple for now
            if (entry.userId === userId.toString()) {
                myTrackingIds.push(entry.trackingId);
            }
        }

        // Get complaints using these tracking IDs
        const complaints = await Complaint.find({
            trackingId: { $in: myTrackingIds }
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: { complaints }
        });

    } catch (error) {
        console.error('Error retrieving user complaints:', error);
        next(error);
    }
};

/**
 * @route   GET /api/complaints
 * @desc    Get all complaints (ADMIN VIEW - NO IDENTITY)
 * @access  Private (Admin, Committee-Admin)
 */
const getAllComplaints = async (req, res, next) => {
    try {
        const { status, category, priority } = req.query;

        // USE College Filter from Middleware (Secure & Consistent)
        const filter = { ...req.collegeFilter };

        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;

        // Get complaints (no userId field exists, so identity is protected)
        const complaints = await Complaint.find(filter)
            .sort({ createdAt: -1 })
            .select('-adminNotes'); // Hide admin notes from list view

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: { complaints }
        });

    } catch (error) {
        console.error('Error retrieving complaints:', error);
        next(error);
    }
};

/**
 * @route   GET /api/complaints/:id
 * @desc    Get single complaint details (ADMIN)
 * @access  Private (Admin, Committee-Admin)
 */
const getComplaintById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Look for complaint restricted by tenant
        // Combine ID query with Tenant Filter
        const complaint = await Complaint.findOne({
            _id: id,
            ...req.collegeFilter // Ensures admin can only see their own college's complaint
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: { complaint }
        });

    } catch (error) {
        console.error('Error retrieving complaint:', error);
        next(error);
    }
};

/**
 * @route   PUT /api/complaints/:id/status
 * @desc    Update complaint status (ADMIN)
 * @access  Private (Admin, Committee-Admin)
 */
const updateComplaintStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, comment } = req.body;
        const adminId = req.user._id;

        const complaint = await Complaint.findOne({
            _id: id,
            ...req.collegeFilter
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found or access denied'
            });
        }

        // Update status with history
        complaint.updateStatus(status, adminId, comment);
        await complaint.save();

        res.status(200).json({
            success: true,
            message: 'Complaint status updated successfully',
            data: { complaint }
        });

    } catch (error) {
        console.error('Error updating complaint status:', error);
        next(error);
    }
};

/**
 * @route   POST /api/complaints/:id/reveal-identity
 * @desc    Reveal student identity (RESTRICTED - ADMIN ONLY)
 * @access  Private (Admin only - NOT committee-admin)
 */
const revealIdentity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const adminId = req.user._id;
        const ipAddress = req.ip || req.connection.remoteAddress;

        // Verify admin role (not committee-admin)
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only full administrators can reveal student identity'
            });
        }

        if (!reason || reason.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a detailed reason (minimum 10 characters)'
            });
        }

        const complaint = await Complaint.findOne({
            _id: id,
            ...req.collegeFilter
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found or access denied'
            });
        }

        // Get userId from ComplaintTracking (with access logging)
        const userId = await ComplaintTracking.getUserIdByTracking(
            complaint.trackingId,
            adminId,
            reason,
            ipAddress
        );

        if (!userId) {
            return res.status(404).json({
                success: false,
                message: 'Identity mapping not found'
            });
        }

        // Get student details
        const student = await User.findById(userId).select('-password');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Mark identity as revealed in complaint
        complaint.identityRevealed = true;
        complaint.identityRevealedBy = adminId;
        complaint.identityRevealedAt = new Date();
        await complaint.save();

        console.log(`⚠️  Identity revealed for complaint ${complaint.trackingId} by admin ${adminId}`);

        res.status(200).json({
            success: true,
            message: 'Identity revealed. This action has been logged.',
            data: {
                student: {
                    name: student.name,
                    email: student.email,
                    studentId: student.studentId,
                    department: student.department,
                    year: student.year
                },
                revealedBy: req.user.name,
                revealedAt: complaint.identityRevealedAt,
                reason
            }
        });

    } catch (error) {
        console.error('Error revealing identity:', error);
        next(error);
    }
};

/**
 * @route   POST /api/complaints/:id/notes
 * @desc    Add admin note to complaint
 * @access  Private (Admin, Committee-Admin)
 */
const addAdminNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { note } = req.body;
        const adminId = req.user._id;

        if (!note || note.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Note content is required'
            });
        }

        const complaint = await Complaint.findOne({
            _id: id,
            ...req.collegeFilter
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found or access denied'
            });
        }

        complaint.addAdminNote(note, adminId);
        await complaint.save();

        res.status(200).json({
            success: true,
            message: 'Admin note added successfully',
            data: { complaint }
        });

    } catch (error) {
        console.error('Error adding admin note:', error);
        next(error);
    }
};

module.exports = {
    fileComplaint,
    getComplaintByTracking,
    getMyComplaints,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    revealIdentity,
    addAdminNote
};
