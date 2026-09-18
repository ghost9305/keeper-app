import "dotenv/config";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { pool } from "./db.js";
import { verifyPassword } from "./bcrypt.js";

const USER_COLUMNS = "id, google_id, email, name";

export function normalizeEmail(email) {
  return String(email ?? "")
    .trim()
    .toLowerCase();
}

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
      try {
        const result = await pool.query(
          `SELECT ${USER_COLUMNS}, password_hash FROM users WHERE email = $1`,
          [normalizeEmail(email)],
        );
        const user = result.rows[0];
        const ok = await verifyPassword(password, user?.password_hash);
        if (!user || !ok) {
          return done(null, false, { message: "incorrect email or password" });
        }
        // destructuring, so that password_hash is not passed on in req.user as JSON
        // this is essentially a denylist
        const { password_hash, ...safeUser } = user;
        return done(null, safeUser);

        // allowlist is safer in case there are additional sensitive column later:
        // return done(null, {
        //   id: user.id,
        //   google_id: user.google_id,
        //   email: user.email,
        //   name: user.name,
        // });
      } catch (err) {
        return done(err);
      }
    },
  ),
);

// store the logged-in user into a session object (req.session.passport)
// then express-session take that object and store into the "session" table
// express-session sets a connect.sid cookie holding that signed sid
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// every request, the browser sends the cookie (connect.sid)
// express-session verifies the signature and run SELECT sess FROM session WHERE sid = $1
// req.session is populated from that sess JSON, so req.session.passport.user === 1
// then passport.session() middleware spots that value and call deserializeUser(1,done)
// the callback run a query from the users table and the result is assigned as req.user
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
