import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./config/db.js";

const app = express();

app.use(cors());
app.use(express.json());

const test_user_id = 1;

app.get("/notes", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE user_id = $1 ORDER BY id ASC",
    [test_user_id],
  );
  res.status(200).json(result.rows);
});

app.listen(Number(process.env.PORT), () => {
  console.log(`Server is running on port ${Number(process.env.PORT)}`);
});
