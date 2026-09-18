import express from "express";
import passport from "passport";
import { pool } from "../config/db.js";
import { hashPassword, validatePassword } from "../config/bcrypt.js";
import { normalizeEmail } from "../config/passport.js";

const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/register", async (req, res, next) => {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;
  const rawName = req.body?.name;
  const name =
    typeof rawName === "string" ? rawName.trim().slice(0, 255) || null : null;

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: "a valid email is required!" });
  }

  if (email.length > 255) {
    return res.status(400).json({ error: "email is too long!" });
  }
  if (!name) {
    return res.status(400).json({ error: "name is required!" });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  try {
    const passwordHash = await hashPassword(password);

    const result = await pool.query(
      "INSERT INTO users (email, name, password_hash) VALUES ($1,$2,$3) RETURNING id, google_id, email, name",
      [email, name, passwordHash],
    );
    const user = result.rows[0];
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "email already registered" });
    }
    next(err);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message ?? "incorrect email or password" });
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.json(req.user);
    });
  })(req, res, next);
});

router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "not authenticated!" });
  }
  res.json(req.user);
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.status(204).send();
    });
  });
});

export default router;
