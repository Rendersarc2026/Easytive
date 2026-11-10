import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { login } from "../auth-actions";
import "../admin.css";

export const metadata: Metadata = { title: "Admin · Easytive", robots: { index: false, follow: false } };

const errors: Record<string, string> = {
  rate: "Too many sign-in attempts. Wait 15 minutes and try again.",
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
        <button className="a-btn" type="submit">
          Sign in
        </button>
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
