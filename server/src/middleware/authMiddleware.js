const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * AUTHENTICATION MIDDLEWARE
 * 
 * Purpose: Verify JWT tokens and protect routes
 * Features:
 * - JWT token verification
 * - User authentication
 * - Role-based access control (RBAC)
 */

/**
 * Verify JWT token and authenticate user
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Authorization denied.'
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Authorization denied.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Authorization denied.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
};

/**
 * Role-based access control middleware
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};

/**
 * Multi-tenant isolation middleware
 * Ensures users can only access data from their college
 */
const enforceCollegeAccess = (req, res, next) => {
    // 1. Prefer Organization ID (Strict Multi-Tenancy)
    if (req.user.orgId) {
        req.collegeFilter = { orgId: req.user.orgId };
    }
    // 2. Fallback to College Name (Legacy Compatibility)
    else if (req.user.college) {
        req.collegeFilter = { college: req.user.college };
    }
    // 3. Error if neither exists
    else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. No organization association found.'
        });
    }

    next();
};

module.exports = {
    authenticate,
    authorize,
    enforceCollegeAccess
};
