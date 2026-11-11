"use client";

// Submit buttons for admin forms. Both sit inside a <form> whose action is a
// server action, and use useFormStatus to show that the request is running.

import { useId, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";

/** Plain submit button that says it's working (and can't be clicked twice) while the action runs. */
export function SubmitButton({ children, pendingLabel, className = "a-btn" }: { children: ReactNode; pendingLabel: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button className={className} type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}

/**
 * A button that asks before it submits. Clicking it opens a modal <dialog>;
 * the dialog's confirm button is the form's real submit button, so the action
 * runs only after the person confirms. Cancel, Esc or a click outside closes
 * it without doing anything.
 *
 * Opening and closing use invoker commands (command / commandfor), so the
 * dialog works even before the page's JavaScript has loaded.
 */
export function ConfirmButton({
  children,
  title,
  message,
  confirmLabel,
  pendingLabel = "Working…",
  danger = false,
  className = "a-btn small subtle",
}: {
  children: ReactNode;
  title: string;
  message?: string;
  confirmLabel: string;
  pendingLabel?: string;
  danger?: boolean;
  className?: string;
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const { pending } = useFormStatus();

  return (
    <>
      <button type="button" className={className} command="show-modal" commandfor={id} disabled={pending}>
        {pending ? pendingLabel : children}
      </button>
      <dialog ref={dialog} id={id} className="a-confirm" closedby="any" aria-labelledby={`${id}-title`} aria-describedby={message ? `${id}-msg` : undefined}>
        <h2 id={`${id}-title`}>{title}</h2>
        {message && <p id={`${id}-msg`}>{message}</p>}
        <div className="a-confirm-actions">
          {/* First in the DOM, so it gets focus when the dialog opens: the safe choice. */}
          <button type="button" className="a-btn small ghost" command="close" commandfor={id}>
            Cancel
          </button>
          {/* Closing first, then the click carries on and submits the form. */}
          <button type="submit" className={`a-btn small${danger ? " danger" : ""}`} onClick={() => dialog.current?.close()}>
            {confirmLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
