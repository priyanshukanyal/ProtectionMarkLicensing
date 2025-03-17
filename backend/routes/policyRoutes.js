import express from "express";
import {
  getAllPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  attachGroupToPolicy,
  removeGroupFromPolicy,
} from "../controllers/policyController.js";

const router = express.Router();

router.get("/", getAllPolicies);
router.get("/:id", getPolicyById);
router.post("/", createPolicy);
router.put("/:id", updatePolicy);
router.delete("/:id", deletePolicy);

// ✅ New Routes for Group-Policy Management
router.post("/attach-group", attachGroupToPolicy);
router.post("/remove-group", removeGroupFromPolicy);

export default router;
