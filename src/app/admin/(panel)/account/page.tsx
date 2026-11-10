import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { changePassword, signOutEverywhere } from "../../auth-actions";
import { passwordErrorMessage, passwordHint } from "../../messages";

export const metadata: Metadata = { title: "Account · Easytive admin" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string; done?: string }> }) {
  const user = await requireUser();
  const { error: code, done } = await searchParams;
  const error = passwordErrorMessage(code);

  return (
    <>
      <div className="a-toplabel">Account</div>
      <h1>Your account</h1>
      <p className="a-lede">
        Signed in as <strong>{user.email}</strong> ({user.role}).
      </p>

      <div className="a-cards">
        <section className="a-card">
          <div className="a-cardhead">
            <h2>Change password</h2>
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
            <button className="a-btn small ghost" type="submit">
              Sign out on every device
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
