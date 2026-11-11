// Fixed-window rate limiting backed by Postgres, so the count is shared by
// every server instance and survives restarts (an in-memory counter would
// reset on each serverless cold start).

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db } from "./db";

export type Limit = { ok: boolean; retryAfterSeconds: number };

/** Hash the caller-supplied part of a key: bounded length, no raw addresses stored. */
export function limitKey(scope: string, subject: string): string {
  return `${scope}:${createHash("sha256").update(subject).digest("hex")}`;
}

/**
 * Count one attempt against `key`. Atomic: concurrent attempts can't slip
 * past the limit, because the increment and the read are one statement.
 */
export async function hit(key: string, limit: number, windowSeconds: number): Promise<Limit> {
  const sql = db();
  const [row] = await sql<{ count: number; retry: number }[]>`
    insert into easytive.rate_limits as r (key, count, window_start)
    values (${key}, 1, now())
    on conflict (key) do update set
      -- A cleared (inactive) or expired counter starts a fresh window.
      count = case when not r.is_active or r.window_start <= now() - make_interval(secs => ${windowSeconds}) then 1 else r.count + 1 end,
      window_start = case when not r.is_active or r.window_start <= now() - make_interval(secs => ${windowSeconds}) then now() else r.window_start end,
      is_active = true
    returning count, ceil(extract(epoch from (window_start + make_interval(secs => ${windowSeconds}) - now())))::int as retry
  `;
  return { ok: row.count <= limit, retryAfterSeconds: Math.max(1, row.retry) };
}

export async function clearLimit(key: string): Promise<void> {
  await db()`update easytive.rate_limits set is_active = false where key = ${key}`;
}

/** Housekeeping: switch off counters whose window ended long ago (soft delete). */
export async function pruneLimits(): Promise<void> {
  await db()`update easytive.rate_limits set is_active = false where is_active and window_start < now() - interval '1 day'`;
}

/**
 * Best-effort client address. Behind a host that sets X-Forwarded-For
 * (Vercel, most proxies) the first entry is the visitor. Where the header can
 * be forged, the per-account limit still holds, since it doesn't depend on it.
 */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip")?.trim() || "unknown";
  return ip.slice(0, 64);
}
