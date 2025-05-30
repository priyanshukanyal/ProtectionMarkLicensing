import express from "express";
import {
  getAllLicenses,
  getLicenseById,
  createLicense,
  updateLicense,
  deleteLicense,
  allocateLicense,
  deallocateLicense,
  generateLicense,
  validateLicense,
  getAllocatedAndDeallocatedDevices,
  saveLicense,
} from "../controllers/licenseController.js";

const router = express.Router();

// ✅ Get all licenses
router.get("/", getAllLicenses);

// ✅ Get allocated and deallocated devices for a specific license
router.get("/devices/:licenseId", getAllocatedAndDeallocatedDevices);

// ✅ Get a single license by ID
router.get("/:id", getLicenseById);

// ✅ Create a new license
router.post("/", createLicense);

// ✅ Update a license
router.put("/:id", updateLicense);

// ✅ Delete a license
router.delete("/:id", deleteLicense);

// ✅ Allocate a license to a device
router.post("/allocate", allocateLicense);

// ✅ Deallocate a license from a device
router.post("/deallocate", deallocateLicense);

// ✅ Generate a License Code
router.post("/generate", generateLicense);

// ✅ Validate a License Code
router.post("/validate", validateLicense);

router.post("/save", saveLicense); // ✅ New route for saving the license

export default router;
