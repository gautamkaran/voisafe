const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

/**
 * COMPLAINT TRACKING MODEL - IDENTITY DECOUPLING LAYER
 * 
 * ⚠️ CRITICAL SECURITY COMPONENT
 * 
 * Purpose: Securely map trackingId to userId WITHOUT storing this in Complaint model
 * 
 * Security Features:
 * 1. Encrypted userId storage (AES-256)
 * 2. Separate collection from Complaint
 * 3. Restricted access (only specific admin operations)
 * 4. Optional TTL (Time To Live) for auto-deletion after resolution
 * 
 * How Identity Decoupling Works:
 * ┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
 * │   Student   │ files   │    Complaint     │         │    User     │
 * │             │────────>│  (no userId!)    │         │             │
 * └─────────────┘         └──────────────────┘         └─────────────┘
 *                                  │                           │
 *                                  │ trackingId                │ userId
 *                                  │                           │
 *                                  ▼                           ▼
 *                         ┌────────────────────────────────────┐
 *                         │     ComplaintTracking (secure)     │
 *                         │  trackingId ←→ encrypted userId    │
 *                         └────────────────────────────────────┘
 * 
 * Access Pattern:
 * - Students: Use trackingId to access their complaint (no identity needed)
 * - Admins: See complaints without identity
 * - Authorized Admins: Can "reveal identity" by querying this collection
 */

const complaintTrackingSchema = new mongoose.Schema({
    // Tracking ID (links to Complaint)
    trackingId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        immutable: true
    },

    // Encrypted User ID
    encryptedUserId: {
        type: String,
        required: true
    },

    // College (for multi-tenant isolation)
    college: {
        type: String,
        required: true,
        index: true
    },

    // Access Control
    accessLog: [{
        accessedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        accessedAt: {
            type: Date,
            default: Date.now
        },
        reason: String, // Why identity was revealed
        ipAddress: String
    }],

    // Auto-deletion (optional)
    expiresAt: {
        type: Date,
        index: { expires: 0 } // TTL index - MongoDB will auto-delete
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {
    timestamps: true
});

// INDEXES
complaintTrackingSchema.index({ trackingId: 1 });
complaintTrackingSchema.index({ college: 1 });

// VIRTUAL: Get decrypted userId (use carefully!)
complaintTrackingSchema.virtual('userId').get(function () {
    try {
        return decrypt(this.encryptedUserId);
    } catch (error) {
        console.error('Failed to decrypt userId:', error);
        return null;
    }
});

// STATIC METHOD: Create tracking entry with encrypted userId
complaintTrackingSchema.statics.createTracking = async function (trackingId, userId, college, ttlDays = null) {
    try {
        // Encrypt the userId
        const encryptedUserId = encrypt(userId.toString());

        // Calculate expiration date if TTL is set
        let expiresAt = null;
        if (ttlDays) {
            expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + ttlDays);
        }

        // Create tracking entry
        const tracking = await this.create({
            trackingId,
            encryptedUserId,
            college,
            expiresAt
        });

        return tracking;
    } catch (error) {
        throw new Error(`Failed to create complaint tracking: ${error.message}`);
    }
};

// STATIC METHOD: Get userId by trackingId (with access logging)
complaintTrackingSchema.statics.getUserIdByTracking = async function (trackingId, adminId, reason = '', ipAddress = '') {
    try {
        const tracking = await this.findOne({ trackingId });

        if (!tracking) {
            return null;
        }

        // Log the access
        tracking.accessLog.push({
            accessedBy: adminId,
            accessedAt: new Date(),
            reason,
            ipAddress
        });

        await tracking.save();

        // Return decrypted userId
        return tracking.userId;
    } catch (error) {
        throw new Error(`Failed to retrieve userId: ${error.message}`);
    }
};

// STATIC METHOD: Verify ownership (student checking their own complaint)
complaintTrackingSchema.statics.verifyOwnership = async function (trackingId, userId) {
    try {
        const tracking = await this.findOne({ trackingId });

        if (!tracking) {
            return false;
        }

        // Decrypt and compare
        const decryptedUserId = tracking.userId;
        return decryptedUserId === userId.toString();
    } catch (error) {
        console.error('Ownership verification failed:', error);
        return false;
    }
};

const ComplaintTracking = mongoose.model('ComplaintTracking', complaintTrackingSchema);

module.exports = ComplaintTracking;
