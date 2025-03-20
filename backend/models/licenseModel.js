import sql from "mssql";
import connectDB from "../config/database.js";

const licenseModel = {
  // ✅ Get all licenses
  async getAllLicenses() {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT 
        LicenseID, 
        LicenseName, 
        PurchaseDate, 
        ExpiryDate, 
        Quantity,
        AllocatedLicenses,
        DeallocatedLicenses
      FROM LicenseMaster
    `);
    return result.recordset;
  },

  // ✅ Get a single license by ID
  async getLicenseById(licenseId) {
    const pool = await connectDB();
    const result = await pool.request().input("LicenseID", sql.Int, licenseId)
      .query(`
        SELECT 
          LicenseID, 
          LicenseName, 
          PurchaseDate, 
          ExpiryDate, 
          Quantity,
          AllocatedLicenses,
          DeallocatedLicenses
        FROM LicenseMaster
        WHERE LicenseID = @LicenseID
      `);
    return result.recordset[0] || null;
  },

  // ✅ Get a single device by ID
  async getDeviceById(deviceId) {
    const pool = await connectDB();
    const result = await pool.request().input("DeviceID", sql.Int, deviceId)
      .query(`
        SELECT 
          DeviceID, 
          DeviceName, 
          IPAddress, 
          MACAddress, 
          Allocated
        FROM DeviceMaster
        WHERE DeviceID = @DeviceID
      `);
    return result.recordset[0] || null;
  },

  // ✅ Allocate a license to a device
  async allocateLicense(licenseId, deviceId) {
    const pool = await connectDB();

    // Validate licenseId and deviceId
    if (isNaN(licenseId) || isNaN(deviceId)) {
      throw new Error("Invalid licenseId or deviceId.");
    }

    // Validate license
    const license = await this.getLicenseById(licenseId);
    if (!license) throw new Error(`License ID ${licenseId} not found.`);

    // Validate device
    const device = await this.getDeviceById(deviceId);
    if (!device) throw new Error(`Device ID ${deviceId} not found.`);

    if (license.DeallocatedLicenses <= 0) {
      throw new Error("No available licenses to allocate.");
    }

    // ✅ Update LicenseMaster
    await pool.request().input("LicenseID", sql.Int, licenseId).query(`
    UPDATE LicenseMaster
    SET AllocatedLicenses = AllocatedLicenses + 1,
        DeallocatedLicenses = DeallocatedLicenses - 1
    WHERE LicenseID = @LicenseID;
  `);

    // ✅ Update DeviceMaster to mark device as allocated
    await pool.request().input("DeviceID", sql.Int, deviceId).query(`
    UPDATE DeviceMaster
    SET Allocated = 1
    WHERE DeviceID = @DeviceID;
  `);

    // ✅ Return updated device info
    const updatedDevice = await this.getDeviceById(deviceId);
    return updatedDevice;
  },

  // ✅ Deallocate a license from a device
  async deallocateLicense(licenseId, deviceId) {
    const pool = await connectDB();

    // Validate license
    const license = await this.getLicenseById(licenseId);
    if (!license) throw new Error(`License ID ${licenseId} not found.`);

    // Validate device
    const device = await this.getDeviceById(deviceId);
    if (!device) throw new Error(`Device ID ${deviceId} not found.`);

    if (license.AllocatedLicenses <= 0) {
      throw new Error("No allocated licenses available to deallocate.");
    }

    // ✅ Update LicenseMaster
    await pool.request().input("LicenseID", sql.Int, licenseId).query(`
      UPDATE LicenseMaster
      SET AllocatedLicenses = AllocatedLicenses - 1,
          DeallocatedLicenses = DeallocatedLicenses + 1
      WHERE LicenseID = @LicenseID;
    `);

    // ✅ Update DeviceMaster to mark device as deallocated
    await pool.request().input("DeviceID", sql.Int, deviceId).query(`
      UPDATE DeviceMaster
      SET Allocated = 0
      WHERE DeviceID = @DeviceID;
    `);

    // ✅ Return updated license info
    const updatedLicense = await this.getLicenseById(licenseId);
    return updatedLicense;
  },

  // ✅ Create a new license (DeallocatedLicenses = Quantity initially)
  async createLicense(licenseData) {
    const pool = await connectDB();

    if (licenseData.Quantity <= 0) {
      throw new Error("Quantity must be greater than 0.");
    }

    const result = await pool
      .request()
      .input("LicenseName", sql.NVarChar, licenseData.LicenseName)
      .input("PurchaseDate", sql.Date, licenseData.PurchaseDate)
      .input("ExpiryDate", sql.Date, licenseData.ExpiryDate)
      .input("Quantity", sql.Int, licenseData.Quantity).query(`
        INSERT INTO LicenseMaster (LicenseName, PurchaseDate, ExpiryDate, Quantity, AllocatedLicenses, DeallocatedLicenses)
        OUTPUT INSERTED.*
        VALUES (@LicenseName, @PurchaseDate, @ExpiryDate, @Quantity, 0, @Quantity)
      `);

    return result.recordset[0];
  },

  // ✅ Update a license
  async updateLicense(licenseId, licenseData) {
    const pool = await connectDB();
    const existingLicense = await this.getLicenseById(licenseId);
    if (!existingLicense) throw new Error(`License ID ${licenseId} not found.`);

    if (licenseData.Quantity < existingLicense.AllocatedLicenses) {
      throw new Error("Quantity cannot be less than Allocated Licenses.");
    }

    const result = await pool
      .request()
      .input("LicenseID", sql.Int, licenseId)
      .input("LicenseName", sql.NVarChar, licenseData.LicenseName)
      .input("PurchaseDate", sql.Date, licenseData.PurchaseDate)
      .input("ExpiryDate", sql.Date, licenseData.ExpiryDate)
      .input("Quantity", sql.Int, licenseData.Quantity).query(`
        UPDATE LicenseMaster 
        SET LicenseName = @LicenseName, 
            PurchaseDate = @PurchaseDate, 
            ExpiryDate = @ExpiryDate, 
            Quantity = @Quantity
        WHERE LicenseID = @LicenseID;
        SELECT * FROM LicenseMaster WHERE LicenseID = @LicenseID;
      `);

    return result.recordset[0];
  },

  // ✅ Delete a license
  async deleteLicense(licenseId) {
    const pool = await connectDB();
    const existingLicense = await this.getLicenseById(licenseId);
    if (!existingLicense) throw new Error(`License ID ${licenseId} not found.`);

    await pool
      .request()
      .input("LicenseID", sql.Int, licenseId)
      .query("DELETE FROM LicenseMaster WHERE LicenseID = @LicenseID");

    return { message: `License ID ${licenseId} deleted successfully.` };
  },
};

export default licenseModel;
