import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Connection settings shared by the API pool and the reset script.
// DB_CA_CERT is only needed for hosted databases that require SSL (e.g. Aiven):
// paste the provider's CA certificate (the whole -----BEGIN CERTIFICATE----- block).
export const connectionOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ...(process.env.DB_CA_CERT && {
    ssl: { ca: process.env.DB_CA_CERT.replace(/\\n/g, "\n") },
  }),
};

export const pool = mysql.createPool({
  ...connectionOptions,
  database: process.env.DB_NAME,
});
