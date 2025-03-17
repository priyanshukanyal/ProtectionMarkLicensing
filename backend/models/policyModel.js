import sql from "mssql";
import connectDB from "../config/database.js";

const policyModel = {
  async getAllPolicies() {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM PolicyMaster");
    return result.recordset;
  },

  async getPolicyById(policyId) {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("PolicyID", sql.Int, policyId)
      .query("SELECT * FROM PolicyMaster WHERE PolicyID = @PolicyID");
    return result.recordset[0];
  },

  async createPolicy(policyData) {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("PolicyName", sql.NVarChar, policyData.PolicyName)
      .query(
        "INSERT INTO PolicyMaster (PolicyName) OUTPUT INSERTED.* VALUES (@PolicyName)"
      );
    return result.recordset[0];
  },

  async updatePolicy(policyId, policyData) {
    const pool = await connectDB();
    await pool
      .request()
      .input("PolicyID", sql.Int, policyId)
      .input("PolicyName", sql.NVarChar, policyData.PolicyName)
      .query(
        "UPDATE PolicyMaster SET PolicyName = @PolicyName WHERE PolicyID = @PolicyID"
      );
  },

  async deletePolicy(policyId) {
    const pool = await connectDB();
    await pool
      .request()
      .input("PolicyID", sql.Int, policyId)
      .query("DELETE FROM PolicyMaster WHERE PolicyID = @PolicyID");
  },

  // ✅ Attach a policy to a group
  async attachGroupToPolicy(groupId, policyId) {
    const pool = await connectDB();
    await pool
      .request()
      .input("GroupID", sql.Int, groupId)
      .input("PolicyID", sql.Int, policyId)
      .query(
        "INSERT INTO PolicyGroup (GroupID, PolicyID) VALUES (@GroupID, @PolicyID)"
      );
  },

  // ✅ Delete a policy-group association
  async removeGroupFromPolicy(groupId, policyId) {
    const pool = await connectDB();
    await pool
      .request()
      .input("GroupID", sql.Int, groupId)
      .input("PolicyID", sql.Int, policyId)
      .query(
        "DELETE FROM PolicyGroup WHERE GroupID = @GroupID AND PolicyID = @PolicyID"
      );
  },
};

export default policyModel;
