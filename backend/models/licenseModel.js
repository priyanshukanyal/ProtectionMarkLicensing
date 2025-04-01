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

    // Check if device is already allocated
    if (device.Allocated) {
      throw new Error(`Device ID ${deviceId} is already allocated.`);
    }

    // Check if allocating one more device exceeds available licenses
    if (license.AllocatedLicenses >= license.Quantity) {
      throw new Error(
        "No available licenses to allocate. Maximum limit reached."
      );
    }

    // Update LicenseMaster
    await pool.request().input("LicenseID", sql.Int, licenseId).query(`
        UPDATE LicenseMaster
        SET AllocatedLicenses = AllocatedLicenses + 1,
            DeallocatedLicenses = DeallocatedLicenses - 1
        WHERE LicenseID = @LicenseID;
    `);

    // Update DeviceMaster
    await pool
      .request()
      .input("DeviceID", sql.Int, deviceId)
      .input("LicenseID", sql.Int, licenseId) // <---- You missed this
      .query(`
        UPDATE DeviceMaster
        SET Allocated = 1, LicenseID = @LicenseID
        WHERE DeviceID = @DeviceID;
    `);

    // ✅ Return updated device info
    const updatedDevice = await this.getDeviceById(deviceId);
    return updatedDevice;
  },

  // ✅ Deallocate a license from a device
  async deallocateLicense(licenseId, deviceId) {
    const pool = await connectDB();

    // ✅ Use `getLicenseById` instead of `findById`
    const license = await this.getLicenseById(licenseId);
    if (!license) throw new Error(`License ID ${licenseId} not found.`);

    const device = await this.getDeviceById(deviceId);
    if (!device) throw new Error(`Device ID ${deviceId} not found.`);

    // ✅ Proceed with deallocation only if license exists
    if (license.AllocatedLicenses <= 0) {
      throw new Error("No allocated licenses available to deallocate.");
    }

    // ✅ Ensure the device actually has this license
    const result = await pool
      .request()
      .input("LicenseID", sql.Int, licenseId)
      .input("DeviceID", sql.Int, deviceId).query(`
      SELECT * FROM DeviceLicence WHERE LicenseID = @LicenseID AND DeviceID = @DeviceID
    `);

    if (result.recordset.length === 0) {
      throw new Error(`Device ID ${deviceId} is not allocated this license.`);
    }

    // ✅ Update LicenseMaster (for only this license)
    await pool.request().input("LicenseID", sql.Int, licenseId).query(`
      UPDATE LicenseMaster
      SET AllocatedLicenses = AllocatedLicenses - 1,
          DeallocatedLicenses = DeallocatedLicenses + 1
      WHERE LicenseID = @LicenseID;
    `);

    // ✅ Remove only this license-device mapping
    await pool
      .request()
      .input("LicenseID", sql.Int, licenseId)
      .input("DeviceID", sql.Int, deviceId).query(`
      DELETE FROM DeviceLicence WHERE LicenseID = @LicenseID AND DeviceID = @DeviceID;
    `);

    // ✅ Check if the device has other licenses
    const checkRemainingLicenses = await pool
      .request()
      .input("DeviceID", sql.Int, deviceId).query(`
      SELECT COUNT(*) AS remainingLicenses FROM DeviceLicence WHERE DeviceID = @DeviceID
    `);

    const remainingLicenses =
      checkRemainingLicenses.recordset[0].remainingLicenses;

    // ✅ If no licenses remain, mark device as "not allocated"
    if (remainingLicenses === 0) {
      await pool.request().input("DeviceID", sql.Int, deviceId).query(`
        UPDATE DeviceMaster
        SET Allocated = 0
        WHERE DeviceID = @DeviceID;
      `);
    }

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

  async getAllocatedAndDeallocatedDevices(licenseId) {
    const pool = await connectDB();

    // Fetch devices associated with the given license ID
    const result = await pool.request().input("licenseId", licenseId).query(`
      SELECT d.DeviceID, d.DeviceName, d.IPAddress, d.MACAddress, 
             ISNULL(d.Allocated, 0) AS Allocated
      FROM DeviceMaster d
      INNER JOIN DeviceLicence ldm ON d.DeviceID = ldm.DeviceID
      WHERE ldm.LicenseID = @licenseId
    `);

    const devices = result.recordset;

    // Categorize devices
    const allocatedDevices = devices.filter((device) => device.Allocated === 1);
    const deallocatedDevices = devices.filter(
      (device) => device.Allocated === 0
    );

    return { allocatedDevices, deallocatedDevices };
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
  async createLicense(licenseData) {
    const pool = await connectDB();

    if (licenseData.Quantity <= 0) {
      throw new Error("Quantity must be greater than 0.");
    }

    await pool
      .request()
      .input("LicenseName", sql.NVarChar, licenseData.LicenseName)
      .input("PartnerName", sql.NVarChar, licenseData.PartnerName) // New field
      .input("PurchaseDate", sql.Date, licenseData.PurchaseDate)
      .input("Quantity", sql.Int, licenseData.Quantity).query(`
            INSERT INTO LicenseMaster (LicenseName, PartnerName, PurchaseDate, Quantity, AllocatedLicenses, DeallocatedLicenses)
            VALUES (@LicenseName, @PartnerName, @PurchaseDate, @Quantity, 0, @Quantity)
        `);

    // Fetch the last inserted row manually
    const result = await pool.request().query(`
        SELECT TOP 1 * FROM LicenseMaster ORDER BY LicenseID DESC
    `);

    return result.recordset[0];
  },
};

export default licenseModel;
