import sql from "mssql";
import connectDB from "../config/database.js";

const deviceModel = {
  // ✅ Get all devices with license info
  async getAllDevices() {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT d.*, l.LicenseName 
      FROM DeviceMaster d
      LEFT JOIN LicenseMaster l ON d.LicenseID = l.LicenseID
    `);
    return result.recordset;
  },

  // ✅ Get a single device by ID
  async getDeviceById(deviceId) {
    const pool = await connectDB();
    const result = await pool.request().input("DeviceID", sql.Int, deviceId)
      .query(`
        SELECT d.*, l.LicenseName 
        FROM DeviceMaster d
        LEFT JOIN LicenseMaster l ON d.LicenseID = l.LicenseID
        WHERE d.DeviceID = @DeviceID
      `);
    return result.recordset[0];
  },

  // ✅ Create a new device
  async createDevice(deviceData) {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("DeviceName", sql.NVarChar, deviceData.DeviceName)
      .input("MACAddress", sql.NVarChar, deviceData.MACAddress)
      .input("IPAddress", sql.NVarChar, deviceData.IPAddress)
      .input("Allocated", sql.Bit, deviceData.Allocated)
      .input("LicenseID", sql.Int, deviceData.LicenseID || null) // Handle optional LicenseID
      .input("GroupID", sql.Int, deviceData.GroupID || null) // Handle optional GroupID
      .query(
        `INSERT INTO DeviceMaster (DeviceName, MACAddress, IPAddress, Allocated, LicenseID, GroupID)
         OUTPUT INSERTED.* VALUES (@DeviceName, @MACAddress, @IPAddress, @Allocated, @LicenseID, @GroupID)`
      );
    return result.recordset[0];
  },

  // ✅ Update an existing device
  async updateDevice(deviceId, deviceData) {
    const pool = await connectDB();
    await pool
      .request()
      .input("DeviceID", sql.Int, deviceId)
      .input("DeviceName", sql.NVarChar, deviceData.DeviceName)
      .input("MACAddress", sql.NVarChar, deviceData.MACAddress)
      .input("IPAddress", sql.NVarChar, deviceData.IPAddress)
      .input("Allocated", sql.Bit, deviceData.Allocated)
      .input("LicenseID", sql.Int, deviceData.LicenseID || null) // Handle optional LicenseID
      .input("GroupID", sql.Int, deviceData.GroupID || null) // Handle optional GroupID
      .query(`
      UPDATE DeviceMaster 
      SET DeviceName = @DeviceName, 
          MACAddress = @MACAddress, 
          IPAddress = @IPAddress, 
          Allocated = @Allocated, 
          LicenseID = @LicenseID,
          GroupID = @GroupID
      WHERE DeviceID = @DeviceID
    `);
  },

  // ✅ Delete a device
  async deleteDevice(deviceId) {
    const pool = await connectDB();
    await pool
      .request()
      .input("DeviceID", sql.Int, deviceId)
      .query("DELETE FROM DeviceMaster WHERE DeviceID = @DeviceID");
  },

  async getDevicesByAllocationStatus(isAllocated) {
    const pool = await connectDB();
    const result = await pool.request().input("Allocated", sql.Bit, isAllocated) // ✅ directly pass
      .query(`
      SELECT d.*, l.LicenseName 
      FROM DeviceMaster d
      LEFT JOIN LicenseMaster l ON d.LicenseID = l.LicenseID
      WHERE d.Allocated = @Allocated
    `);

    return result.recordset;
  },
};

export default deviceModel;
