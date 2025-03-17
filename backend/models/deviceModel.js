import sql from "mssql";
import connectDB from "../config/database.js";

const deviceModel = {
  async getAllDevices() {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM DeviceMaster");
    return result.recordset;
  },

  async getDeviceById(deviceId) {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("DeviceID", sql.Int, deviceId)
      .query("SELECT * FROM DeviceMaster WHERE DeviceID = @DeviceID");
    return result.recordset[0];
  },

  async createDevice(deviceData) {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("DeviceName", sql.NVarChar, deviceData.DeviceName)
      .input("Licence", sql.NVarChar, deviceData.Licence)
      .query(
        "INSERT INTO DeviceMaster (DeviceName, Licence) OUTPUT INSERTED.* VALUES (@DeviceName, @Licence)"
      );
    return result.recordset[0];
  },

  async updateDevice(deviceId, deviceData) {
    const pool = await connectDB();
    await pool
      .request()
      .input("DeviceID", sql.Int, deviceId)
      .input("DeviceName", sql.NVarChar, deviceData.DeviceName)
      .input("Licence", sql.NVarChar, deviceData.Licence)
      .query(
        "UPDATE DeviceMaster SET DeviceName = @DeviceName, Licence = @Licence WHERE DeviceID = @DeviceID"
      );
  },

  async deleteDevice(deviceId) {
    const pool = await connectDB();
    await pool
      .request()
      .input("DeviceID", sql.Int, deviceId)
      .query("DELETE FROM DeviceMaster WHERE DeviceID = @DeviceID");
  },
};

export default deviceModel;
