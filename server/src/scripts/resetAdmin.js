const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/database');

dotenv.config();

const resetAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@college.edu';

        // Delete existing admin
        await User.deleteOne({ email: adminEmail });
        console.log('🗑️  Old admin user deleted');

        // Create new admin with fresh password
        const adminUser = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: 'admin123456', // Fresh password
            role: 'admin',
            college: 'ABC University',
            department: 'Administration',
            isActive: true,
            isVerified: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log(`📧 Email:    ${adminEmail}`);
        console.log(`🔑 Password: admin123456`);
        console.log('-----------------------------------');
        console.log('👉 Use these credentials to login at /login');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

resetAdmin();
