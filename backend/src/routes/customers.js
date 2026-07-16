import express from "express";
import customersController from "../controllers/customersController.js";

const router = express.Router();

router.post("/register", customersController.register);
router.post("/login", customersController.login);
router.post("/verify-account", customersController.verifyAccount);
router.post("/resend-verification", customersController.resendVerificationCode);

export default router;
