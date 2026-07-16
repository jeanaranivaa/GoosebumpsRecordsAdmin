import express from "express";
import ordersController from "../controllers/ordersController.js";

const router = express.Router();

router
  .route("/")
  .get(ordersController.getOrders)
  .post(ordersController.insertOrder);

// Deben ir antes de "/:id" para que no se interpreten como un ID
router.route("/stats").get(ordersController.getStats);
router.route("/user/:userId").get(ordersController.getOrdersByUser);

router
  .route("/:id")
  .get(ordersController.getOrderById)
  .put(ordersController.updateOrder)
  .delete(ordersController.deleteOrder);

export default router;