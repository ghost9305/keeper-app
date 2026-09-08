DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  google_id  VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  email      VARCHAR(255) UNIQUE NOT NULL,
  name       VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title   VARCHAR(255) NOT NULL,
  content TEXT NOT NULL
);

CREATE INDEX idx_notes_user_id ON notes (user_id);

ALTER TABLE users
  ADD CONSTRAINT chk_auth_method
  CHECK (google_id IS NOT NULL OR password_hash IS NOT NULL);


-- adding test-user on the table
INSERT INTO users (google_id, email, name)
VALUES ('dev-test-id', 'dev@test', 'test-user');

-- adding test-note linking to test-user
INSERT INTO notes (user_id, title, content)
VALUES (
    (SELECT id FROM users WHERE email = 'dev@test'),
    'Test Note',
    'This is test content for local dev.'
);