const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/database');

// Load env vars
dotenv.config();

/**
 * SEED SUPER ADMIN SCRIPT
 * 
 * Usage: node src/scripts/seedSuperAdmin.js
 */

const seedSuperAdmin = async () => {
    try {
        await connectDB();

        const email = 'owner@voisafe.com';
        const password = 'superPassword123';

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // Update role if already exists
            existingUser.role = 'super-admin';
            await existingUser.save();
            console.log('⚠️  User updated to Super Admin!');
        } else {
            // Create Super Admin
            await User.create({
                name: 'System Owner',
                email: email,
                password: password,
                role: 'super-admin',
                college: 'VoiSafe HQ', // Special org
                department: 'Platform',
                isVerified: true
            });
            console.log('✅ Super Admin user created successfully!');
        }

        console.log('-----------------------------------');
        console.log(`   Email:    ${email}`);
        console.log(`   Password: ${password}`);
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating super admin:', error);
        process.exit(1);
    }
};

seedSuperAdmin();
