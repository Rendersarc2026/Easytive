// Lift a sign-in block early (see src/lib/login-guard.ts).
//
//   npm run admin:unblock                      list blocked addresses and locked accounts
//   npm run admin:unblock -- 203.0.113.7       unblock an address
//   npm run admin:unblock -- someone@x.com     unlock an account
//
// Blocks and locks also end on their own (locks after 15 minutes, blocks after
// 1 to 24 hours). Unblocking keeps the address's strike count, so if it
// misbehaves again the next block is longer.

import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(path.join(root, file));
  } catch {
    // file absent: fine, the variables may already be in the environment
  }
}
const url = process.env.DATABASE_URL_SESSION ?? process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL_SESSION (or DATABASE_URL) is not set. Add it to .env.");
  process.exit(1);
}

const sql = postgres(url, { max: 1, prepare: false, ssl: "require", onnotice: () => {} });
const target = (process.argv[2] ?? "").trim().toLowerCase();
const audit = (action, detail) =>
  sql`insert into easytive.admin_audit_log (actor_id, action, detail, ip) values (null, ${action}, ${sql.json({ ...detail, via: "cli" })}, 'cli')`;

try {
  if (!target) {
    const blocks = await sql`
      select ip, reason, strikes, blocked_until from easytive.ip_blocks where blocked_until > now() order by blocked_until desc
    `;
    const locks = await sql`
      select l.locked_until, u.email
      from easytive.account_locks l
      left join easytive.admin_users u on encode(sha256(convert_to(u.email, 'UTF8')), 'hex') = l.email_hash
      where l.locked_until > now()
    `;
    console.log(blocks.length ? "Blocked addresses:" : "No blocked addresses.");
    for (const b of blocks) console.log(`  ${b.ip}  until ${b.blocked_until.toISOString()}  (${b.reason}; strike ${b.strikes})`);
    console.log(locks.length ? "Locked accounts:" : "No locked accounts.");
    for (const l of locks) console.log(`  ${l.email ?? "(an email with no account)"}  until ${l.locked_until.toISOString()}`);
  } else if (target.includes("@")) {
    const hash = createHash("sha256").update(target).digest("hex");
    const [lock] = await sql`delete from easytive.account_locks where email_hash = ${hash} returning 1`;
    await sql`delete from easytive.login_failures where email_hash = ${hash}`;
    await audit("account.unlock", { target });
    console.log(lock ? `Unlocked ${target}.` : `${target} wasn't locked; its failed sign-ins are cleared.`);
  } else {
    const [block] = await sql`
      update easytive.ip_blocks set blocked_until = now(), updated_at = now()
      where ip = ${target} and blocked_until > now() returning ip
    `;
    await sql`delete from easytive.login_failures where ip = ${target}`;
    await audit("ip.unblock", { target });
    console.log(block ? `Unblocked ${target}.` : `${target} wasn't blocked; its failed sign-ins are cleared.`);
  }
} catch (err) {
  console.error("Failed:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
