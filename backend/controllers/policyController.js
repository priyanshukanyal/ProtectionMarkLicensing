import policyModel from "../models/policyModel.js";

export const getAllPolicies = async (req, res) => {
  const policies = await policyModel.getAllPolicies();
  res.json(policies);
};

export const getPolicyById = async (req, res) => {
  const policy = await policyModel.getPolicyById(req.params.id);
  res.json(policy);
};

export const createPolicy = async (req, res) => {
  const newPolicy = await policyModel.createPolicy(req.body);
  res.json(newPolicy);
};

export const updatePolicy = async (req, res) => {
  await policyModel.updatePolicy(req.params.id, req.body);
  res.json({ message: "Policy updated successfully" });
};

export const deletePolicy = async (req, res) => {
  await policyModel.deletePolicy(req.params.id);
  res.json({ message: "Policy deleted successfully" });
};

// ✅ Attach a group to a policy
export const attachGroupToPolicy = async (req, res) => {
  const { groupId, policyId } = req.body;

  if (!groupId || !policyId) {
    return res
      .status(400)
      .json({ message: "GroupID and PolicyID are required" });
  }

  await policyModel.attachGroupToPolicy(groupId, policyId);
  res.json({ message: "Group attached to policy successfully" });
};

// ✅ Remove a group from a policy
export const removeGroupFromPolicy = async (req, res) => {
  const { groupId, policyId } = req.body;

  if (!groupId || !policyId) {
    return res
      .status(400)
      .json({ message: "GroupID and PolicyID are required" });
  }

  await policyModel.removeGroupFromPolicy(groupId, policyId);
  res.json({ message: "Group removed from policy successfully" });
};
