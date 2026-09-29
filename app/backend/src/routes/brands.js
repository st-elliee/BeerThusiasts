import express from "express";
import { getBrands } from "../controllers/brandsController.js";

const router = express.Router();

router.get("/", getBrands);

export default router;
