import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    const DB_URL = config.database.uri;

    if (!DB_URL) {
      throw Error("❌ MONGODB_URL environment variable is not defined");
    }

    const connectionInstance = await mongoose.connect(DB_URL);
    console.log(
      `✅ MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.error("❌ MONGODB connection Failed !!!", error);
    process.exit(1);
  }
};

export default connectDB;
