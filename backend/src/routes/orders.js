import express from "express";
import ordersController from "../controllers/ordersController.js";

const router = express.Router();

router
  .route("/")
  .get(ordersController.getOrders)
  .post(ordersController.insertOrder);

router
  .route("/:id")
  .get(ordersController.getOrderById)
  .put(ordersController.updateOrder)
  .delete(ordersController.deleteOrder);

export default router;