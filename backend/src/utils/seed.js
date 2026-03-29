import User from "../model/user.model.js";
import config from "../config/config.js";

/**
 * Ensures that a Super Admin account exists in the database.
 * Uses credentials from the .env file.
 */
export const seedSuperAdmin = async () => {
  try {
    const { email, password } = config.admin;

    // Check if the Super Admin already exists
    const existingAdmin = await User.findOne({ email, role: 'superadmin' });

    if (existingAdmin) {
      console.log(`ℹ️  Super Admin already exists: ${email}`);
      return;
    }

    // Create the Super Admin
    // Note: User.model.js has a pre('save') hook that will bcyrpt the password automatically
    await User.create({
      name: "Super Admin",
      email: email,
      password: password,
      role: "superadmin",
      profileComplete: true,
    });

    console.log(`✅ Super Admin account seeded and ENCRYPTED successfully: ${email}`);
  } catch (error) {
    console.error("❌ Failed to seed Super Admin:", error.message);
    // We don't exit the process here to allow the rest of the server to start, 
    // although the system will be limited without an admin.
  }
};
