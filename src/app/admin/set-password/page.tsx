import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { changePassword, logout } from "../auth-actions";
import { passwordErrorMessage, passwordHint } from "../messages";
import "../admin.css";
import { ConfirmButton } from "@/app/admin/buttons";

export const metadata: Metadata = { title: "Set your password · Easytive admin", robots: { index: false, follow: false } };

// First sign-in on a temporary password lands here, and nowhere else in the
// panel opens until a personal password is set.
async function Card({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.mustChangePassword) redirect("/admin");
  const error = passwordErrorMessage((await searchParams).error);

  return (
    <div className="a-logincard">
      <span className="brand">Easytive</span>
      <p className="a-cardhint">
        Signed in as {user.email}. Choose your own password to replace the temporary one.
      </p>
      <form action={changePassword} className="a-form">
        <div className="a-field">
          <label className="a-label" htmlFor="password">
            New password
          </label>
          <input className="a-input" id="password" name="password" type="password" required autoFocus autoComplete="new-password" minLength={12} maxLength={128} />
          <span className="a-cardhint">{passwordHint}</span>
        </div>
        <div className="a-field">
          <label className="a-label" htmlFor="confirm">
            New password again
          </label>
          <input className="a-input" id="confirm" name="confirm" type="password" required autoComplete="new-password" minLength={12} maxLength={128} />
        </div>
        <button className="a-btn" type="submit">
          Save password
        </button>
      </form>
      {error && (
        <p className="a-error" role="alert">
          {error}
        </p>
      )}
      <form action={logout}>
        <ConfirmButton className="logout-btn" title="Sign out?" message="You'll need your email and password to sign back in." confirmLabel="Sign out" pendingLabel="Signing out…">
          Sign out
        </ConfirmButton>
      </form>
    </div>
  );
}

export default function SetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <div className="a-login">
      <Suspense fallback={null}>
        <Card searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
