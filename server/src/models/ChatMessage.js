const mongoose = require('mongoose');

/**
 * CHAT MESSAGE MODEL - ANONYMOUS COMMUNICATION
 * 
 * Purpose: Store chat messages for anonymous conversations between students and admins
 * 
 * Anonymity Features:
 * 1. Uses trackingId instead of userId for student messages
 * 2. Sender identified only by role (student/admin)
 * 3. Messages linked to complaint via trackingId
 * 
 * Chat Flow:
 * - Student joins room using trackingId
 * - Admin joins same room to respond
 * - Messages stored with role, not identity
 * - Real-time delivery via Socket.io
 */

const chatMessageSchema = new mongoose.Schema({
    // Complaint Reference (via trackingId, not complaintId)
    trackingId: {
        type: String,
        required: true,
        index: true
    },

    // Sender Information (role-based, not identity-based)
    senderRole: {
        type: String,
        required: true,
        enum: ['student', 'admin', 'committee-admin', 'system']
    },

    // For admin messages, we can store adminId (admins are not anonymous)
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        sparse: true // Only for admin messages
    },

    // Message Content
    message: {
        type: String,
        required: [true, 'Message content is required'],
        trim: true,
        maxlength: [2000, 'Message cannot exceed 2000 characters']
    },

    // Message Type
    messageType: {
        type: String,
        enum: ['text', 'file', 'system'],
        default: 'text'
    },

    // File Attachment (if messageType is 'file')
    attachment: {
        filename: String,
        url: String,
        fileType: String,
        fileSize: Number
    },

    // Read Status
    isRead: {
        type: Boolean,
        default: false
    },

    readAt: {
        type: Date
    },

    // Multi-tenant
    college: {
        type: String,
        required: true,
        index: true
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

// INDEXES for efficient queries
chatMessageSchema.index({ trackingId: 1, createdAt: 1 }); // Get messages for a complaint
chatMessageSchema.index({ college: 1, trackingId: 1 }); // Multi-tenant filtering
chatMessageSchema.index({ isRead: 1, senderRole: 1 }); // Unread messages

// STATIC METHOD: Get chat history for a complaint
chatMessageSchema.statics.getChatHistory = async function (trackingId, limit = 100) {
    try {
        const messages = await this.find({ trackingId })
            .sort({ createdAt: 1 }) // Oldest first
            .limit(limit)
            .populate('adminId', 'name role') // Populate admin info if exists
            .lean();

        return messages;
    } catch (error) {
        throw new Error(`Failed to retrieve chat history: ${error.message}`);
    }
};

// STATIC METHOD: Mark messages as read
chatMessageSchema.statics.markAsRead = async function (trackingId, role) {
    try {
        // Mark all messages from the opposite role as read
        const oppositeRole = role === 'student' ? ['admin', 'committee-admin'] : ['student'];

        await this.updateMany(
            {
                trackingId,
                senderRole: { $in: oppositeRole },
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );
    } catch (error) {
        throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
};

// STATIC METHOD: Get unread count
chatMessageSchema.statics.getUnreadCount = async function (trackingId, forRole) {
    try {
        // Count unread messages sent by the opposite role
        const oppositeRole = forRole === 'student' ? ['admin', 'committee-admin'] : ['student'];

        const count = await this.countDocuments({
            trackingId,
            senderRole: { $in: oppositeRole },
            isRead: false
        });

        return count;
    } catch (error) {
        throw new Error(`Failed to get unread count: ${error.message}`);
    }
};

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;
