import dotenv from "dotenv";
dotenv.config();

const {
  PORT,
  DB_URI,
  MONGO_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  SUPER_ADMIN_EMAIL,
  SUPER_ADMIN, // This is the password
} = process.env;

const resolvedDbUri = DB_URI || MONGO_URI || "mongodb://mongo:27017/voisafe";

// Validate required environment variables
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error(
    "Required environment variables are missing. Please check your .env file.",
  );
}

const config = {
  server: {
    port: Number(PORT) || 3000,
  },

  database: {
    uri: resolvedDbUri,
  },

  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  admin: {
    email: SUPER_ADMIN_EMAIL || "admin@voisafe.org",
    password: SUPER_ADMIN || "admin123",
  },
};

export default config;
