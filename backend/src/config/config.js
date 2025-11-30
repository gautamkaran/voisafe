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
};

export default config;
