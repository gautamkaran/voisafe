import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  const DB_URL = config.database.uri;

  if (!DB_URL) {
    throw Error("❌ MONGODB_URL environment variable is not defined");
  }

  try {
    const connectionInstance = await mongoose.connect(DB_URL);

    console.log(
      `✅ MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`,
    );

    // 🔥 Index Cleanup
    try {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      const orgCollectionExists = collections.some(
        (col) => col.name === "organizations",
      );

      if (orgCollectionExists) {
        const orgs = mongoose.connection.db.collection("organizations");
        const indexes = await orgs.indexes();

        const hasEmailIndex = indexes.some((idx) => idx.name === "email_1");

        if (hasEmailIndex) {
          await orgs.dropIndex("email_1");
          console.log(
            "🧹 Cleaned legacy 'email_1' index from organizations collection.",
          );
        }
      }
    } catch (indexDropError) {
      console.warn(
        "⚠️ Non-critical Error cleaning indices:",
        indexDropError.message,
      );
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed, retrying in 5 sec...");
    setTimeout(connectDB, 5000); // 🔁 retry
  }
};

export default connectDB;
