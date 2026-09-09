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
    "SELECT id, title, content FROM notes WHERE user_id = $1 ORDER BY id ASC",
    [test_user_id],
  );
  res.status(200).json(result.rows);
});

app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "must have title and content!" });
  }
  const result = await pool.query(
    "INSERT INTO notes (user_id, title, content) VALUES ($1,$2,$3) RETURNING id, title, content",
    [test_user_id, title, content],
  );
  res.status(201).json(result.rows[0]);
});

app.listen(Number(process.env.PORT), () => {
  console.log(`Server is running on port ${Number(process.env.PORT)}`);
});
