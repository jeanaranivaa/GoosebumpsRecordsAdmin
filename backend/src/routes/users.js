import express from "express";
import usersController from "../controllers/usersController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      console.log("Error al subir imagen:", error);

      return res.status(400).json({
        message: "Error al subir imagen a Cloudinary",
        error: error.message || JSON.stringify(error),
      });
    }

    next();
  });
};

router
  .route("/")
  .get(usersController.getUsers)
  .post(uploadImage, usersController.insertUser);

router
  .route("/:id")
  .get(usersController.getUserById)
  .put(uploadImage, usersController.updateUser)
  .delete(usersController.deleteUser);

export default router;