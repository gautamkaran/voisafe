/**
 * SOCKET.IO CONFIGURATION FOR ANONYMOUS CHAT
 * 
 * Purpose: Configure Socket.io server for real-time anonymous communication
 * Security: CORS configuration, authentication middleware
 */

const socketIO = require('socket.io');

/**
 * Initialize Socket.io server
 * @param {Object} server - HTTP server instance
 * @returns {Object} - Socket.io instance
 */
function initializeSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true
        },
        // Connection options
        pingTimeout: 60000, // 60 seconds
        pingInterval: 25000, // 25 seconds
    });

    console.log('✅ Socket.io server initialized');

    return io;
}

module.exports = { initializeSocket };
