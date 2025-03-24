import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import { generateToken } from "./authController.js"; // Import token function

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await userModel.getUserByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Assign role - only admins can assign roles
    const assignedRole =
      req.user?.role === "Admin" || req.user?.role === "Super Admin"
        ? role || "Guest"
        : "Guest";

    const newUser = await userModel.registerUser(
      name,
      email,
      password,
      assignedRole
    );

    res.status(201).json({
      token: generateToken(newUser),
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get Profile Error:", error.message);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await userModel.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const updatedUser = await userModel.updateUserProfile(
      req.user.id,
      name || user.name,
      email ? email.toLowerCase() : user.email,
      hashedPassword
    );

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await userModel.deleteUser(req.user.id);
    res.json({ message: "User removed successfully" });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
