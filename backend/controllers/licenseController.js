import licenseModel from "../models/licenseModel.js";
import {
  generateLicenseCode,
  decodeLicenseCode,
} from "../utils/licenseUtils.js";

// ✅ Get all licenses
export const getAllLicenses = async (req, res) => {
  try {
    const licenses = await licenseModel.getAllLicenses();
    res.json(licenses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ Get a single license by ID
export const getLicenseById = async (req, res) => {
  try {
    const license = await licenseModel.getLicenseById(req.params.id);
    if (!license) {
      return res.status(404).json({ message: "License not found" });
    }
    res.json(license);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// ✅ Create a new license
export const createLicense = async (req, res) => {
  try {
    const newLicense = await licenseModel.createLicense(req.body);
    res.json(newLicense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Update a license
export const updateLicense = async (req, res) => {
  try {
    const updatedLicense = await licenseModel.updateLicense(
      req.params.id,
      req.body
    );
    res.json({ message: "License updated successfully", updatedLicense });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete a license
export const deleteLicense = async (req, res) => {
  try {
    await licenseModel.deleteLicense(req.params.id);
    res.json({ message: "License deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
// ✅ Generate a License Code
export const generateLicense = (req, res) => {
  try {
    const { OrganizationName, PurchaseDate, Quantity, PartnerName } = req.body;

    if (!OrganizationName || !PurchaseDate || !Quantity || !PartnerName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const licenseCode = generateLicenseCode({
      OrganizationName,
      PurchaseDate,
      Quantity,
      PartnerName,
    });

    res.json({ licenseCode });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Validate a License Code
export const validateLicense = (req, res) => {
  try {
    const { licenseCode } = req.body;

    if (!licenseCode) {
      return res.status(400).json({ message: "License code is required" });
    }

    const licenseData = decodeLicenseCode(licenseCode);

    res.json(licenseData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
