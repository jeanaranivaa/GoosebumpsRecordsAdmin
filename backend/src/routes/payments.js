import express from "express";
import paymentsController from "../controllers/paymentsController.js";

const router = express.Router();

router
  .route("/")
  .get(paymentsController.getPayments)
  .post(paymentsController.insertPayment);

router
  .route("/:id")
  .get(paymentsController.getPaymentById)
  .put(paymentsController.updatePayment)
  .delete(paymentsController.deletePayment);

export default router;