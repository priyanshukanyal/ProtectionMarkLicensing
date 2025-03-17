import sql from "mssql";
import bcrypt from "bcryptjs";
import connectDB from "../config/database.js";

const userModel = {
  // Register a new user
  async registerUser(name, email, password, role = "Guest") {
    const pool = await connectDB();
    if (!pool) throw new Error("Database connection failed");

    try {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool
        .request()
        .input("name", sql.NVarChar, name)
        .input("email", sql.NVarChar, email)
        .input("password", sql.NVarChar, hashedPassword)
        .input("role", sql.NVarChar, role).query(`
          INSERT INTO Users (name, email, password, role) 
          OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role 
          VALUES (@name, @email, @password, @role)
        `);
      return result.recordset[0]; // Return newly created user
    } catch (error) {
      console.error("Error registering user:", error);
      throw new Error("Database error");
    }
  },

  // Find user by email
  async getUserByEmail(email) {
    const pool = await connectDB();
    if (!pool) throw new Error("Database connection failed");

    try {
      const result = await pool
        .request()
        .input("email", sql.NVarChar, email)
        .query("SELECT * FROM Users WHERE email = @email");

      return result.recordset[0]; // Return user if found
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("Database error");
    }
  },

  // Find user by ID
  async getUserById(userId) {
    const pool = await connectDB();
    if (!pool) throw new Error("Database connection failed");

    try {
      const result = await pool
        .request()
        .input("userId", sql.UniqueIdentifier, userId)
        .query("SELECT id, name, email, role FROM Users WHERE id = @userId");

      return result.recordset[0];
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("Database error");
    }
  },

  // Update user profile
  async updateUserProfile(userId, name, email, password) {
    const pool = await connectDB();
    if (!pool) throw new Error("Database connection failed");

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await pool
        .request()
        .input("userId", sql.UniqueIdentifier, userId)
        .input("name", sql.NVarChar, name)
        .input("email", sql.NVarChar, email)
        .input("password", sql.NVarChar, hashedPassword).query(`
          UPDATE Users 
          SET name = @name, email = @email, password = @password 
          OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role
          WHERE id = @userId
        `);

      return result.recordset[0]; // Return updated user
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Database error");
    }
  },

  // Delete user by ID
  async deleteUser(userId) {
    const pool = await connectDB();
    if (!pool) throw new Error("Database connection failed");

    try {
      await pool
        .request()
        .input("userId", sql.UniqueIdentifier, userId)
        .query("DELETE FROM Users WHERE id = @userId");

      return { message: "User deleted successfully" };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Database error");
    }
  },
};

export default userModel;
