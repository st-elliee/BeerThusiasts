// Creates (or re-creates) the beerthusiasts database with the sample data.
// Usage: node reset_db.js   (reads the connection settings from .env)
import { resetDatabase } from "./src/resetDb.js";

try {
  await resetDatabase();
  console.log("✅ Database reset successfully with schema and sample data!");
  process.exit(0);
} catch (err) {
  console.error("❌ Error resetting database:", err.message);
  process.exit(1);
}
