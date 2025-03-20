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

// ✅ Create a new license
export const createLicense = async (req, res) => {
  try {
    const newLicense = await licenseModel.createLicense(req.body);
    res.status(201).json({
      success: true,
      message: "License created successfully",
      data: newLicense,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

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

// ✅ Deallocate a license from a device
export const deallocateLicense = async (req, res) => {
  try {
    const { licenseId, deviceId } = req.body;
    if (!licenseId || !deviceId)
      return res.status(400).json({
        success: false,
        message: "License ID and Device ID are required",
      });

    const updatedLicense = await licenseModel.deallocateLicense(
      licenseId,
      deviceId
    );
    res.json({
      success: true,
      message: "License deallocated successfully",
      data: updatedLicense,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Generate a License Code
export const generateLicense = (req, res) => {
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
    res.json({ success: true, licenseCode });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Validate a License Code
export const validateLicense = (req, res) => {
  try {
    const { licenseCode } = req.body;
    if (!licenseCode)
      return res
        .status(400)
        .json({ success: false, message: "License code is required" });

    const licenseData = decodeLicenseCode(licenseCode);
    res.json({ success: true, data: licenseData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
