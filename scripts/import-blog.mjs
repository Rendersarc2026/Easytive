// One-off: copies the blog posts saved in site_content (key 'articles') into
// easytive.blog_posts, and uploads any built-in cover photos to the storage
// bucket so every cover lives there.
//   npm run db:migrate && node scripts/import-blog.mjs
//
// Does nothing if blog_posts already has rows. Empty drafts (no title, no
// text) are skipped. The old site_content row is left as it is; nothing reads
// it any more, and it can be deleted once the new blog is deployed.

import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AwsClient } from "aws4fetch";
import postgres from "postgres";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const file of [".env", ".env.local"]) {
  try {
    process.loadEnvFile(path.join(root, file));
  } catch {
    // file absent: fine, the variables may already be in the environment
  }
}

const { S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET } = process.env;
const url = process.env.DATABASE_URL_SESSION ?? process.env.DATABASE_URL;
if (!url || !S3_ENDPOINT || !S3_REGION || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_BUCKET) {
  console.error("DATABASE_URL and the S3_* storage settings must be set in .env.");
  process.exit(1);
}

const s3 = new AwsClient({ accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY, region: S3_REGION, service: "s3" });
const sql = postgres(url, { max: 1, prepare: false, ssl: "require", onnotice: () => {} });

// Built-in photos the old posts could point at, by key (src/assets/brand/<key>.jpg).
const BANK_ALT = {
  "bottle-hand": "A hand holding a clear Easytive bottle in warm light",
  "hotel-morning": "A woman in a robe sipping from a mug on a hotel bed",
  "logo-sketch": "A pencil construction sketch of the Easytive mark",
};
const MEDIA = /^\/media\/(uploads\/\d{4}\/[0-9a-f-]{36}\.(?:jpg|png|webp|avif))$/;
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12 };

/** "12 Oct 2026" → "2026-10-12"; anything else → null. */
function isoDate(text) {
  const m = /^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/i.exec((text ?? "").trim());
  const month = m && MONTHS[m[2].toLowerCase()];
  return month ? `${m[3]}-${String(month).padStart(2, "0")}-${m[1].padStart(2, "0")}` : null;
}

function slugify(title) {
  return (
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "article"
  );
}

/** Uploads a built-in photo to the bucket and returns its key. */
async function uploadBankPhoto(key) {
  const bytes = await fs.readFile(path.join(root, "src", "assets", "brand", `${key}.jpg`));
  const objectKey = `uploads/${new Date().getUTCFullYear()}/${randomUUID()}.jpg`;
  const res = await s3.fetch(`${S3_ENDPOINT.replace(/\/$/, "")}/${S3_BUCKET}/${objectKey}`, {
    method: "PUT",
    body: bytes,
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" },
  });
  if (!res.ok) throw new Error(`upload of ${key} failed: ${res.status} ${(await res.text()).slice(0, 200)}`);
  return objectKey;
}

try {
  const [{ n }] = await sql`select count(*)::int as n from easytive.blog_posts where is_active`;
  if (n > 0) {
    console.log(`blog_posts already has ${n} post(s): nothing to import.`);
    process.exit(0);
  }
  const [row] = await sql`select value from easytive.site_content where key = 'articles'`;
  const list = Array.isArray(row?.value) ? row.value : [];
  const posts = list.filter((a) => (a.title ?? "").trim() || (a.body ?? []).length);
  console.log(`Found ${list.length} saved post(s), importing ${posts.length}.`);

  const seen = new Map();
  const rows = [];
  for (const a of posts) {
    const title = (a.title ?? "").trim();
    let coverKey = null;
    let coverAlt = title;
    if (BANK_ALT[a.photo]) {
      coverKey = await uploadBankPhoto(a.photo);
      coverAlt = BANK_ALT[a.photo];
      console.log(`  uploaded ${a.photo} → ${coverKey}`);
    } else if (MEDIA.test(a.photo ?? "")) {
      coverKey = MEDIA.exec(a.photo)[1];
    }
    let slug = null;
    if (title) {
      const base = slugify(title);
      const count = (seen.get(base) ?? 0) + 1;
      seen.set(base, count);
      slug = count === 1 ? base : `${base}-${count}`;
    }
    rows.push({
      slug,
      title,
      tag: a.tag ?? "",
      author: a.author ?? "",
      published_on: isoDate(a.date),
      body: (a.body ?? []).join("\n\n"),
      cover_key: coverKey,
      cover_alt: coverAlt,
    });
  }

  if (rows.length) {
    await sql`insert into easytive.blog_posts ${sql(rows, "slug", "title", "tag", "author", "published_on", "body", "cover_key", "cover_alt")}`;
  }
  for (const r of rows) console.log(`  ${r.published_on ?? "no date"}  ${r.title || "(untitled)"}`);
  console.log(`Done: ${rows.length} post(s) imported.`);
} catch (err) {
  console.error("Import failed:", err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
