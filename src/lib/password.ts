// Password hashing and policy. Argon2id via Node's built-in crypto.argon2
// (Node 24.7+), so no native add-ons.
//
// Kept free of app imports on purpose: scripts/admin-user.mjs loads this file
// directly, so the CLI and the site can never disagree on the hash format.
//
// Stored form is the standard PHC string:
//   $argon2id$v=19$m=<KiB>,t=<passes>,p=<lanes>$<salt b64>$<hash b64>
// The cost travels with the hash, so it can be raised later and old hashes
// upgraded at the next successful login (see `needsRehash`). Hashes from the
// earlier scrypt format (scrypt$N$r$p$salt$hash) still verify and are always
// flagged for rehash, so they turn into Argon2id as people sign in.

import { argon2, randomBytes, randomInt, scrypt, timingSafeEqual } from "node:crypto";

// RFC 9106 second recommended setting: 64 MiB, 3 passes, 4 lanes.
const COST = { m: 65536, t: 3, p: 4 };
const KEY_BYTES = 32;
const SALT_BYTES = 16;
// Refuse stored hashes asking for absurd work (a tampered row shouldn't stall the server).
const MAX_MEMORY_KIB = 1024 * 1024;
const MAX_PASSES = 20;
const MAX_LANES = 16;

export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 128;

// NFKC so the same typed password hashes the same on every keyboard/OS.
const normalize = (password: string) => password.normalize("NFKC");

// PHC strings use standard base64 without padding.
const b64 = (buf: Buffer) => buf.toString("base64").replace(/=+$/, "");

function deriveArgon2(password: string, salt: Buffer, cost: { m: number; t: number; p: number }, bytes: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    argon2(
      "argon2id",
      { message: normalize(password), nonce: salt, memory: cost.m, passes: cost.t, parallelism: cost.p, tagLength: bytes },
      (err, key) => (err ? reject(err) : resolve(key)),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await deriveArgon2(password, salt, COST, KEY_BYTES);
  return `$argon2id$v=19$m=${COST.m},t=${COST.t},p=${COST.p}$${b64(salt)}$${b64(key)}`;
}

const ARGON2_RE = /^\$argon2id\$v=19\$m=(\d+),t=(\d+),p=(\d+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/;

async function verifyArgon2(password: string, stored: string): Promise<{ ok: boolean; needsRehash: boolean }> {
  const match = ARGON2_RE.exec(stored);
  if (!match) return { ok: false, needsRehash: false };
  const cost = { m: Number(match[1]), t: Number(match[2]), p: Number(match[3]) };
  if (cost.m > MAX_MEMORY_KIB || cost.t < 1 || cost.t > MAX_PASSES || cost.p < 1 || cost.p > MAX_LANES) return { ok: false, needsRehash: false };
  const salt = Buffer.from(match[4], "base64");
  const expected = Buffer.from(match[5], "base64");
  let actual: Buffer;
  try {
    actual = await deriveArgon2(password, salt, cost, expected.length);
  } catch {
    return { ok: false, needsRehash: false };
  }
  const ok = actual.length === expected.length && timingSafeEqual(actual, expected);
  const needsRehash = ok && (cost.m !== COST.m || cost.t !== COST.t || cost.p !== COST.p || expected.length !== KEY_BYTES);
  return { ok, needsRehash };
}

// Legacy scrypt hashes (before the switch to Argon2id). Verify only.
function verifyScrypt(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return Promise.resolve(false);
  const [N, r, p] = [Number(parts[1]), Number(parts[2]), Number(parts[3])];
  if (![N, r, p].every((n) => Number.isInteger(n) && n > 0) || N > 2 ** 17 || r > 16 || p > 4) return Promise.resolve(false);
  const salt = Buffer.from(parts[4], "base64url");
  const expected = Buffer.from(parts[5], "base64url");
  return new Promise((resolve) => {
    scrypt(normalize(password), salt, expected.length, { N, r, p, maxmem: 256 * 1024 * 1024 }, (err, key) =>
      resolve(!err && key.length === expected.length && timingSafeEqual(key, expected)),
    );
  });
}

export async function verifyPassword(password: string, stored: string): Promise<{ ok: boolean; needsRehash: boolean }> {
  if (stored.startsWith("$argon2id$")) return verifyArgon2(password, stored);
  if (stored.startsWith("scrypt$")) {
    const ok = await verifyScrypt(password, stored);
    return { ok, needsRehash: ok };
  }
  return { ok: false, needsRehash: false };
}

// A throwaway hash to verify against when the email is unknown, so "no such
// account" costs the same time as "wrong password".
let decoy: Promise<string> | undefined;
export function decoyHash(): Promise<string> {
  decoy ??= hashPassword(randomBytes(24).toString("base64url"));
  return decoy;
}

/** One-time password handed to a new or reset account: 20 random characters (~99 bits). */
export function generateTempPassword(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789"; // no l/1, o/0, i
  const groups: string[] = [];
  for (let g = 0; g < 4; g += 1) {
    let part = "";
    for (let i = 0; i < 5; i += 1) part += alphabet[randomInt(alphabet.length)];
    groups.push(part);
  }
  return groups.join("-");
}

export type PasswordProblem = "length" | "email" | "weak";

/** What is wrong with a new password, or null when it is acceptable. */
export function passwordProblem(password: string, email: string): PasswordProblem | null {
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) return "length";
  const lower = password.toLowerCase();
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  if (lower.includes(email.toLowerCase()) || (local.length >= 4 && lower.includes(local))) return "email";
  if (new Set(password).size < 5) return "weak";
  if (/^(?:password|passw0rd|qwerty|letmein|welcome|admin|easytive|123456)+[\d!@#$%^&*._-]*$/i.test(password)) return "weak";
  return null;
}

/** Trimmed, lower-cased email, or null when it isn't a plausible address. */
export function normalizeEmail(input: string): string | null {
  const email = input.trim().toLowerCase();
  if (email.length < 3 || email.length > 254) return null;
  if (!/^[^\s@<>"'`\\]+@[^\s@<>"'`\\]+\.[^\s@<>"'`\\]{2,}$/.test(email)) return null;
  return email;
}
