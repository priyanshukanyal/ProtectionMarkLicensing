import sql from "mssql";
import connectDB from "../config/database.js";

const groupModel = {
  async getAllGroups() {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM GroupMaster");
    return result.recordset;
  },

  async getGroupById(groupId) {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("GroupID", sql.Int, groupId)
      .query("SELECT * FROM GroupMaster WHERE GroupID = @GroupID");
    return result.recordset[0];
  },

  async createGroup(groupData) {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("GroupName", sql.NVarChar, groupData.GroupName)
      .query(
        "INSERT INTO GroupMaster (GroupName) OUTPUT INSERTED.* VALUES (@GroupName)"
      );
    return result.recordset[0];
  },

  async updateGroup(groupId, groupData) {
    const pool = await connectDB();
    await pool
      .request()
      .input("GroupID", sql.Int, groupId)
      .input("GroupName", sql.NVarChar, groupData.GroupName)
      .query(
        "UPDATE GroupMaster SET GroupName = @GroupName WHERE GroupID = @GroupID"
      );
  },

  async deleteGroup(groupId) {
    const pool = await connectDB();
    await pool
      .request()
      .input("GroupID", sql.Int, groupId)
      .query("DELETE FROM GroupMaster WHERE GroupID = @GroupID");
  },
};

export default groupModel;
