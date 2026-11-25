<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Easytive — Agent Guide

Website for **Easytive**, a urinary wellness supplement brand. The `main` branch is the pre-launch site (hero video, newsletter footer, About, and The Easy Journal + admin CMS); the full shop lives on `abin/future-update`.

## Stack & Runtime

- **Runtime**: Node `>=24.7` (required for built-in `crypto.argon2` in `src/lib/password.ts`)
- **Framework**: Next.js `16.4.6` (App Router, `cacheComponents: true`, `partialPrefetching: true`, Turbopack), React `19.3.0`, TypeScript `5`
- **Styling**: Tailwind CSS v4 (`src/app/globals.css`) + custom stylesheets (`src/app/site.css` for public pages, `src/app/admin/admin.css` for `/admin`)
- **Database**: Supabase Postgres via `postgres` (`prepare: false` for transaction pooler on port `6543`; session pooler on port `5432` for migrations/scripts)
- **Storage**: Private S3-compatible bucket (Supabase Storage) via `aws4fetch` + `sharp`
- **Deployment**: Vercel (`vercel.json`, `syd1` region, daily cron `/api/cron/db-ping`)

## Commands

```bash
npm run dev                         # Start Next.js dev server (Turbopack)
npm run build                       # Production build
npm run lint                        # ESLint (includes custom admin-guard rule)
npx tsc --noEmit                    # Typecheck (no test suite is configured)
npm run db:migrate                  # Apply db/migrations/*.sql in order
npm run admin:user -- <email>       # Create admin or issue 72h temp password
npm run admin:unblock [-- <target>] # List or clear IP blocks / account locks
node scripts/upload-media.mjs <f>…  # Upload static media (e.g. hero mp4/jpg)
```

Always run `npx tsc --noEmit && npm run lint` after code changes.

## Repository Map

- `src/proxy.ts` — Next.js 16 request proxy (replaces `middleware.ts`): returns `403` to social link-preview bots (`PREVIEW_BOT`), checks `/admin/*` session cookie shape, and sets `Cache-Control: private, no-store` + `X-Robots-Tag: noindex, nofollow`.
- `src/app/` — Public routes (`/`, `/about`, `/journal`, `/journal/[slug]`, `/robots.ts`, `/sitemap.ts`, `/not-found.tsx`), `/media/[...key]/route.ts`, `/api/cron/db-ping/route.ts`, and `/admin/*`.
- `src/components/` — Shared UI (`Header.tsx`, `Logo.tsx`, `Emphasis.tsx`, `InfiniteMore.tsx`, `PageLoader.tsx`, `WhatsAppButton.tsx`, `sections/*`).
- `src/data/` — `site.ts` (default copy, nav, WhatsApp config, hero media paths), `store.ts` (`getSiteData` merging `easytive.site_content` overrides), `blog.ts` (keyset-paginated journal queries + admin mutations).
- `src/lib/` — `db.ts`, `auth.ts`, `session.ts`, `password.ts`, `rate-limit.ts`, `login-guard.ts`, `media.ts`, `media-path.ts`, `site.ts`.
- `db/migrations/` — Sequential SQL migrations (`0001`–`0011`) for the private `easytive` schema.
- `scripts/` — Operational CLI scripts (`migrate.mjs`, `admin-user.mjs`, `unblock.mjs`, `upload-media.mjs`).

## Critical Conventions & Guardrails

### 1. Next.js 16 & Cache Components
- `cacheComponents: true` is enabled in `next.config.ts`. Public data readers (`src/data/blog.ts`, `src/data/store.ts`) use `"use cache"`, `cacheLife("hours")`, and `cacheTag("blog" | "site-content")`.
- Any mutation that changes journal data must call `updateTag("blog")` (see `src/app/admin/(panel)/actions.ts`).
- `params`, `searchParams`, `cookies()`, and `headers()` are async—always `await` them, and wrap request-time reads inside `<Suspense>` where pages use prerendered shells (e.g., `Notice` in `src/app/admin/(panel)/fields.tsx`, `Article` in `src/app/journal/[slug]/page.tsx`).

### 2. Admin Authentication & ESLint Rule
- `src/app/admin/(panel)/layout.tsx` intentionally stays static so segment `loading.tsx` boundaries render immediately.
- **Every `src/app/admin/(panel)/**/page.tsx` must begin with `await requireUser()`** as its first statement. This is enforced at lint time by `admin-guard/page-checks-session` in `eslint.config.mjs`.
- Every admin Server Action (`src/app/admin/(panel)/actions.ts`, `src/data/blog.ts` writes) must also call `await requireUser()` (or `getCurrentUser()` where pre-password-change is handled, as in `auth-actions.ts`).
- Never skip `src/lib/auth.ts` checks by relying on `src/proxy.ts`; the proxy only validates cookie shape.
- Report auth/form outcomes via fixed query codes (`?error=…`, `?done=1`) mapped in `src/app/admin/messages.ts` or `src/app/admin/(panel)/fields.tsx`—never reflect user input into URLs or UI text.

### 3. Database & Soft Deletes
- Write all queries with `postgres` tagged templates (`db()\`...\``); never interpolate raw strings into SQL.
- All tables live in the private `easytive` schema with RLS enabled and no `anon`/`authenticated`/`public` grants. New migrations must preserve this lockdown (`enable row level security` + `revoke all`).
- **Soft-delete only**: Operational tables use `is_active boolean not null default true`. Never hard-delete rows; set `is_active = false` and always include `is_active` in `WHERE` clauses and partial indexes.
- Add schema changes as new sequential files in `db/migrations/` (never edit already-applied migrations).

### 4. Media & Storage
- Storage is private. Uploaded objects use keys of the form `uploads/<year>/<uuid>.<ext>` (`src/lib/media-path.ts`) and are served exclusively via `/media/[...key]` with `Range` (`206`) pass-through and immutable 1-year caching.
- `uploadImage` (`src/lib/media.ts`) enforces `<= 4 MB` (`serverActions.bodySizeLimit` is `5mb`), sniffs magic bytes (JPEG, PNG, WebP, AVIF), and re-encodes with `sharp` to strip EXIF/GPS/XMP metadata.
- Never overwrite or delete bucket objects on post edit/delete so soft-deleted posts remain restorable.

### 5. Security Headers & CSP
- `next.config.ts` applies a strict CSP (`default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `form-action 'self'`). If adding third-party scripts, images, fonts, or API calls (`connect-src`), update the CSP intentionally.
- Never read or expose secrets from `.env`. Keep `src/lib/password.ts` free of app/Next.js imports so `scripts/admin-user.mjs` can import it directly.
