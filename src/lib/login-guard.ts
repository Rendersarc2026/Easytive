// Sign-in protection, on top of the plain attempt limits in rate-limit.ts.
//
//   Account lockout  5 failed sign-ins on one account within 15 minutes lock
//                    it for 15 minutes. While locked, even the right password
//                    is refused. A successful sign-in clears the count.
//   Address blocks   an address that looks like an attack is blocked from the
//                    whole admin (sign-in and existing sessions):
//                      - 10+ failed sign-ins in 15 minutes, or
//                      - failures against 4+ different accounts in 15 minutes
//                        (password spraying / credential stuffing), or
//                      - going over the per-address attempt limit.
//                    A block lasts 1 hour, doubling on each repeat (capped at
//                    24 hours); the count resets after 30 quiet days.
//
// Accounts are keyed by a hash of the typed email, so an email with no
// account behaves exactly like a real one. To lift a lock or block early,
// run `npm run admin:unblock` (scripts/unblock.mjs).

import { createHash } from "node:crypto";
import { db } from "./db";

export const LOCK_AFTER_FAILURES = 5;
export const LOCK_MINUTES = 15;
const WINDOW_MINUTES = 15;
const BLOCK_AFTER_FAILURES = 10;
const BLOCK_AFTER_ACCOUNTS = 4;
const BLOCK_BASE_HOURS = 1;
const BLOCK_MAX_HOURS = 24;

export const emailHash = (email: string) => createHash("sha256").update(email.trim().toLowerCase()).digest("hex");

/** Addresses we can't identify ("unknown", e.g. local dev with no proxy) are never blocked. */
const blockable = (ip: string) => ip !== "unknown" && ip !== "";

/** Minutes left on a lock for this account, or 0. */
export async function accountLockMinutes(hash: string): Promise<number> {
  const [row] = await db()<{ mins: number }[]>`
    select ceil(extract(epoch from (locked_until - now())) / 60)::int as mins
    from easytive.account_locks
    where email_hash = ${hash} and locked_until > now()
  `;
  return row?.mins ?? 0;
}

/** True while this address is blocked. */
export async function isIpBlocked(ip: string): Promise<boolean> {
  if (!blockable(ip)) return false;
  const [row] = await db()`select 1 from easytive.ip_blocks where ip = ${ip} and blocked_until > now()`;
  return Boolean(row);
}

/** Blocks an address (or extends its block, doubling the length each time). */
export async function blockIp(ip: string, reason: string): Promise<void> {
  if (!blockable(ip)) return;
  await db()`
    insert into easytive.ip_blocks as b (ip, blocked_until, reason)
    values (${ip}, now() + make_interval(hours => ${BLOCK_BASE_HOURS}), ${reason})
    on conflict (ip) do update set
      strikes = case when b.updated_at < now() - interval '30 days' then 1 else b.strikes + 1 end,
      blocked_until = now() + least(
        make_interval(hours => ${BLOCK_MAX_HOURS}),
        make_interval(hours => ${BLOCK_BASE_HOURS}) * power(2, case when b.updated_at < now() - interval '30 days' then 0 else b.strikes end)
      ),
      reason = excluded.reason,
      updated_at = now()
  `;
}

export type FailureOutcome = { locked: boolean; blocked: boolean };

/**
 * Records a failed sign-in and applies the rules above. Returns whether the
 * account is now locked and whether the address is now blocked.
 */
export async function recordFailure(hash: string, ip: string): Promise<FailureOutcome> {
  const sql = db();
  // Counts include the failure being recorded (the CTE's insert isn't visible
  // to the same statement, so add it by hand).
  const [row] = await sql<{ account_failures: number; ip_failures: number; ip_accounts: number }[]>`
    with ins as (
      insert into easytive.login_failures (email_hash, ip) values (${hash}, ${ip})
    )
    select
      (select count(*) from easytive.login_failures
        where email_hash = ${hash} and at > now() - make_interval(mins => ${WINDOW_MINUTES}))::int + 1 as account_failures,
      (select count(*) from easytive.login_failures
        where ip = ${ip} and at > now() - make_interval(mins => ${WINDOW_MINUTES}))::int + 1 as ip_failures,
      (select count(distinct email_hash) from (
        select email_hash from easytive.login_failures
        where ip = ${ip} and at > now() - make_interval(mins => ${WINDOW_MINUTES})
        union select ${hash}::text
      ) e)::int as ip_accounts
  `;

  const locked = row.account_failures >= LOCK_AFTER_FAILURES;
  const reason =
    row.ip_failures >= BLOCK_AFTER_FAILURES
      ? `${row.ip_failures} failed sign-ins in ${WINDOW_MINUTES} minutes`
      : row.ip_accounts >= BLOCK_AFTER_ACCOUNTS
        ? `failed sign-ins on ${row.ip_accounts} different accounts`
        : null;
  const blocked = reason !== null && blockable(ip);

  await Promise.all([
    locked
      ? sql`
          insert into easytive.account_locks (email_hash, locked_until)
          values (${hash}, now() + make_interval(mins => ${LOCK_MINUTES}))
          on conflict (email_hash) do update set locked_until = excluded.locked_until, locked_at = now()
        `
      : null,
    blocked ? blockIp(ip, reason) : null,
  ]);
  return { locked, blocked };
}

/** A successful sign-in: forget this account's failures and any lock. */
export async function clearFailures(hash: string): Promise<void> {
  const sql = db();
  await Promise.all([
    sql`delete from easytive.login_failures where email_hash = ${hash}`,
    sql`delete from easytive.account_locks where email_hash = ${hash}`,
  ]);
}

/** Housekeeping (daily cron): drop old failures, expired locks, long-quiet blocks. */
export async function pruneLoginGuard(): Promise<void> {
  const sql = db();
  await Promise.all([
    sql`delete from easytive.login_failures where at < now() - interval '1 day'`,
    sql`delete from easytive.account_locks where locked_until < now()`,
    sql`delete from easytive.ip_blocks where blocked_until < now() - interval '30 days'`,
  ]);
}
