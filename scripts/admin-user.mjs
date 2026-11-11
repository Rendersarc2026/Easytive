// Create the first admin, or rescue an account from the command line.
//
//   npm run admin:user -- someone@example.com
//
// If the email is new, an account is created. If it already exists, its
// password is reset, it is reactivated, signed out everywhere, and any sign-in
// lockout is cleared. Either way a temporary password is printed once; the
// person must choose their own at first sign-in (within 72 hours).
//
// This is the way back in when no admin can sign in. It needs the database
// URL from .env, so only someone with server access can run it.

import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";
// Same hashing code the site uses (Node runs the .ts file directly).
import { generateTempPassword, hashPassword, normalizeEmail } from "../src/lib/password.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(path.join(root, file));
  } catch {
    // file absent: fine, the variables may already be in the environment
  }
}

const email = normalizeEmail(process.argv[2] ?? "");
if (!email) {
  console.error("Usage: npm run admin:user -- someone@example.com");
  process.exit(1);
}
const url = process.env.DATABASE_URL_SESSION ?? process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL_SESSION (or DATABASE_URL) is not set. Add it to .env.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, prepare: false, ssl: "require", onnotice: () => {} });

try {
  const tempPassword = generateTempPassword();
  const hash = await hashPassword(tempPassword);

  const [row] = await sql`
    insert into easytive.admin_users as u (email, password_hash, must_change_password, temp_password_expires_at)
    values (${email}, ${hash}, true, now() + interval '72 hours')
    on conflict (email) do update set
      password_hash = excluded.password_hash,
      must_change_password = true,
      temp_password_expires_at = excluded.temp_password_expires_at,
      password_changed_at = now(),
      is_active = true
    returning id, (xmax = 0) as created
  `;
  await sql`update easytive.admin_sessions set is_active = false where user_id = ${row.id} and is_active`;
  // Clear any failed-sign-in lockout (src/lib/login-guard.ts keys it by the email's hash).
  const emailHash = createHash("sha256").update(email).digest("hex");
  await sql`update easytive.account_locks set is_active = false where email_hash = ${emailHash} and is_active`;
  await sql`update easytive.login_failures set is_active = false where email_hash = ${emailHash} and is_active`;
  await sql`
    insert into easytive.admin_audit_log (actor_id, action, detail, ip)
    values (null, ${row.created ? "user.create" : "user.reset_password"}, ${sql.json({ target: email, via: "cli" })}, 'cli')
  `;

  console.log(row.created ? `Created account: ${email}` : `Reset password for ${email}`);
  console.log("");
  console.log(`  Temporary password:  ${tempPassword}`);
  console.log("");
  console.log("It is shown only this once and works for 72 hours.");
  console.log("Sign in at /admin/login; you'll be asked to choose your own password.");
} catch (err) {
  console.error("Failed:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
