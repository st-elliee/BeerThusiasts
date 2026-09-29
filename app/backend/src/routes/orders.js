import express from "express";
import { postOrder, getOrders, updateOrderStatus, getOrderDetails } from "../controllers/ordersController.js";

const router = express.Router();

router.get("/", getOrders);
router.get("/:id/details", getOrderDetails);
router.post("/", postOrder);
router.patch("/:id/status", updateOrderStatus);

export default router;
