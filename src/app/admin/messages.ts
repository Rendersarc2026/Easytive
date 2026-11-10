// Fixed messages for the ?error=<code> query codes used by the password
// screens. Unknown codes fall back to a generic line, so a hand-edited URL can
// never put its own text on the page.

import { PASSWORD_MAX, PASSWORD_MIN } from "@/lib/password";

const passwordErrors: Record<string, string> = {
  current: "The current password isn't right.",
  mismatch: "The two new passwords don't match.",
  length: `Use between ${PASSWORD_MIN} and ${PASSWORD_MAX} characters.`,
  email: "Don't use your email address in the password.",
  weak: "That password is too easy to guess. Try a longer phrase.",
  same: "Choose a password you haven't just been using.",
  rate: "Too many attempts. Wait 15 minutes and try again.",
};

export function passwordErrorMessage(code: string | undefined): string | null {
  if (!code) return null;
  return passwordErrors[code] ?? "That didn't work. Try again.";
}

export const passwordHint = `At least ${PASSWORD_MIN} characters. A few unrelated words works well.`;
