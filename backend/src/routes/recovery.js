import { Router } from "express";
import {
  sendRecoveryCode,
  verifyRecoveryCode,
  changePassword,
} from "../controllers/RecoveryController.js";

const router = Router();

router.post("/send-code", sendRecoveryCode);
router.post("/verify-code", verifyRecoveryCode);
router.put("/change-password", changePassword);

export default router;