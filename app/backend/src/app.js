import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import beersRoutes from "./routes/beers.js";
import brandsRoutes from "./routes/brands.js";
import reviewsRoutes from "./routes/reviews.js";
import ordersRoutes from "./routes/orders.js";
import pubsRoutes from "./routes/pubs.js";
import adminRoutes from "./routes/admin.js";
import { resetDatabase } from "./resetDb.js";
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

// Live demo only: restores the sample data. Called once a day by Vercel Cron,
// which sends "Authorization: Bearer <CRON_SECRET>". Disabled when CRON_SECRET is not set.
app.get("/api/cron/reset-demo", async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    await resetDatabase();
    res.json({ ok: true, message: "Demo database reset" });
  } catch (err) {
    console.error("Demo reset failed:", err);
    res.status(500).json({ error: "Reset failed" });
  }
});

// Serve uploaded beer images from /images/beers (local / Docker only)
app.use(
  "/images/beers",
  express.static(path.join(process.cwd(), "public", "images", "beers"))
);

// On Vercel the app runs as a serverless function, so it is exported instead of listening on a port.
// Locally a fixed port is used (5001) to avoid collisions with other PORT variables.
if (!process.env.VERCEL) {
  const PORT = 5001;
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

export default app;
