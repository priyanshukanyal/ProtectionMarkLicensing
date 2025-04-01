import express from "express";
import {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getDevicesByAllocationStatus,
} from "../controllers/deviceController.js";

const router = express.Router();

router.get("/allocated", getDevicesByAllocationStatus); // ✅ put first
router.get("/", getAllDevices);
router.get("/:id", getDeviceById); // ✅ keep this AFTER
router.post("/", createDevice);
router.put("/:id", updateDevice);
router.delete("/:id", deleteDevice);

export default router;
