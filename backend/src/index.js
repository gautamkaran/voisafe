import app from "./app.js";
import connectDB from "./config/database.js";
import config from "./config/config.js";
import { seedSuperAdmin } from "./utils/seed.js";

const PORT = config.server.port;

const startServer = async () => {
  try {
    await connectDB();

    // 🔥 Seed the Super Admin account (automatic once DB connects)
    await seedSuperAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
