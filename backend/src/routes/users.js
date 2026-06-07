import express from "express";
import usersController from "../controllers/usersController.js";

const router = express.Router();

router
  .route("/")
  .get(usersController.getUsers)
  .post(usersController.insertUser);

router
  .route("/:id")
  .get(usersController.getUserById)
  .put(usersController.updateUser)
  .delete(usersController.deleteUser);

export default router;