"use server";

// Account management. Every action re-checks the session *and* the admin role
// (requireAdminRole), validates what the form sent, and writes an audit entry.
// No action here can target the signed-in admin's own account, so there is
// always at least one working admin left to undo a mistake.

import { refresh } from "next/cache";
import { audit, requireAdminRole, revokeUserSessions, type Role } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateTempPassword, hashPassword, normalizeEmail } from "@/lib/password";
import { clearLimit, hit, limitKey } from "@/lib/rate-limit";

/** What the add/reset forms show after submitting. The temporary password is returned once and stored nowhere readable. */
export type UserFormState = { error?: string; email?: string; tempPassword?: string } | null;

const TEMP_PASSWORD_HOURS = 72;

function targetId(fd: FormData): string | null {
  const id = String(fd.get("id") ?? "");
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ? id.toLowerCase() : null;
}

const roleOf = (fd: FormData): Role => (fd.get("role") === "admin" ? "admin" : "editor");

/** Caps how fast one admin session can churn accounts (also bounds password hashing work). */
async function withinWriteLimit(actorId: string): Promise<boolean> {
  return (await hit(limitKey("users:write", actorId), 30, 15 * 60)).ok;
}

export async function createUser(_prev: UserFormState, fd: FormData): Promise<UserFormState> {
  const actor = await requireAdminRole();
  if (!(await withinWriteLimit(actor.id))) return { error: "Too many changes at once. Wait a few minutes." };

  const email = normalizeEmail(String(fd.get("email") ?? ""));
  if (!email) return { error: "Enter a valid email address." };
  const role = roleOf(fd);

  const tempPassword = generateTempPassword();
  const sql = db();
  const created = await sql`
    insert into easytive.admin_users (email, password_hash, role, must_change_password, temp_password_expires_at, created_by)
    values (${email}, ${await hashPassword(tempPassword)}, ${role}, true, now() + make_interval(hours => ${TEMP_PASSWORD_HOURS}), ${actor.id})
    on conflict (email) do nothing
    returning id
  `;
  if (created.length === 0) return { error: "An account with that email already exists. If it's deactivated, reactivate it below." };

  await audit("user.create", actor.id, { target: email, role });
  refresh();
  return { email, tempPassword };
}

export async function resetUserPassword(_prev: UserFormState, fd: FormData): Promise<UserFormState> {
  const actor = await requireAdminRole();
  if (!(await withinWriteLimit(actor.id))) return { error: "Too many changes at once. Wait a few minutes." };

  const id = targetId(fd);
  if (!id) return { error: "That account no longer exists." };
  if (id === actor.id) return { error: "Change your own password from the Account page." };

  const tempPassword = generateTempPassword();
  const sql = db();
  const [user] = await sql<{ email: string }[]>`
    update easytive.admin_users
    set password_hash = ${await hashPassword(tempPassword)},
        must_change_password = true,
        temp_password_expires_at = now() + make_interval(hours => ${TEMP_PASSWORD_HOURS}),
        password_changed_at = now()
    where id = ${id}
    returning email
  `;
  if (!user) return { error: "That account no longer exists." };

  await revokeUserSessions(id); // the old password's sessions end now
  await clearLimit(limitKey("login:email", user.email)); // and any sign-in lockout
  await audit("user.reset_password", actor.id, { target: user.email });
  refresh();
  return { email: user.email, tempPassword };
}

/**
 * Soft delete: deactivating blocks sign-in and ends the account's sessions,
 * but keeps the row (and its audit history). Reactivating undoes it.
 */
export async function setUserActive(fd: FormData): Promise<void> {
  const actor = await requireAdminRole();
  const id = targetId(fd);
  if (!id || id === actor.id) return;
  const active = fd.get("active") === "1";

  const [user] = await db()<{ email: string }[]>`
    update easytive.admin_users set is_active = ${active} where id = ${id} and is_active <> ${active} returning email
  `;
  if (!user) return;
  if (!active) await revokeUserSessions(id);
  await audit(active ? "user.reactivate" : "user.deactivate", actor.id, { target: user.email });
  refresh();
}

export async function setUserRole(fd: FormData): Promise<void> {
  const actor = await requireAdminRole();
  const id = targetId(fd);
  if (!id || id === actor.id) return;
  const role = roleOf(fd);

  const [user] = await db()<{ email: string }[]>`
    update easytive.admin_users set role = ${role} where id = ${id} and role <> ${role} returning email
  `;
  if (!user) return;
  await audit("user.role", actor.id, { target: user.email, role });
  refresh();
}
