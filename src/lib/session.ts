// Session cookie constants, shared by lib/auth.ts and src/proxy.ts. No
// database or crypto imports here: the proxy runs on every /admin request and
// only does a cheap shape check before the real lookup happens in lib/auth.ts.

// "__Host-" makes browsers refuse the cookie unless it is Secure, Path=/ and
// has no Domain, so a sibling subdomain can't plant or overwrite it. It needs
// HTTPS, so plain-http dev uses an unprefixed name.
export const ADMIN_COOKIE = process.env.NODE_ENV === "production" ? "__Host-easytive_admin" : "easytive_admin";

/** Sessions end after this long without activity… */
export const SESSION_IDLE_SECONDS = 60 * 60 * 8;
/** …and no later than this after sign-in, however active. */
export const SESSION_MAX_SECONDS = 60 * 60 * 24 * 7;

/** 32 random bytes, base64url: exactly 43 characters. */
export function looksLikeSessionToken(value: string | undefined): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{43}$/.test(value);
}
