import express from "express";
import { getReviewsByBeer, postReview } from "../controllers/reviewsController.js";

const router = express.Router();

router.get("/:beerId", getReviewsByBeer);
router.post("/:beerId", postReview);

export default router;
