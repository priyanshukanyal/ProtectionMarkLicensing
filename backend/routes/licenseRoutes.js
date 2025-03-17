import express from "express";
import {
  getAllLicenses,
  getLicenseById,
  createLicense,
  updateLicense,
  deleteLicense,
  generateLicense,
  validateLicense,
} from "../controllers/licenseController.js";

const router = express.Router();

// ✅ Get all licenses
router.get("/", getAllLicenses);

// ✅ Get a single license by ID
router.get("/:id", getLicenseById);

// ✅ Create a new license
router.post("/", createLicense);

// ✅ Update a license
router.put("/:id", updateLicense);

// ✅ Delete a license
router.delete("/:id", deleteLicense);

// ✅ Generate a machine-readable 16-digit license code
router.post("/generate", generateLicense);

// ✅ Validate and decode license code
router.post("/validate", validateLicense);

export default router;
