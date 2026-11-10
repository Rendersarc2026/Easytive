"use server";

// Sign-in, sign-out and password changes. Outcomes are reported by redirecting
// with a short code in the query string (?error=…, ?done=1); the pages map the
// code to a message, so nothing typed by a visitor is ever echoed back.

import { redirect } from "next/navigation";
import { audit, createSession, destroyCurrentSession, getCurrentUser, pruneSessions, requireUser, revokeUserSessions } from "@/lib/auth";
import { db } from "@/lib/db";
import { decoyHash, hashPassword, normalizeEmail, passwordProblem, PASSWORD_MAX, verifyPassword } from "@/lib/password";
import { clearLimit, clientIp, hit, limitKey, pruneLimits } from "@/lib/rate-limit";

const WINDOW = 15 * 60;
const LOGIN_PER_IP = 20; // attempts per address per 15 minutes
const LOGIN_PER_EMAIL = 10; // attempts per account per 15 minutes, from anywhere
const PASSWORD_CHECKS_PER_USER = 5; // wrong "current password" tries per 15 minutes

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  must_change_password: boolean;
  disabled: boolean;
  temp_expired: boolean;
};

export async function login(formData: FormData): Promise<void> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const ip = await clientIp();

  // Count the attempt before looking at the password, so parallel guesses
  // can't race past the limit. Both limits apply: per address, per account.
  const ipLimit = await hit(limitKey("login:ip", ip), LOGIN_PER_IP, WINDOW);
  const emailKey = email ? limitKey("login:email", email) : null;
  const emailLimit = emailKey ? await hit(emailKey, LOGIN_PER_EMAIL, WINDOW) : { ok: true, retryAfterSeconds: 0 };
  if (!ipLimit.ok || !emailLimit.ok) {
    await audit("login.blocked", null, { email: email ?? "(invalid)" });
    redirect("/admin/login?error=rate");
  }

  const sql = db();
  const [user] = email
    ? await sql<UserRow[]>`
        select id, email, password_hash, must_change_password,
               disabled_at is not null as disabled,
               coalesce(temp_password_expires_at < now(), false) as temp_expired
        from easytive.admin_users
        where email = ${email}
      `
    : [];

  // Always run one full hash check, account or not, so the response time
  // doesn't reveal which emails exist.
  const tooLong = password.length > PASSWORD_MAX;
  const check = await verifyPassword(tooLong ? "" : password, user?.password_hash ?? (await decoyHash()));
  if (!user || tooLong || !check.ok || user.disabled) {
    await audit("login.failure", null, { email: email ?? "(invalid)" });
    redirect("/admin/login?error=1"); // same answer for every kind of failure
  }
  if (user.must_change_password && user.temp_expired) {
    await audit("login.temp_expired", user.id, {});
    redirect("/admin/login?error=expired");
  }

  if (check.needsRehash) {
    await sql`update easytive.admin_users set password_hash = ${await hashPassword(password)} where id = ${user.id}`;
  }
  await sql`update easytive.admin_users set last_login_at = now() where id = ${user.id}`;
  if (emailKey) await clearLimit(emailKey);
  await Promise.all([pruneSessions(), pruneLimits()]);

  await createSession(user.id); // always a fresh token: nothing from before sign-in is reused
  await audit("login.success", user.id, {});
  redirect(user.must_change_password ? "/admin/set-password" : "/admin");
}

export async function logout(): Promise<void> {
  const user = await getCurrentUser();
  await destroyCurrentSession();
  if (user) await audit("logout", user.id, {});
  redirect("/admin/login");
}

/** Signs this account out on every device, this one included. */
export async function signOutEverywhere(): Promise<void> {
  const user = await requireUser();
  await revokeUserSessions(user.id);
  await destroyCurrentSession();
  await audit("logout.everywhere", user.id, {});
  redirect("/admin/login");
}

/**
 * Change your own password. Used by two screens:
 *  - /admin/account: must supply the current password;
 *  - /admin/set-password: first sign-in on a temporary password (the session
 *    was opened with it moments ago, so it isn't asked for again).
 * Either way every existing session ends and a fresh one starts.
 */
export async function changePassword(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  const back = user.mustChangePassword ? "/admin/set-password" : "/admin/account";

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const sql = db();
  const [row] = await sql<{ password_hash: string }[]>`select password_hash from easytive.admin_users where id = ${user.id}`;
  if (!row) redirect("/admin/login");

  if (!user.mustChangePassword) {
    const key = limitKey("pwcheck:user", user.id);
    const limit = await hit(key, PASSWORD_CHECKS_PER_USER, WINDOW);
    if (!limit.ok) redirect(`${back}?error=rate`);
    const currentOk = current.length <= PASSWORD_MAX && (await verifyPassword(current, row.password_hash)).ok;
    if (!currentOk) {
      await audit("password.change_failed", user.id, {});
      redirect(`${back}?error=current`);
    }
    await clearLimit(key);
  }

  if (next !== confirm) redirect(`${back}?error=mismatch`);
  const problem = passwordProblem(next, user.email);
  if (problem) redirect(`${back}?error=${problem}`);
  if ((await verifyPassword(next, row.password_hash)).ok) redirect(`${back}?error=same`);

  await sql`
    update easytive.admin_users
    set password_hash = ${await hashPassword(next)},
        must_change_password = false,
        temp_password_expires_at = null,
        password_changed_at = now()
    where id = ${user.id}
  `;
  await revokeUserSessions(user.id);
  await createSession(user.id);
  await audit("password.change", user.id, {});
  redirect(user.mustChangePassword ? "/admin" : "/admin/account?done=1");
}
