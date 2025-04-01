import deviceModel from "../models/deviceModel.js";

// ✅ Get all devices
export const getAllDevices = async (req, res) => {
  try {
    const devices = await deviceModel.getAllDevices();
    res.json({ success: true, data: devices });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching devices", error });
  }
};

// ✅ Get a single device by ID
export const getDeviceById = async (req, res) => {
  try {
    const device = await deviceModel.getDeviceById(req.params.id);
    if (!device)
      return res
        .status(404)
        .json({ success: false, message: "Device not found" });
    res.json({ success: true, data: device });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching device", error });
  }
};

// ✅ Create a new device
export const createDevice = async (req, res) => {
  try {
    const newDevice = await deviceModel.createDevice(req.body);
    res.json({ success: true, data: newDevice });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating device", error });
  }
};

// ✅ Update a device
export const updateDevice = async (req, res) => {
  try {
    await deviceModel.updateDevice(req.params.id, req.body);
    res.json({ success: true, message: "Device updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating device", error });
  }
};

// ✅ Delete a device
export const deleteDevice = async (req, res) => {
  try {
    await deviceModel.deleteDevice(req.params.id);
    res.json({ success: true, message: "Device deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting device", error });
  }
};

export const getDevicesByAllocationStatus = async (req, res) => {
  try {
    const { allocated } = req.query;

    // Ensure allocated is either "0" or "1"
    if (allocated !== "0" && allocated !== "1") {
      return res.status(400).json({
        success: false,
        message: "Invalid allocated value. Use 0 or 1.",
      });
    }

    const allocationStatus = allocated === "1" ? 1 : 0; // Convert to integer

    const devices = await deviceModel.getDevicesByAllocationStatus(
      allocationStatus
    );
    res.status(200).json({ success: true, devices });
  } catch (error) {
    console.error("Error fetching devices by allocation status:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching device", error });
  }
};
