import deviceModel from "../models/deviceModel.js";

export const getAllDevices = async (req, res) => {
  try {
    const devices = await deviceModel.getAllDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching devices", error });
  }
};

export const getDeviceById = async (req, res) => {
  try {
    const device = await deviceModel.getDeviceById(req.params.id);
    if (!device) return res.status(404).json({ message: "Device not found" });
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: "Error fetching device", error });
  }
};

export const createDevice = async (req, res) => {
  try {
    const newDevice = await deviceModel.createDevice(req.body);
    res.json(newDevice);
  } catch (error) {
    res.status(500).json({ message: "Error creating device", error });
  }
};

export const updateDevice = async (req, res) => {
  try {
    await deviceModel.updateDevice(req.params.id, req.body);
    res.json({ message: "Device updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating device", error });
  }
};

export const deleteDevice = async (req, res) => {
  try {
    await deviceModel.deleteDevice(req.params.id);
    res.json({ message: "Device deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting device", error });
  }
};
