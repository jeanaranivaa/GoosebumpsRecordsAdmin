import express from "express";
import reviewsController from "../controllers/reviewsController.js";

const router = express.Router();

router.get("/vinyl/:vinylId", reviewsController.getReviewsByVinyl);
router.post("/", reviewsController.upsertReview);

export default router;
