import express from "express";
import multer from "multer";
import path from "path";
import { createBeer, updateBeer, upsertPubHasBeer, getAllInventory, updateInventory, getEnums, getEmployees, createEmployee, updateEmployee, deleteEmployee, uploadBeerImage, getSuppliersForBrand, placeSupplierOrder, getSupplierOrders, updateSupplierOrderStatus } from "../controllers/adminController.js";

const router = express.Router();

// multer storage that names files as <beerId>.<ext> into backend/public/images/beers
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(process.cwd(), 'public', 'images', 'beers'));
	},
	filename: (req, file, cb) => {
		const beerId = req.params.id || req.body.beer_id || 'unknown';
		const ext = path.extname(file.originalname) || '.jpg';
		cb(null, `${beerId}${ext}`);
	}
});
const upload = multer({ storage });

router.post("/beers", createBeer);
router.put("/beers/:id", updateBeer);
router.post("/beers/:id/image", upload.single('image'), uploadBeerImage);
router.post("/pubhasbeer", upsertPubHasBeer);
router.get("/inventory", getAllInventory);
router.put("/inventory/:pub_id/:beer_id", updateInventory);
router.get("/enums", getEnums);

// Employee routes
router.get("/employees", getEmployees);
router.post("/employees", createEmployee);
router.put("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);

// Supplier ordering routes
router.get("/suppliers/brand/:brandId", getSuppliersForBrand);
router.post("/supplier-orders", placeSupplierOrder);
router.get("/supplier-orders", getSupplierOrders);
router.put("/supplier-orders/:id", updateSupplierOrderStatus);

export default router;
