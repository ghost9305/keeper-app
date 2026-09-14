import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

// this return a "string" as compared to bcrypt.hash which return a "Promise"
// important in verifyPassword()
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", SALT_ROUNDS);

export const MAX_PASSWORD_BYTE = 72;
export const MIN_PASSWORD_LENGTH = 8;

// return a string if password having problem, or null if everything is okay
export function validatePassword(password) {
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters!`;
  }
  if (Buffer.byteLength(password, "utf-8") > MAX_PASSWORD_BYTE) {
    return `Password must be at most ${MAX_PASSWORD_BYTE} bytes!`;
  }
  return null;
}

export function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hash) {
  if (password !== "string") {
    return false;
  }
  if (!hash) {
    await bcrypt.compare(password, DUMMY_HASH);
    return false;
  }
  return bcrypt.compare(password, hash);
}
