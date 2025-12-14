import dotenv from "dotenv";
dotenv.config();

const { PORT, DB_URI, JWT_SECRET, JWT_EXPIRES_IN } = process.env;

// Validate required environment variables
if (!DB_URI) {
  throw new Error(
    "Required environment variables are missing. Please check your .env file.",
  );
}

const config = {
  server: {
    port: Number(PORT) || 3000,
  },

  database: {
    uri: DB_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
};

export default config;
