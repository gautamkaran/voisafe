const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
    getChatHistory,
    sendMessage,
    getUnreadCount
} = require('../controllers/chatController');

/**
 * SOCKET.IO CHAT HANDLER - ANONYMOUS COMMUNICATION
 * 
 * Purpose: Handle real-time anonymous chat between students and admins
 * 
 * Room Structure:
 * - Room name: `complaint_${trackingId}`
 * - Students join using their trackingId
 * - Admins join to respond
 * - Messages identified by role, not identity
 * 
 * Events:
 * - join_chat: Join a complaint chat room
 * - send_message: Send a message
 * - message_received: Receive a message
 * - typing: User is typing
 * - error: Error occurred
 */

/**
 * Authenticate socket connection
 * @param {Object} socket - Socket instance
 * @returns {Object} - User object or null
 */
const authenticateSocket = async (socket) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return null;
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user
        const user = await User.findById(decoded.userId).select('-password');

        if (!user || !user.isActive) {
            return null;
        }

        return user;

    } catch (error) {
        console.error('Socket authentication error:', error);
        return null;
    }
};

/**
 * Initialize chat handlers
 * @param {Object} io - Socket.io instance
 */
const initializeChatHandlers = (io) => {

    io.on('connection', async (socket) => {
        console.log(`🔌 New socket connection: ${socket.id}`);

        // Authenticate user
        const user = await authenticateSocket(socket);

        if (!user) {
            socket.emit('error', { message: 'Authentication failed' });
            socket.disconnect();
            return;
        }

        console.log(`✅ User authenticated: ${user.name} (${user.role})`);

        // Store user info in socket
        socket.user = user;

        /**
         * JOIN CHAT ROOM
         * Client sends: { trackingId: 'abc123' }
         */
        socket.on('join_chat', async (data) => {
            try {
                const { trackingId } = data;

                if (!trackingId) {
                    socket.emit('error', { message: 'Tracking ID is required' });
                    return;
                }

                // Create room name
                const roomName = `complaint_${trackingId}`;

                // Join room
                socket.join(roomName);

                console.log(`👥 ${user.name} joined room: ${roomName}`);

                // Get chat history
                const messages = await getChatHistory(trackingId, user);

                // Get unread count
                const unreadCount = await getUnreadCount(trackingId, user);

                // Send chat history to user
                socket.emit('chat_history', {
                    trackingId,
                    messages,
                    unreadCount
                });

                // Notify room that user joined
                socket.to(roomName).emit('user_joined', {
                    role: user.role,
                    timestamp: new Date()
                });

            } catch (error) {
                console.error('Join chat error:', error);
                socket.emit('error', { message: error.message });
            }
        });

        /**
         * SEND MESSAGE
         * Client sends: { trackingId: 'abc123', message: 'Hello' }
         */
        socket.on('send_message', async (data) => {
            try {
                const { trackingId, message } = data;

                if (!trackingId || !message) {
                    socket.emit('error', { message: 'Tracking ID and message are required' });
                    return;
                }

                // Validate message length
                if (message.trim().length === 0) {
                    socket.emit('error', { message: 'Message cannot be empty' });
                    return;
                }

                if (message.length > 2000) {
                    socket.emit('error', { message: 'Message too long (max 2000 characters)' });
                    return;
                }

                // Save message to database
                const chatMessage = await sendMessage(trackingId, message, user);

                // Create room name
                const roomName = `complaint_${trackingId}`;

                // Prepare message data
                const messageData = {
                    _id: chatMessage._id,
                    trackingId: chatMessage.trackingId,
                    senderRole: chatMessage.senderRole,
                    message: chatMessage.message,
                    messageType: chatMessage.messageType,
                    createdAt: chatMessage.createdAt,
                    // Include admin name if sender is admin
                    senderName: user.role !== 'student' ? user.name : null
                };

                // Broadcast to all users in room (including sender)
                io.to(roomName).emit('message_received', messageData);

                console.log(`💬 Message sent in ${roomName} by ${user.role}`);

            } catch (error) {
                console.error('Send message error:', error);
                socket.emit('error', { message: error.message });
            }
        });

        /**
         * TYPING INDICATOR
         * Client sends: { trackingId: 'abc123', isTyping: true }
         */
        socket.on('typing', (data) => {
            try {
                const { trackingId, isTyping } = data;

                if (!trackingId) {
                    return;
                }

                const roomName = `complaint_${trackingId}`;

                // Broadcast to others in room (not sender)
                socket.to(roomName).emit('user_typing', {
                    role: user.role,
                    isTyping
                });

            } catch (error) {
                console.error('Typing indicator error:', error);
            }
        });

        /**
         * LEAVE CHAT ROOM
         * Client sends: { trackingId: 'abc123' }
         */
        socket.on('leave_chat', (data) => {
            try {
                const { trackingId } = data;

                if (!trackingId) {
                    return;
                }

                const roomName = `complaint_${trackingId}`;

                socket.leave(roomName);

                console.log(`👋 ${user.name} left room: ${roomName}`);

                // Notify room
                socket.to(roomName).emit('user_left', {
                    role: user.role,
                    timestamp: new Date()
                });

            } catch (error) {
                console.error('Leave chat error:', error);
            }
        });

        /**
         * DISCONNECT
         */
        socket.on('disconnect', () => {
            console.log(`🔌 Socket disconnected: ${socket.id} (${user.name})`);
        });

    });
};

module.exports = { initializeChatHandlers };
