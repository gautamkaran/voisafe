const ChatMessage = require('../models/ChatMessage');
const ComplaintTracking = require('../models/ComplaintTracking');
const Complaint = require('../models/Complaint');

/**
 * CHAT CONTROLLER FOR SOCKET.IO
 * 
 * Handles anonymous chat between students and admins
 * Uses trackingId for room identification (not userId)
 */

/**
 * Get chat history for a complaint
 * @param {string} trackingId - Complaint tracking ID
 * @param {Object} user - Current user object
 * @returns {Array} - Chat messages
 */
const getChatHistory = async (trackingId, user) => {
    try {
        // Verify access
        const complaint = await Complaint.findOne({ trackingId });

        if (!complaint) {
            throw new Error('Complaint not found');
        }

        // Verify college access (multi-tenant)
        if (complaint.college !== user.college) {
            throw new Error('Access denied');
        }

        // For students, verify ownership
        if (user.role === 'student') {
            const isOwner = await ComplaintTracking.verifyOwnership(trackingId, user._id);
            if (!isOwner) {
                throw new Error('Access denied - not your complaint');
            }
        }

        // Get chat history
        const messages = await ChatMessage.getChatHistory(trackingId);

        // Mark messages as read
        await ChatMessage.markAsRead(trackingId, user.role);

        return messages;

    } catch (error) {
        throw error;
    }
};

/**
 * Send a chat message
 * @param {string} trackingId - Complaint tracking ID
 * @param {string} message - Message content
 * @param {Object} user - Current user object
 * @returns {Object} - Created message
 */
const sendMessage = async (trackingId, message, user) => {
    try {
        // Verify access
        const complaint = await Complaint.findOne({ trackingId });

        if (!complaint) {
            throw new Error('Complaint not found');
        }

        // Verify college access
        if (complaint.college !== user.college) {
            throw new Error('Access denied');
        }

        // For students, verify ownership
        if (user.role === 'student') {
            const isOwner = await ComplaintTracking.verifyOwnership(trackingId, user._id);
            if (!isOwner) {
                throw new Error('Access denied - not your complaint');
            }
        }

        // Create message
        const chatMessage = await ChatMessage.create({
            trackingId,
            senderRole: user.role,
            adminId: user.role !== 'student' ? user._id : undefined,
            message,
            messageType: 'text',
            college: user.college
        });

        // Populate admin info if exists
        if (chatMessage.adminId) {
            await chatMessage.populate('adminId', 'name role');
        }

        return chatMessage;

    } catch (error) {
        throw error;
    }
};

/**
 * Get unread message count
 * @param {string} trackingId - Complaint tracking ID
 * @param {Object} user - Current user object
 * @returns {number} - Unread count
 */
const getUnreadCount = async (trackingId, user) => {
    try {
        const count = await ChatMessage.getUnreadCount(trackingId, user.role);
        return count;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getChatHistory,
    sendMessage,
    getUnreadCount
};
