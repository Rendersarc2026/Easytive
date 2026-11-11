import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { changePassword, logout, signOutEverywhere } from "../../auth-actions";
import { passwordErrorMessage, passwordHint } from "../../messages";
import { ConfirmButton } from "@/app/admin/buttons";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ error?: string; done?: string }> }) {
  const user = await requireUser();
  const { error: code, done } = await searchParams;
  const error = passwordErrorMessage(code);

  return (
    <>
      <div className="a-toplabel">Profile</div>
      <h1>Your profile</h1>
      <p className="a-lede">
        Signed in as <strong>{user.email}</strong>.
      </p>

      <div className="a-cards">
        <section className="a-card">
          <div className="a-cardhead">
            <h2>Password</h2>
          </div>
          {done && !error && (
            <p className="a-ok" role="status">
              Password updated. Every other device has been signed out.
            </p>
          )}
          {error && (
            <p className="a-error" role="alert">
              {error}
            </p>
          )}
          <form action={changePassword} className="a-form" style={{ maxWidth: 420 }}>
            <div className="a-field">
              <label className="a-label" htmlFor="current">
                Current password
              </label>
              <input className="a-input" id="current" name="current" type="password" required autoComplete="current-password" maxLength={128} />
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="password">
                New password
              </label>
              <input className="a-input" id="password" name="password" type="password" required autoComplete="new-password" minLength={12} maxLength={128} />
              <span className="a-cardhint">{passwordHint}</span>
            </div>
            <div className="a-field">
              <label className="a-label" htmlFor="confirm">
                New password again
              </label>
              <input className="a-input" id="confirm" name="confirm" type="password" required autoComplete="new-password" minLength={12} maxLength={128} />
            </div>
            <div className="a-actions">
              <button className="a-btn" type="submit">
                Change password
              </button>
            </div>
          </form>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <h2>Sessions</h2>
          </div>
          <p className="a-cardhint">
            A session ends after 8 hours without activity, and 7 days after sign-in at the latest. If you think someone else
            has been in your account, sign out everywhere and then change your password.
          </p>
          <form action={signOutEverywhere} style={{ marginTop: 12 }}>
            <ConfirmButton
              className="a-btn small ghost"
              title="Sign out on every device?"
              message="This ends every session for your account, including this one. You'll need your password to sign back in."
              confirmLabel="Sign out everywhere"
              pendingLabel="Signing out…"
            >
              Sign out on every device
            </ConfirmButton>
          </form>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <h2>Log out</h2>
          </div>
          <p className="a-cardhint">Ends your session on this device.</p>
          <form action={logout} style={{ marginTop: 12 }}>
            <ConfirmButton className="a-btn small" title="Log out?" message="You'll need your email and password to sign back in." confirmLabel="Log out" pendingLabel="Logging out…">
              Log out
            </ConfirmButton>
          </form>
        </section>
      </div>
    </>
  );
}
