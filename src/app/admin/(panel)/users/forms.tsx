"use client";

import { useActionState, type ReactNode } from "react";
import type { UserFormState } from "./actions";

// Wraps the add-user and reset-password forms: both hand back a temporary
// password that has to be shown once, which a plain redirect can't carry
// (it must never end up in a URL).
export function TempPasswordForm({
  action,
  children,
  submitLabel,
  className,
  buttonClassName = "a-btn small",
}: {
  action: (prev: UserFormState, fd: FormData) => Promise<UserFormState>;
  children?: ReactNode;
  submitLabel: string;
  className?: string;
  buttonClassName?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className={className}>
      {children}
      <div className="a-actions">
        <button className={buttonClassName} type="submit" disabled={pending}>
          {pending ? "Working…" : submitLabel}
        </button>
      </div>
      {state?.error && (
        <p className="a-error" role="alert">
          {state.error}
        </p>
      )}
      {state?.tempPassword && (
        <div className="a-ok" role="status">
          <p>
            Temporary password for <strong>{state.email}</strong>:
          </p>
          <code className="a-secret">{state.tempPassword}</code>
          <p>
            Copy it now: it won&apos;t be shown again. Send it to them privately. It works for 72 hours, and they&apos;ll be asked
            to choose their own password the first time they sign in.
          </p>
        </div>
      )}
    </form>
  );
}
