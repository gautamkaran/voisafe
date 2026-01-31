const User = require('../models/User');
const Organization = require('../models/Organization');
const jwt = require('jsonwebtoken');

/**
 * AUTHENTICATION CONTROLLER
 * 
 * Handles user registration, login, and JWT token generation
 */

/**
 * Generate JWT token
 * @param {string} userId - User ID
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            role,
            college, // Name of the college
            studentId,
            department,
            year
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !college) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, password, and college'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // ------------------------------------------------------------------
        // MULTI-TENANT LOGIC
        // ------------------------------------------------------------------
        let orgId = null;
        let organization = null;

        // simple slug generation from college name
        const slug = college.toLowerCase().replace(/[^a-z0-9]/g, '-');

        // 1. Try to find existing Organization
        organization = await Organization.findOne({
            $or: [{ name: college }, { slug: slug }]
        });

        const userRole = role || 'student';

        // 2. Logic for Organization Creation/Joining
        if (organization) {
            // Organization exists - Join it
            orgId = organization._id;
        } else {
            // Organization doesn't exist
            if (userRole === 'admin' || userRole === 'super-admin' || userRole === 'org-admin') {
                // Admin can create a new Organization (Auto-onboarding)
                organization = await Organization.create({
                    name: college,
                    slug: slug,
                    status: 'active'
                });
                orgId = organization._id;
                console.log(`🆕 New Organization Created: ${college} (${slug})`);
            } else {
                // Students/Committee cannot create organizations
                return res.status(400).json({
                    success: false,
                    message: `Organization '${college}' not registered. Please ask your administrator to sign up first.`
                });
            }
        }

        // Create user with orgId
        const user = await User.create({
            name,
            email,
            password,
            role: userRole,
            college, // Keep legacy string for now
            orgId,   // Link to Organization
            studentId,
            department,
            year
        });

        // Generate token
        const token = generateToken(user._id);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.toSafeObject(),
                token,
                organization: {
                    name: organization.name,
                    slug: organization.slug
                }
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        next(error);
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact administrator.'
            });
        }

        // Verify password
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.toSafeObject(),
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged-in user
 * @access  Private
 */
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        res.status(200).json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Get user error:', error);
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe
};
