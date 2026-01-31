const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/database');

dotenv.config();

const debugLogin = async () => {
    try {
        await connectDB();

        const emails = ['admin@college.edu', 'owner@voisafe.com'];

        for (const email of emails) {
            console.log(`\n🔍 Checking user: ${email}`);
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                console.log('❌ User NOT FOUND in database');
                continue;
            }

            console.log(`✅ User found. Role: ${user.role}`);
            console.log(`   Is Active: ${user.isActive}`);
            console.log(`   Stored Hash: ${user.password ? user.password.substring(0, 10) + '...' : 'UNDEFINED'}`);

            // Test Password
            const testPass = email.startsWith('admin') ? 'adminPassword123' : 'superPassword123';
            const isMatch = await user.comparePassword(testPass);

            console.log(`   Testing password '${testPass}': ${isMatch ? '✅ MATCH' : '❌ FAILED'}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Debug Error:', error);
        process.exit(1);
    }
};

debugLogin();
