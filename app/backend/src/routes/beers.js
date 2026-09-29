import express from "express";
import { getBeers, getBeerById } from "../controllers/beersController.js";

const router = express.Router();

router.get("/", getBeers);
router.get("/:id", getBeerById);

export default router;
