# Easytive

Website for Easytive, a urinary wellness supplement brand. Next.js 16 (App Router, Cache Components), deployed on Vercel. Data in Supabase Postgres, images and videos in a Supabase Storage bucket.

`main` is the pre-launch site: video hero + newsletter footer, About, and the blog. The full shop site lives on the `abin/future-update` branch.

## Setup

```bash
npm install
# create .env with the variables below
npm run db:migrate
npm run admin:user -- you@example.com   # prints a temporary password
npm run dev
```

`.env` (also set these in Vercel):

| Variable | What it is |
| --- | --- |
| `DATABASE_URL` | Supabase transaction pooler (port 6543), used by the app |
| `DATABASE_URL_SESSION` | Session pooler (port 5432), used by migrations and scripts |
| `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET` | Storage bucket over its S3 API |
| `CRON_SECRET` | Bearer token for the daily `/api/cron/db-ping` |
| `SITE_URL` | Optional. Public address for canonical links, sitemap and share cards (defaults to the Vercel production domain) |

## Where things are

- `src/app` – pages. Public: `/`, `/about`, `/blog`, `/blog/[slug]`. Admin: `/admin` (blog posts, profile).
- `src/data/site.ts` – default copy, nav, hero video paths. `store.ts` – About page content (saved overrides over the defaults). `blog.ts` – blog posts.
- `src/app/site.css` – public site styles. `src/app/admin/admin.css` – admin styles.
- `src/app/media/[...key]` – serves bucket files at `/media/uploads/…`.
- `db/migrations` – SQL migrations, applied in order by `npm run db:migrate`.

## Scripts

- `npm run admin:user -- <email>` – create an admin, or reset one's password.
- `npm run admin:unblock [-- <email or IP>]` – list sign-in lockouts, or clear one.
- `node scripts/upload-media.mjs <file>…` – upload files (e.g. hero videos) to the bucket and print their `/media` paths.
