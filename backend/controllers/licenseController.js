import licenseModel from "../models/licenseModel.js";
import {
  generateLicenseCode,
  decodeLicenseCode,
} from "../utils/licenseUtils.js";

// ✅ Get all licenses
export const getAllLicenses = async (req, res) => {
  try {
    const licenses = await licenseModel.getAllLicenses();
    res.json({ success: true, data: licenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get a single license by ID
export const getLicenseById = async (req, res) => {
  try {
    const licenseId = parseInt(req.params.id);
    if (isNaN(licenseId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid license ID" });

    const license = await licenseModel.getLicenseById(licenseId);
    if (!license)
      return res
        .status(404)
        .json({ success: false, message: "License not found" });

    res.json({ success: true, data: license });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// // ✅ Create a new license
// export const createLicense = async (req, res) => {
//   try {
//     const newLicense = await licenseModel.createLicense(req.body);
//     res.status(201).json({
//       success: true,
//       message: "License created successfully",
//       data: newLicense,
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// ✅ Update a license
export const updateLicense = async (req, res) => {
  try {
    const licenseId = parseInt(req.params.id);
    if (isNaN(licenseId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid license ID" });

    const updatedLicense = await licenseModel.updateLicense(
      licenseId,
      req.body
    );
    res.json({
      success: true,
      message: "License updated successfully",
      data: updatedLicense,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete a license
export const deleteLicense = async (req, res) => {
  try {
    const licenseId = parseInt(req.params.id);
    if (isNaN(licenseId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid license ID" });

    await licenseModel.deleteLicense(licenseId);
    res.json({ success: true, message: "License deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Allocate a license to a device
export const allocateLicense = async (req, res) => {
  try {
    const { licenseId, deviceId } = req.body;
    if (!licenseId || !deviceId)
      return res.status(400).json({
        success: false,
        message: "License ID and Device ID are required",
      });

    const updatedLicense = await licenseModel.allocateLicense(
      licenseId,
      deviceId
    );
    res.json({
      success: true,
      message: "License allocated successfully",
      data: updatedLicense,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
// ✅ Fetch Allocated and Deallocated Devices
export const getAllocatedAndDeallocatedDevices = async (req, res) => {
  try {
    const { licenseId } = req.params;

    if (!licenseId) {
      return res.status(400).json({
        success: false,
        message: "License ID is required.",
      });
    }

    const devices = await licenseModel.getAllocatedAndDeallocatedDevices(
      licenseId
    ); // Ensure this function exists

    if (
      !devices ||
      (!devices.allocatedDevices.length && !devices.deallocatedDevices.length)
    ) {
      return res.status(404).json({
        success: false,
        message: "No devices found for this license.",
      });
    }

    res.json({ success: true, data: devices });
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deallocateLicense = async (req, res) => {
  try {
    const { licenseId, deviceId } = req.body;

    if (!licenseId || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "License ID and Device ID are required",
      });
    }

    // ✅ Ensure we use `getLicenseById()` instead of `findById()`
    const result = await licenseModel.deallocateLicense(licenseId, deviceId);

    return res.status(200).json({
      success: true,
      message: "License deallocated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error deallocating license:", error);
    return res.status(500).json({
      success: false,
      message: "Database error",
      error: error.message,
    });
  }
};

// export const generateLicense = (req, res) => {
//   try {
//     const { OrganizationName, PurchaseDate, Quantity, PartnerName } = req.body;

//     if (!OrganizationName || !PurchaseDate || !Quantity || !PartnerName) {
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields are required" });
//     }

//     const licenseCode = generateLicenseCode({
//       OrganizationName,
//       PurchaseDate,
//       Quantity,
//       PartnerName,
//     });

//     console.log("Backend Generated License Code:", licenseCode); // ✅ Log generated license

//     return res.status(201).json({
//       success: true,
//       message: "License code generated successfully",
//       licenseCode,
//     });
//   } catch (error) {
//     console.error("Error generating license:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error. Please try again later.",
//     });
//   }
// };

export const validateLicense = (req, res) => {
  try {
    const { licenseCode } = req.body;

    if (!licenseCode) {
      return res
        .status(400)
        .json({ success: false, message: "License code is required" });
    }

    console.log("License Code Received for Validation:", licenseCode); // ✅ Log received license

    const licenseData = decodeLicenseCode(licenseCode);

    if (!licenseData) {
      console.log("License decoding failed."); // ✅ Log failure
      return res
        .status(400)
        .json({ success: false, message: "Invalid license code" });
    }

    console.log("Decoded License Data:", licenseData); // ✅ Log decoded data

    return res.status(200).json({
      success: true,
      message: "License code validated successfully",
      data: licenseData,
    });
  } catch (error) {
    console.error("Error validating license:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const createLicense = async (req, res) => {
  try {
    console.log("Incoming License Data:", req.body);

    const newLicense = await licenseModel.createLicense(req.body);

    res.status(201).json({
      success: true,
      message: "License created successfully",
      data: newLicense,
    });
  } catch (error) {
    console.error("Create License Error:", error); // Logs full error in console
    res.status(500).json({
      success: false,
      message: "Database error",
      error: error.message, // Include actual error message
    });
  }
};

export const generateLicense = async (req, res) => {
  try {
    const { OrganizationName, PurchaseDate, Quantity, PartnerName } = req.body;

    if (!OrganizationName || !PurchaseDate || !Quantity || !PartnerName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const licenseCode = generateLicenseCode({
      OrganizationName,
      PurchaseDate,
      Quantity,
      PartnerName,
    });

    console.log("Backend Generated License Code:", licenseCode);

    // ✅ Save to database
    const newLicense = await licenseModel.createLicense({
      LicenseName: licenseCode, // Storing license code as LicenseName
      PartnerName,
      PurchaseDate,
      Quantity,
    });

    return res.status(201).json({
      success: true,
      message: "License code generated and saved successfully",
      licenseCode,
      licenseData: newLicense, // Return saved license details
    });
  } catch (error) {
    console.error("Error generating license:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
export const saveLicense = async (req, res) => {
  try {
    console.log("Received License Data:", req.body); // Debugging

    const {
      licenseCode,
      OrganizationName,
      PurchaseDate,
      Quantity,
      PartnerName,
    } = req.body;

    if (
      !licenseCode ||
      !OrganizationName ||
      !PurchaseDate ||
      !Quantity ||
      !PartnerName
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const savedLicense = await licenseModel.createLicense({
      LicenseName: licenseCode, // Store the generated license code
      PartnerName,
      PurchaseDate,
      Quantity,
    });

    return res.status(201).json({
      success: true,
      message: "License saved successfully",
      licenseData: savedLicense,
    });
  } catch (error) {
    console.error("Error saving license:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};
