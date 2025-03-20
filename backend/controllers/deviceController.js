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
