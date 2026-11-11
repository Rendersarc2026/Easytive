import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { login } from "../auth-actions";
import "../admin.css";
import { SubmitButton } from "../buttons";

export const metadata: Metadata = { title: "Sign in" };

const errors: Record<string, string> = {
  rate: "Too many sign-in attempts. Wait a minute and try again.",
  locked: "Too many failed sign-ins. This account is locked for 15 minutes; try again after that.",
  blocked: "Sign-in from your network is blocked for a while after suspicious activity. Try again later.",
  expired: "That temporary password has expired. Ask an admin to reset it.",
};

// The card reads cookies + searchParams (both request-time), so it streams in
// behind a Suspense boundary; the prerendered shell has nothing in it.
async function LoginCard({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect(user.mustChangePassword ? "/admin/set-password" : "/admin");
  const { error } = await searchParams;

  return (
    <div className="a-logincard">
      <span className="brand">Easytive</span>
      <form action={login} className="a-form">
        <div className="a-field">
          <label className="a-label" htmlFor="email">
            Email
          </label>
          <input className="a-input" id="email" name="email" type="email" required autoFocus autoComplete="username" maxLength={254} />
        </div>
        <div className="a-field">
          <label className="a-label" htmlFor="password">
            Password
          </label>
          <input className="a-input" id="password" name="password" type="password" required autoComplete="current-password" maxLength={128} />
        </div>
        <SubmitButton pendingLabel="Signing in…">Sign in</SubmitButton>
      </form>
      {error && (
        <p className="a-error" role="alert">
          {errors[error] ?? "That email and password don't match. Try again."}
        </p>
      )}
    </div>
  );
}

export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <div className="a-login">
      <Suspense fallback={null}>
        <LoginCard searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
