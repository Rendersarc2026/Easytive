// Admin sessions: who is signed in, and the helpers that create and end
// sessions. The cookie holds a random token; the database holds its SHA-256
// and everything else (owner, expiry), so a session can be revoked at any time
// and a stolen database row can't be replayed as a cookie.
//
// Every admin page and every server action re-checks the session here. The
// proxy (src/proxy.ts) is only an early bounce for requests with no cookie.

import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { clientIp } from "./rate-limit";
import { ADMIN_COOKIE, SESSION_IDLE_SECONDS, SESSION_MAX_SECONDS, looksLikeSessionToken } from "./session";

/** The narrow view of an account that pages and actions get. Never the hash. */
export type AdminUser = { id: string; email: string; mustChangePassword: boolean };

const sha256 = (value: string) => createHash("sha256").update(value).digest();

/**
 * The signed-in account, or null. Looked up in the database on every request
 * (deduplicated within one render), so disabling an account, signing out
 * elsewhere or blocking the visitor's address takes effect immediately.
 */
export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!looksLikeSessionToken(token)) return null;

  const sql = db();
  const tokenHash = sha256(token);
  const ip = await clientIp();
  const [row] = await sql<{ id: string; email: string; must_change_password: boolean; stale: boolean }[]>`
    select u.id, u.email, u.must_change_password,
           s.last_seen_at < now() - interval '5 minutes' as stale
    from easytive.admin_sessions s
    join easytive.admin_users u on u.id = s.user_id
    where s.token_hash = ${tokenHash}
      and s.is_active
      and s.expires_at > now()
      and s.last_seen_at > now() - make_interval(secs => ${SESSION_IDLE_SECONDS})
      and u.is_active
      -- A blocked address (lib/login-guard.ts) is shut out of existing sessions too.
      and not exists (select 1 from easytive.ip_blocks b where b.ip = ${ip} and b.is_active and b.blocked_until > now())
  `;
  if (!row) return null;

  // Slide the idle window, at most one write per five minutes per session.
  if (row.stale) {
    await sql`update easytive.admin_sessions set last_seen_at = now() where token_hash = ${tokenHash}`;
  }
  return { id: row.id, email: row.email, mustChangePassword: row.must_change_password };
});

/**
 * Gate for admin pages and actions: returns the account or bounces to the
 * login page. An account still on a temporary password can go nowhere except
 * the set-password screen.
 */
export async function requireUser(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.mustChangePassword) redirect("/admin/set-password");
  return user;
}

/** Start a session for `userId` and set the cookie. Call only from an action. */
export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const userAgent = ((await headers()).get("user-agent") ?? "").slice(0, 255);
  await db()`
    insert into easytive.admin_sessions (token_hash, user_id, expires_at, ip, user_agent)
    values (${sha256(token)}, ${userId}, now() + make_interval(secs => ${SESSION_MAX_SECONDS}), ${await clientIp()}, ${userAgent})
  `;
  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true, // not readable from page scripts
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // never sent on requests started by another site
    path: "/",
    maxAge: SESSION_MAX_SECONDS,
  });
}

/** End the session behind the current cookie and clear the cookie. */
export async function destroyCurrentSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (looksLikeSessionToken(token)) {
    await db()`update easytive.admin_sessions set is_active = false where token_hash = ${sha256(token)}`;
  }
  jar.delete(ADMIN_COOKIE);
}

/** Sign an account out everywhere (password change, reset, disable). */
export async function revokeUserSessions(userId: string): Promise<void> {
  await db()`update easytive.admin_sessions set is_active = false where user_id = ${userId} and is_active`;
}

/** Housekeeping: switch off sessions that can no longer be used (soft delete). */
export async function pruneSessions(): Promise<void> {
  await db()`
    update easytive.admin_sessions set is_active = false
    where is_active
      and (expires_at < now() or last_seen_at < now() - make_interval(secs => ${SESSION_IDLE_SECONDS}))
  `;
}

/** Append to the audit trail. Never pass passwords or tokens in `detail`. */
export async function audit(action: string, actorId: string | null, detail: Record<string, string | number | boolean | null> = {}): Promise<void> {
  const sql = db();
  await sql`
    insert into easytive.admin_audit_log (actor_id, action, detail, ip)
    values (${actorId}, ${action}, ${sql.json(detail)}, ${await clientIp()})
  `;
}
