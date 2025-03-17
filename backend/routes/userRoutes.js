import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register User (only Admins & Super Admins can assign roles)
router.post("/register", registerUser);

// Login User
router.post("/login", protect, loginUser);

// Get User Profile
router.get("/me", protect, getUserProfile);

// Update User Profile
router.put("/profile", protect, updateUserProfile);

// Delete User (Only Admins and Super Admins)
router.delete(
  "/profile",
  protect,
  authorize("Admin", "Super Admin"),
  deleteUser
);

// Admin-Only Route to Access Admin Data
router.get(
  "/admin-data",
  protect,
  authorize("Admin", "Super Admin"),
  (req, res) => {
    res.json({ message: "Admin data accessed" });
  }
);

export default router;
