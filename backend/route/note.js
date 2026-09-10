import express from "express";
import { pool } from "../config/db.js";

const router = express.Router();

const test_user_id = 1;

router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT id, title, content FROM notes WHERE user_id = $1 ORDER BY id ASC",
    [test_user_id],
  );
  res.status(200).json(result.rows);
});

router.post("/", async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id",
    [id, test_user_id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "note not found!" });
  }
  res.status(204).send();
});

export default router;
