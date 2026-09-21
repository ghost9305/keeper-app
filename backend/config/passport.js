import "dotenv/config";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { verifyPassword } from "./bcrypt.js";
import { pool } from "./db.js";

const USER_COLUMNS = "id, google_id, email, name";

export function normalizeEmail(email) {
  return String(email ?? "").trim.toLowerCase();
}

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const result = await pool.query(
          `SELECT ${USER_COLUMNS}, password_hash FROM users WHERE email = $1`,
          [normalizeEmail(email)],
        );
        const user = result.rows[0];
        const ok = await verifyPassword(password, user?.password_hash ?? null);

        if (!user || !ok) {
          return done(null, false, { error: "incorrect email or password" });
        }
        const { password_hash, ...safeUser } = user;
        return done(null, safeUser);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
      [id],
    );
    done(null, result.rows[0] ?? false);
  } catch (err) {
    done(err);
  }
});
