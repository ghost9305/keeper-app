import "dotenv/config";
import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});
