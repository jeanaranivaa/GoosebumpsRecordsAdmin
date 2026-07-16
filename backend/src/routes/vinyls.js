import express from "express";
import vinylsController from "../controllers/vinylsController.js";
import uploadVinyl from "../utils/cloudinaryVinylsConfig.js";

const router = express.Router();

router
  .route("/")
  .get(vinylsController.getVinyls)
  .post(uploadVinyl.single("cover"), vinylsController.insertVinyl);

// Debe ir antes de "/:id" para que no se interprete como un ID
router.route("/popular").get(vinylsController.getPopularVinyls);

router
  .route("/:id")
  .get(vinylsController.getVinylById)
  .put(uploadVinyl.single("cover"), vinylsController.updateVinyl)
  .delete(vinylsController.deleteVinyl);

export default router;