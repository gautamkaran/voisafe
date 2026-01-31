const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * USER MODEL - MULTI-TENANT AUTHENTICATION
 * 
 * Roles:
 * - student: Can file complaints anonymously
 * - admin: Can view all complaints, update status, manage system
 * - committee-admin: Can view complaints, limited admin access
 * 
 * Multi-tenant: Each user belongs to a college (tenant)
 */

const userSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password in queries by default
    },

    // Role-based Access Control
    role: {
        type: String,
        enum: ['student', 'admin', 'committee-admin'],
        default: 'student'
    },

    // Multi-tenant Support
    // Multi-Tenant Link
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: false // Temporarily false for migration compatibility
    },

    // Legacy / Display field (Migrate to use orgId population eventually)
    college: {
        type: String,
        required: [true, 'College name is required'],
        trim: true
    },

    // Student-specific fields
    studentId: {
        type: String,
        sparse: true, // Allows null values, only students have this
        trim: true
    },

    department: {
        type: String,
        trim: true
    },

    year: {
        type: Number,
        min: 1,
        max: 5
    },

    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },

    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// INDEXES for better query performance
userSchema.index({ email: 1 });
userSchema.index({ college: 1, role: 1 });
userSchema.index({ studentId: 1, college: 1 });

// PRE-SAVE MIDDLEWARE: Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash password if it's modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// METHOD: Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// METHOD: Get user object without sensitive data
userSchema.methods.toSafeObject = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
