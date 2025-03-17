import sql from "mssql";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Database configuration
const config = {
  user: process.env.DB_USER, // Database username
  password: process.env.DB_PASS, // Database password
  server: process.env.DB_HOST, // Database server (e.g., "localhost")
  database: process.env.DB_NAME, // Database name
  options: {
    encrypt: false, // Set to true if using Azure SQL
    trustServerCertificate: true, // Required for self-signed certificates
  },
};

// Connect to the database
const connectDB = async () => {
  try {
    const pool = await sql.connect(config);
    console.log("✅ Database connected successfully");
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    return null;
  }
};

export default connectDB;
