require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/database');
const { initializeSocket } = require('./config/socket');
const { initializeChatHandlers } = require('./sockets/chatHandler');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

/**
 * VOISAFE BACKEND SERVER
 * 
 * Features:
 * - Express.js REST API
 * - Socket.io for real-time chat
 * - MongoDB with Mongoose
 * - JWT authentication
 * - Identity decoupling for anonymous complaints
 */

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

// Connect to MongoDB
connectDB();

// MIDDLEWARE

// Security headers
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ROUTES

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'VoiSafe API is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler (must be last)
app.use(errorHandler);

// SOCKET.IO HANDLERS
initializeChatHandlers(io);

// START SERVER
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🔐 VoiSafe Backend Server');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  📡 Server running on port: ${PORT}`);
    console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  🔌 Socket.io enabled`);
    console.log(`  🔒 Identity Decoupling: ACTIVE`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = { app, server, io };
