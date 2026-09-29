import express from "express";
import { getPubs, getPubsNeedsRestock, createPub, updatePub } from "../controllers/pubsController.js";

const router = express.Router();

router.get("/", getPubs);
router.get("/needs-restock", getPubsNeedsRestock);
router.post("/", createPub);
router.put("/:id", updatePub);

export default router;
