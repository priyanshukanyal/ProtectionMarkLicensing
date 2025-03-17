import groupModel from "../models/groupModel.js";

export const getAllGroups = async (req, res) => {
  try {
    const groups = await groupModel.getAllGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const group = await groupModel.getGroupById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: "Error fetching group", error });
  }
};

export const createGroup = async (req, res) => {
  try {
    const newGroup = await groupModel.createGroup(req.body);
    res.json(newGroup);
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
};

export const updateGroup = async (req, res) => {
  try {
    await groupModel.updateGroup(req.params.id, req.body);
    res.json({ message: "Group updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating group", error });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    await groupModel.deleteGroup(req.params.id);
    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting group", error });
  }
};
