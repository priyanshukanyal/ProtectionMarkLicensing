import sql from "mssql";
import bcrypt from "bcryptjs";
import connectDB from "../config/database.js";

const userModel = {
  // Register a new user
  async registerUser(name, email, password, role = "Guest") {
    const pool = await connectDB();
    if (!pool) throw new Error("Database connection failed");

    try {
      // Check if the email already exists
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) throw new Error("Email already in use");

      // Hash password before storing
      const hashedPassword = bcrypt.hashSync(password, 10);

      const result = await pool
        .request()
        .input("name", sql.NVarChar, name)
        .input("email", sql.NVarChar, email.toLowerCase())
        .input("password", sql.NVarChar, hashedPassword)
        .input("role", sql.NVarChar, role).query(`
          INSERT INTO Users (name, email, password, role) 
          OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role 
          VALUES (@name, @email, @password, @role)
        `);

      return result.recordset[0];
    } catch (error) {
      console.error("Error registering user:", error.message);
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
        .input("email", sql.NVarChar, email.toLowerCase())
        .query(
          "SELECT id, name, email, password, role FROM Users WHERE email = @email"
        );

      return result.recordset[0] || null;
    } catch (error) {
      console.error("Error fetching user by email:", error.message);
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

      return result.recordset[0] || null;
    } catch (error) {
      console.error("Error fetching user by ID:", error.message);
      throw new Error("Database error");
    }
  },

  // Update user profile
  async updateUserProfile(userId, name, email, password = null) {
    const pool = await connectDB();
    if (!pool) throw new Error("Database connection failed");

    try {
      let query = `
        UPDATE Users 
        SET name = @name, email = @email
      `;

      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        query += `, password = @password`;
      }

      query += ` OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role WHERE id = @userId`;

      const request = pool
        .request()
        .input("userId", sql.UniqueIdentifier, userId)
        .input("name", sql.NVarChar, name)
        .input("email", sql.NVarChar, email.toLowerCase());

      if (password) {
        request.input("password", sql.NVarChar, bcrypt.hashSync(password, 10));
      }

      const result = await request.query(query);
      return result.recordset[0] || null;
    } catch (error) {
      console.error("Error updating user profile:", error.message);
      throw new Error("Database error");
    }
  },

  // Delete user by ID
  async deleteUser(userId) {
    const pool = await connectDB();
    if (!pool) throw new Error("Database connection failed");

    try {
      const result = await pool
        .request()
        .input("userId", sql.UniqueIdentifier, userId)
        .query("DELETE FROM Users WHERE id = @userId");

      return result.rowsAffected[0] > 0
        ? { message: "User deleted successfully" }
        : { message: "User not found" };
    } catch (error) {
      console.error("Error deleting user:", error.message);
      throw new Error("Database error");
    }
  },
};

export default userModel;
