import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import beersRoutes from "./routes/beers.js";
import brandsRoutes from "./routes/brands.js";
import reviewsRoutes from "./routes/reviews.js";
import ordersRoutes from "./routes/orders.js";
import pubsRoutes from "./routes/pubs.js";
import adminRoutes from "./routes/admin.js";
import path from "path";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/beers", beersRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/pubs", pubsRoutes);
app.use("/api/admin", adminRoutes);

// Serve uploaded beer images from /images/beers
app.use(
  "/images/beers",
  express.static(path.join(process.cwd(), "public", "images", "beers"))
);

// Use a single fixed development port to avoid accidental collisions with system env vars.
// This is intentionally hardcoded for development; change if necessary.
const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

