const express = require('express');
const router = express.Router();
const {
    fileComplaint,
    getComplaintByTracking,
    getMyComplaints,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    revealIdentity,
    addAdminNote
} = require('../controllers/complaintController');
const {
    authenticate,
    authorize,
    enforceCollegeAccess
} = require('../middleware/authMiddleware');

/**
 * COMPLAINT ROUTES - IDENTITY DECOUPLING IMPLEMENTATION
 * 
 * Student Routes:
 * - File complaint (anonymous)
 * - Track complaint by trackingId
 * - View own complaints
 * 
 * Admin Routes:
 * - View all complaints (without identity)
 * - Update complaint status
 * - Add admin notes
 * - Reveal identity (restricted)
 */

// Apply authentication to all routes
router.use(authenticate);
router.use(enforceCollegeAccess);

// STUDENT ROUTES

// @route   POST /api/complaints
// @desc    File a new complaint (ANONYMOUS)
// @access  Private (Student)
router.post(
    '/',
    authorize('student'),
    fileComplaint
);

// @route   GET /api/complaints/track/:trackingId
// @desc    Get complaint by tracking ID
// @access  Private (Student)
router.get(
    '/track/:trackingId',
    authorize('student'),
    getComplaintByTracking
);

// @route   GET /api/complaints/my-complaints
// @desc    Get all my complaints
// @access  Private (Student)
router.get(
    '/my-complaints',
    authorize('student'),
    getMyComplaints
);

// ADMIN ROUTES

// @route   GET /api/complaints
// @desc    Get all complaints (NO IDENTITY)
// @access  Private (Admin, Committee-Admin)
router.get(
    '/',
    authorize('admin', 'committee-admin'),
    getAllComplaints
);

// @route   GET /api/complaints/:id
// @desc    Get single complaint details
// @access  Private (Admin, Committee-Admin)
router.get(
    '/:id',
    authorize('admin', 'committee-admin'),
    getComplaintById
);

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status
// @access  Private (Admin, Committee-Admin)
router.put(
    '/:id/status',
    authorize('admin', 'committee-admin'),
    updateComplaintStatus
);

// @route   POST /api/complaints/:id/notes
// @desc    Add admin note
// @access  Private (Admin, Committee-Admin)
router.post(
    '/:id/notes',
    authorize('admin', 'committee-admin'),
    addAdminNote
);

// @route   POST /api/complaints/:id/reveal-identity
// @desc    Reveal student identity (RESTRICTED)
// @access  Private (Admin ONLY)
router.post(
    '/:id/reveal-identity',
    authorize('admin'),
    revealIdentity
);

module.exports = router;
