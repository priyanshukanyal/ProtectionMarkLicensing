import express from "express";
import {
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Get user profile (protected route)
router.get("/profile", protect, getUserProfile);

// Update user profile (protected route)
router.put("/profile", protect, updateUserProfile);

// Delete user (protected route)
router.delete("/profile", protect, deleteUser);

export default router;
