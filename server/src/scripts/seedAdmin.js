const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/database');

// Load env vars
dotenv.config();

/**
 * SEED ADMIN SCRIPT
 * 
 * Usage: node src/scripts/seedAdmin.js
 * 
 * This script creates a default Super Admin user.
 * It is safer than exposing an "Admin Registration" page.
 */

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@college.edu';
        const adminPassword = 'adminPassword123';

        // Check if admin already exists
        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('⚠️  Admin user already exists!');
            console.log(`   Email: ${adminEmail}`);
            process.exit(0);
        }

        // Create Admin User
        const adminUser = await User.create({
            name: 'Super Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'admin', // KEY: This sets the admin privileges
            college: 'ABC University', // Example college
            department: 'Administration',
            isVerified: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log(`   Email:    ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
        console.log('-----------------------------------');
        console.log('👉 Use these credentials to login at /login');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
