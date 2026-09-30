import fs from "fs";
import mysql from "mysql2/promise";
import { connectionOptions } from "./db.js";

// Rebuilds the database from scratch: schema + views, then the sample data.
// Used by `node reset_db.js` locally and by the daily cron job of the live demo.
const SQL_FILES = [
  new URL("../db-init/01-schema.sql", import.meta.url),
  new URL("../db-init/02-seed-data.sql", import.meta.url),
];

export async function resetDatabase() {
  const connection = await mysql.createConnection({
    ...connectionOptions,
    // Each file is sent as a single batch: one round trip instead of hundreds
    multipleStatements: true,
  });

  try {
    for (const file of SQL_FILES) {
      await connection.query(fs.readFileSync(file, "utf-8"));
    }
  } finally {
    await connection.end();
  }
}
