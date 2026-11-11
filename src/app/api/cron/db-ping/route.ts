// Daily keep-alive for the Supabase database, called by Vercel Cron (see
// vercel.json). Supabase pauses free-tier projects after about a week with no
// activity; one small query a day prevents that. The same run switches off
// (soft-deletes) expired sessions, old rate-limit counters and old sign-in failures,
// locks and blocks.
//
// Vercel sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set
// in the project's environment variables. Anything else gets a 401, so the
// public can't use this route to hit the database.

import { createHash, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { pruneSessions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pruneLoginGuard } from "@/lib/login-guard";
import { pruneLimits } from "@/lib/rate-limit";

const digest = (value: string) => createHash("sha256").update(value).digest();

function authorized(header: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || !header) return false;
  // Compare fixed-length digests so the check takes the same time for any input.
  return timingSafeEqual(digest(header), digest(`Bearer ${secret}`));
}

export async function GET(): Promise<Response> {
  // Reading headers also keeps this route from being prerendered at build time.
  if (!authorized((await headers()).get("authorization"))) {
    return Response.json({ ok: false }, { status: 401 });
  }

  try {
    // Touch a real app table, not just "select 1", so it counts as project activity.
    const [row] = await db()<{ at: Date }[]>`select now() as at, (select count(*) from easytive.site_content where is_active) as sections`;
    await Promise.all([pruneSessions(), pruneLimits(), pruneLoginGuard()]);
    return Response.json({ ok: true, at: row.at.toISOString() });
  } catch (err) {
    console.error("db-ping failed:", err instanceof Error ? err.message : err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
