import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js"; // Import the mssql database connection
import policyRoutes from "./routes/policyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import licenseRoutes from "./routes/licenseRoutes.js";
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for cross-origin requests

// Routes
app.use("/api/policies", policyRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/licenses", licenseRoutes);
// Set the port dynamically from .env or default to 5000
const PORT = process.env.PORT || 5000;

// Connect to Database and Start Server
connectDB() // Connect to SQL Server database
  .then((pool) => {
    if (pool) {
      console.log("✅ Database connected successfully");

      // Start the server
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    } else {
      throw new Error("Database connection failed");
    }
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });
