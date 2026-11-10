// Password hashing and policy. Node's built-in scrypt, no native add-ons.
//
// Kept free of app imports on purpose: scripts/admin-user.mjs loads this file
// directly, so the CLI and the site can never disagree on the hash format.
//
// Stored form: scrypt$N$r$p$<salt b64url>$<hash b64url>. The cost parameters
// travel with the hash, so they can be raised later and old hashes upgraded
// at the next successful login (see `needsRehash`).

import { randomBytes, randomInt, scrypt, timingSafeEqual } from "node:crypto";

// OWASP-listed scrypt setting: N=2^16, r=8, p=2 (about 64 MB per hash).
const COST = { N: 65536, r: 8, p: 2 };
const KEY_BYTES = 32;
const SALT_BYTES = 16;
const MAX_MEM = 160 * 1024 * 1024;

export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 128;

function derive(password: string, salt: Buffer, cost: { N: number; r: number; p: number }, bytes: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // NFKC so the same typed password hashes the same on every keyboard/OS.
    scrypt(password.normalize("NFKC"), salt, bytes, { ...cost, maxmem: MAX_MEM }, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await derive(password, salt, COST, KEY_BYTES);
  return ["scrypt", COST.N, COST.r, COST.p, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<{ ok: boolean; needsRehash: boolean }> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return { ok: false, needsRehash: false };
  const cost = { N: Number(parts[1]), r: Number(parts[2]), p: Number(parts[3]) };
  if (![cost.N, cost.r, cost.p].every((n) => Number.isInteger(n) && n > 0)) return { ok: false, needsRehash: false };
  const salt = Buffer.from(parts[4], "base64url");
  const expected = Buffer.from(parts[5], "base64url");
  let actual: Buffer;
  try {
    actual = await derive(password, salt, cost, expected.length);
  } catch {
    return { ok: false, needsRehash: false };
  }
  const ok = actual.length === expected.length && timingSafeEqual(actual, expected);
  const needsRehash = ok && (cost.N !== COST.N || cost.r !== COST.r || cost.p !== COST.p || expected.length !== KEY_BYTES);
  return { ok, needsRehash };
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
