const mongoose = require('mongoose');

/**
 * COMPLAINT MODEL - CORE ANONYMITY IMPLEMENTATION
 * 
 * ⚠️ CRITICAL PRIVACY FEATURE: NO userId FIELD
 * 
 * This model intentionally does NOT store the student's userId.
 * Identity mapping is handled separately in ComplaintTracking model.
 * 
 * Why this matters:
 * 1. Database-level anonymity: Even if complaint collection is compromised,
 *    student identity cannot be determined
 * 2. Separation of concerns: Complaint data is separate from identity data
 * 3. Access control: Only authorized admins can access identity mapping
 * 
 * Students access their complaints using trackingId only.
 */

const complaintSchema = new mongoose.Schema({
    // Unique Tracking ID - Student's only reference to their complaint
    trackingId: {
        type: String,
        required: true,
        unique: true,
        index: true, // Fast lookups by tracking ID
        immutable: true // Cannot be changed after creation
    },

    // Complaint Details
    title: {
        type: String,
        required: [true, 'Complaint title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },

    description: {
        type: String,
        required: [true, 'Complaint description is required'],
        trim: true,
        minlength: [20, 'Description must be at least 20 characters'],
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },

    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'harassment',
            'discrimination',
            'academic-misconduct',
            'infrastructure',
            'safety',
            'administration',
            'other'
        ]
    },

    // Priority Level (can be set by admin)
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },

    // Status Tracking
    status: {
        type: String,
        enum: ['pending', 'under-review', 'in-progress', 'resolved', 'closed'],
        default: 'pending'
    },

    // Multi-tenant Support
    college: {
        type: String,
        required: true,
        index: true // Fast filtering by college
    },

    // Attachments (URLs to uploaded files)
    attachments: [{
        filename: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Admin Notes (visible only to admins)
    adminNotes: [{
        note: String,
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Status History (audit trail)
    statusHistory: [{
        status: String,
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        changedAt: {
            type: Date,
            default: Date.now
        },
        comment: String
    }],

    // Identity Revelation Tracking
    identityRevealed: {
        type: Boolean,
        default: false
    },

    identityRevealedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    identityRevealedAt: {
        type: Date
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// INDEXES for efficient queries
complaintSchema.index({ trackingId: 1 }); // Primary lookup method
complaintSchema.index({ college: 1, status: 1 }); // Admin dashboard filtering
complaintSchema.index({ category: 1, college: 1 }); // Category-based filtering
complaintSchema.index({ createdAt: -1 }); // Recent complaints first

// VIRTUAL: Check if complaint is active
complaintSchema.virtual('isActive').get(function () {
    return !['resolved', 'closed'].includes(this.status);
});

// METHOD: Add status change to history
complaintSchema.methods.updateStatus = function (newStatus, adminId, comment = '') {
    this.status = newStatus;
    this.statusHistory.push({
        status: newStatus,
        changedBy: adminId,
        changedAt: new Date(),
        comment
    });
};

// METHOD: Add admin note
complaintSchema.methods.addAdminNote = function (note, adminId) {
    this.adminNotes.push({
        note,
        addedBy: adminId,
        addedAt: new Date()
    });
};

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
