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
    return result.recordset[0] || null; // Return null if not found
  },

  // ✅ Create a new license
  async createLicense(licenseData) {
    const pool = await connectDB();

    // Ensure allocated and deallocated are not more than quantity
    if (
      licenseData.AllocatedLicenses + licenseData.DeallocatedLicenses >
        licenseData.Quantity ||
      licenseData.AllocatedLicenses > licenseData.Quantity ||
      licenseData.DeallocatedLicenses > licenseData.Quantity
    ) {
      throw new Error(
        "Allocated and Deallocated Licenses cannot exceed Quantity."
      );
    }

    const result = await pool
      .request()
      .input("LicenseName", sql.NVarChar, licenseData.LicenseName)
      .input("PurchaseDate", sql.Date, licenseData.PurchaseDate)
      .input("ExpiryDate", sql.Date, licenseData.ExpiryDate)
      .input("Quantity", sql.Int, licenseData.Quantity)
      .input("AllocatedLicenses", sql.Int, licenseData.AllocatedLicenses)
      .input("DeallocatedLicenses", sql.Int, licenseData.DeallocatedLicenses)
      .query(`
        INSERT INTO LicenseMaster (LicenseName, PurchaseDate, ExpiryDate, Quantity, AllocatedLicenses, DeallocatedLicenses)
        OUTPUT INSERTED.*
        VALUES (@LicenseName, @PurchaseDate, @ExpiryDate, @Quantity, @AllocatedLicenses, @DeallocatedLicenses)
      `);
    return result.recordset[0];
  },

  // ✅ Update a license
  async updateLicense(licenseId, licenseData) {
    const pool = await connectDB();

    // Check if LicenseID exists
    const existingLicense = await this.getLicenseById(licenseId);
    if (!existingLicense) throw new Error(`LicenseID ${licenseId} not found.`);

    // Ensure allocated and deallocated are not more than quantity
    if (
      licenseData.AllocatedLicenses + licenseData.DeallocatedLicenses >
        licenseData.Quantity ||
      licenseData.AllocatedLicenses > licenseData.Quantity ||
      licenseData.DeallocatedLicenses > licenseData.Quantity
    ) {
      throw new Error(
        "Allocated and Deallocated Licenses cannot exceed Quantity."
      );
    }

    const result = await pool
      .request()
      .input("LicenseID", sql.Int, licenseId)
      .input("LicenseName", sql.NVarChar, licenseData.LicenseName)
      .input("PurchaseDate", sql.Date, licenseData.PurchaseDate)
      .input("ExpiryDate", sql.Date, licenseData.ExpiryDate)
      .input("Quantity", sql.Int, licenseData.Quantity)
      .input("AllocatedLicenses", sql.Int, licenseData.AllocatedLicenses)
      .input("DeallocatedLicenses", sql.Int, licenseData.DeallocatedLicenses)
      .query(`
        UPDATE LicenseMaster 
        SET LicenseName = @LicenseName, 
            PurchaseDate = @PurchaseDate, 
            ExpiryDate = @ExpiryDate, 
            Quantity = @Quantity,
            AllocatedLicenses = @AllocatedLicenses,
            DeallocatedLicenses = @DeallocatedLicenses
        WHERE LicenseID = @LicenseID;
        SELECT * FROM LicenseMaster WHERE LicenseID = @LicenseID;
      `);

    return result.recordset[0]; // Return updated record
  },

  // ✅ Delete a license
  async deleteLicense(licenseId) {
    const pool = await connectDB();

    // Check if LicenseID exists
    const existingLicense = await this.getLicenseById(licenseId);
    if (!existingLicense) throw new Error(`LicenseID ${licenseId} not found.`);

    await pool
      .request()
      .input("LicenseID", sql.Int, licenseId)
      .query("DELETE FROM LicenseMaster WHERE LicenseID = @LicenseID");

    return { message: `LicenseID ${licenseId} deleted successfully.` };
  },
};

export default licenseModel;
