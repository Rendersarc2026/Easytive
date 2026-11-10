import type { Metadata } from "next";
import { requireAdminRole, type Role } from "@/lib/auth";
import { db } from "@/lib/db";
import { createUser, deleteUser, resetUserPassword, setUserDisabled, setUserRole } from "./actions";
import { TempPasswordForm } from "./forms";

export const metadata: Metadata = { title: "Users · Easytive admin" };

type UserRow = {
  id: string;
  email: string;
  role: Role;
  disabled: boolean;
  pending: boolean;
  last_login_at: Date | null;
};

type AuditRow = { id: string; at: Date; action: string; actor: string | null; detail: Record<string, unknown> | null };

const stamp = (d: Date | null) => (d ? `${d.toISOString().slice(0, 16).replace("T", " ")} UTC` : "never");

const actionLabels: Record<string, string> = {
  "login.success": "Signed in",
  "login.failure": "Failed sign-in",
  "login.blocked": "Sign-in blocked (too many attempts)",
  "login.temp_expired": "Sign-in with expired temporary password",
  logout: "Signed out",
  "logout.everywhere": "Signed out everywhere",
  "password.change": "Changed password",
  "password.change_failed": "Wrong current password",
  "user.create": "Added user",
  "user.reset_password": "Reset password",
  "user.disable": "Disabled user",
  "user.enable": "Enabled user",
  "user.role": "Changed role",
  "user.delete": "Deleted user",
};

export default async function UsersPage() {
  const me = await requireAdminRole();
  const sql = db();
  const [users, log] = await Promise.all([
    sql<UserRow[]>`
      select id, email, role, disabled_at is not null as disabled, must_change_password as pending, last_login_at
      from easytive.admin_users
      order by disabled_at is not null, email
    `,
    sql<AuditRow[]>`
      select l.id, l.at, l.action, u.email as actor, l.detail
      from easytive.admin_audit_log l
      left join easytive.admin_users u on u.id = l.actor_id
      order by l.at desc
      limit 30
    `,
  ]);

  return (
    <>
      <div className="a-toplabel">Users</div>
      <h1>Who can sign in</h1>
      <p className="a-lede">
        Admins can edit everything and manage these accounts. Editors can edit site content and the journal, and nothing on
        this page. New and reset accounts get a one-time temporary password.
      </p>

      <div className="a-cards">
        <section className="a-card">
          <div className="a-cardhead">
            <h2>Add a user</h2>
          </div>
          <TempPasswordForm action={createUser} submitLabel="Add user" className="a-form" buttonClassName="a-btn">
            <div className="a-grid2">
              <div className="a-field">
                <label className="a-label" htmlFor="new-email">
                  Email
                </label>
                <input className="a-input" id="new-email" name="email" type="email" required maxLength={254} autoComplete="off" />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="new-role">
                  Role
                </label>
                <select className="a-input" id="new-role" name="role" defaultValue="editor">
                  <option value="editor">Editor: content only</option>
                  <option value="admin">Admin: content and users</option>
                </select>
              </div>
            </div>
          </TempPasswordForm>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <h2>{users.length} accounts</h2>
          </div>
          <div className="a-rows">
            {users.map((u) => {
              const self = u.id === me.id;
              return (
                <div className="a-row" key={u.id}>
                  <div className="a-rowmain">
                    <strong>{u.email}</strong>
                    <span className="a-cardhint" style={{ display: "block" }}>
                      {u.role}
                      {self ? " · you" : ""}
                      {u.disabled ? " · disabled" : u.pending ? " · waiting for first sign-in" : ""} · last sign-in {stamp(u.last_login_at)}
                    </span>
                    {!self && (
                      <TempPasswordForm action={resetUserPassword} submitLabel="Reset password" buttonClassName="a-btn small ghost">
                        <input type="hidden" name="id" value={u.id} />
                      </TempPasswordForm>
                    )}
                  </div>
                  {!self && (
                    <div className="a-rowside">
                      <form action={setUserRole}>
                        <input type="hidden" name="id" value={u.id} />
                        <input type="hidden" name="role" value={u.role === "admin" ? "editor" : "admin"} />
                        <button className="a-btn small ghost" type="submit">
                          Make {u.role === "admin" ? "editor" : "admin"}
                        </button>
                      </form>
                      <form action={setUserDisabled}>
                        <input type="hidden" name="id" value={u.id} />
                        <input type="hidden" name="disabled" value={u.disabled ? "0" : "1"} />
                        <button className="a-btn small subtle" type="submit">
                          {u.disabled ? "Enable" : "Disable"}
                        </button>
                      </form>
                      {u.disabled && (
                        <form action={deleteUser}>
                          <input type="hidden" name="id" value={u.id} />
                          <button className="a-btn small subtle" type="submit">
                            Delete for good
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="a-cardhint" style={{ marginTop: 12 }}>
            Disabling signs the person out at once and blocks sign-in; it can be undone. Deleting is only offered for a
            disabled account and can&apos;t be undone.
          </p>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <h2>Recent activity</h2>
          </div>
          <div className="a-rows">
            {log.map((e) => {
              const target = typeof e.detail?.target === "string" ? e.detail.target : typeof e.detail?.email === "string" ? e.detail.email : "";
              return (
                <div className="a-row" key={e.id}>
                  <span className="a-rowmain">
                    {actionLabels[e.action] ?? e.action}
                    {target ? `: ${target}` : ""}
                    <span className="a-cardhint" style={{ display: "block" }}>
                      {e.actor ?? "not signed in"} · {stamp(e.at)}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
