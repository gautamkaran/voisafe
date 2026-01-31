const mongoose = require('mongoose');

/**
 * ORGANIZATION MODEL - ROOT TENANT ENTITY
 * 
 * Purpose: Represents a College/Institution.
 * Features:
 * - Unique 'slug' for URL-based tenant identification (e.g., harvard.voisafe.com)
 * - Domain verification support
 * - Status tracking (active/inactive)
 */

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Organization name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },

    // Unique Identifier for the Tenant (e.g., 'harvard', 'mit')
    slug: {
        type: String,
        required: [true, 'Organization slug is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
    },

    // Custom Domain (optional)
    domain: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined values to be non-unique
        lowercase: true,
        trim: true
    },

    // Organization Address / Contact
    address: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid contact email'
        ]
    },

    // Tenancy Status
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },

    // Verification Status (Requires Super Admin Approval)
    isVerified: {
        type: Boolean,
        default: false
    },

    // Settings (Extensible for future features)
    settings: {
        logoUrl: String,
        primaryColor: String,
        allowPublicRegistration: {
            type: Boolean,
            default: true
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for fast lookup
organizationSchema.index({ slug: 1 });
organizationSchema.index({ domain: 1 });

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
