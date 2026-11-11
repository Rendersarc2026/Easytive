// Blog posts, stored in easytive.blog_posts (one row per post). Cover images
// are objects in the storage bucket; a post keeps the object key and the site
// serves it at /media/<key>.
//
// Deleting is a soft delete: the row's is_active goes false and every read
// here only sees active rows. Nothing is removed from the database or the
// bucket, so a deleted post (and its cover) can be brought back.
//
// Reads are cached under the "blog" tag; every admin save calls
// updateTag("blog") so the blog and the admin list are fresh straight away.
// Writes check the session themselves, so no code path can change a post
// without a signed-in account.

import { cacheLife, cacheTag } from "next/cache";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export type BlogPost = {
  id: number;
  /** URL part (/blog/<slug>); null for an untitled draft. */
  slug: string | null;
  title: string;
  tag: string;
  author: string;
  /** "YYYY-MM-DD", or "" when no date is set. For the admin's date input. */
  publishedOn: string;
  /** The date as readers see it: "12 Oct 2026". */
  date: string;
  body: string[];
  /** /media path of the cover image, or null. */
  cover: string | null;
  coverAlt: string;
};

export type BlogPostRow = {
  id: string; // bigint comes back as a string
  slug: string | null;
  title: string;
  tag: string;
  author: string;
  published_on: string | null;
  body: string;
  cover_key: string | null;
  cover_alt: string;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-12" → "12 Oct 2026". */
export function formatPostDate(iso: string | null): string {
  const m = iso && /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : "";
}

/** Paragraphs → admin textarea text (blank line between), and back. */
export const bodyToText = (body: string[]) => body.join("\n\n");
export const textToBody = (text: string) =>
  text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);

export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "article"
  );
}

function toPost(r: BlogPostRow): BlogPost {
  return {
    id: Number(r.id),
    slug: r.slug,
    title: r.title,
    tag: r.tag,
    author: r.author,
    publishedOn: r.published_on ?? "",
    date: formatPostDate(r.published_on),
    body: textToBody(r.body),
    cover: r.cover_key ? `/media/${r.cover_key}` : null,
    coverAlt: r.cover_alt || r.title,
  };
}

export type PublishedPost = BlogPost & { slug: string };

/** How many posts a list shows at first, and loads on each scroll. */
export const PAGE_SIZE = 9;
const MAX_PAGE = 90;

// Lists page by the last post seen (keyset paging), not by an offset, so
// page 12 is as quick as page 1. A cursor is that post's sort key:
// "<date>_<id>", with "infinity" standing in for an undated draft (drafts
// sort first).
const CURSOR = /^(\d{4}-\d{2}-\d{2}|infinity)_(\d{1,18})$/;

export function isCursor(value: unknown): value is string {
  return typeof value === "string" && CURSOR.test(value);
}

export type PostPage<T extends BlogPost = BlogPost> = { posts: T[]; next: string | null };

/** One page of what readers see (posts with a title), newest first. */
export async function getPublicPage(cursor: string | null, limit: number = PAGE_SIZE): Promise<PostPage<PublishedPost>> {
  return (await postsPage("public", cursor, limit)) as PostPage<PublishedPost>;
}

/** One page of every post, untitled drafts first, then newest first. For the admin. */
export async function getAdminPage(cursor: string | null, limit: number = PAGE_SIZE): Promise<PostPage> {
  return postsPage("all", cursor, limit);
}

async function postsPage(scope: "public" | "all", cursor: string | null, limit: number): Promise<PostPage> {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  const sql = db();
  const size = Math.min(Math.max(1, Math.floor(limit)), MAX_PAGE);
  const at = cursor ? CURSOR.exec(cursor) : null;
  const rows = await sql<BlogPostRow[]>`
    select id, slug, title, tag, author, published_on::text as published_on, body, cover_key, cover_alt
    from easytive.blog_posts
    where is_active
      ${scope === "public" ? sql`and slug is not null` : sql``}
      ${at ? sql`and (coalesce(published_on, 'infinity'::date), id) < (${at[1]}::date, ${at[2]}::bigint)` : sql``}
    order by coalesce(published_on, 'infinity'::date) desc, id desc
    limit ${size + 1}
  `;
  const page = rows.slice(0, size);
  const last = page[page.length - 1];
  return {
    posts: page.map(toPost),
    next: rows.length > size && last ? `${last.published_on ?? "infinity"}_${last.id}` : null,
  };
}

/** One published post by its address. */
export async function getPostBySlug(slug: string): Promise<PublishedPost | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  const [row] = await db()<BlogPostRow[]>`
    select id, slug, title, tag, author, published_on::text as published_on, body, cover_key, cover_alt
    from easytive.blog_posts
    where is_active and slug = ${slug}
  `;
  return row ? (toPost(row) as PublishedPost) : undefined;
}

/** Every published post's address (for prerendering /blog/<slug>). */
export async function getPublishedSlugs(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  const rows = await db()<{ slug: string }[]>`select slug from easytive.blog_posts where is_active and slug is not null`;
  return rows.map((r) => r.slug);
}

/** How many posts are live and how many are untitled drafts. */
export async function getPostCounts(): Promise<{ live: number; drafts: number }> {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  const [row] = await db()<{ live: number; drafts: number }[]>`
    select count(*) filter (where slug is not null)::int as live, count(*) filter (where slug is null)::int as drafts
    from easytive.blog_posts
    where is_active
  `;
  return row;
}

// ---- Writes (admin only) -----------------------------------------------------

export type PostInput = {
  title: string;
  tag: string;
  author: string;
  publishedOn: string; // "YYYY-MM-DD" or ""
  body: string[];
  /** New cover object key, or undefined to keep the current one. */
  coverKey?: string;
};

/** A slug for `title` that no other post uses: "title", else "title-2", "title-3"… */
async function freeSlug(title: string, id: number): Promise<string> {
  const base = slugify(title);
  const taken = new Set(
    (
      await db()<{ slug: string }[]>`
        select slug from easytive.blog_posts
        where is_active and id <> ${id} and (slug = ${base} or slug like ${base + "-%"})
      `
    ).map((r) => r.slug),
  );
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
}

/** Adds a complete post and returns its id. */
export async function createPost(input: PostInput & { coverKey: string }): Promise<number> {
  const user = await requireUser();
  const slug = await freeSlug(input.title, 0);
  const [row] = await db()<{ id: string }[]>`
    insert into easytive.blog_posts (slug, title, tag, author, published_on, body, cover_key, cover_alt, updated_by)
    values (${slug}, ${input.title}, ${input.tag}, ${input.author}, ${input.publishedOn}, ${input.body.join("\n\n")}, ${input.coverKey}, ${input.title}, ${user.id})
    returning id
  `;
  return Number(row.id);
}

/** Saves a post. Returns false if the post is gone (deleted meanwhile). */
export async function updatePost(id: number, input: PostInput): Promise<boolean> {
  const user = await requireUser();
  const slug = input.title ? await freeSlug(input.title, id) : null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(input.publishedOn) ? input.publishedOn : null;
  const [row] = await db()`
    update easytive.blog_posts p set
      slug = ${slug},
      title = ${input.title},
      tag = ${input.tag},
      author = ${input.author},
      published_on = ${date},
      body = ${input.body.join("\n\n")},
      cover_key = coalesce(${input.coverKey ?? null}, p.cover_key),
      cover_alt = ${input.title},
      updated_at = now(),
      updated_by = ${user.id}
    where p.id = ${id} and p.is_active
    returning p.id
  `;
  return Boolean(row);
}

/** True if the post already has a cover image. */
export async function hasCover(id: number): Promise<boolean> {
  const [row] = await db()`select 1 from easytive.blog_posts where id = ${id} and is_active and cover_key is not null`;
  return Boolean(row);
}

/** Soft-deletes a post: it disappears from the blog and the admin, but the row and its cover stay. */
export async function deletePost(id: number): Promise<void> {
  const user = await requireUser();
  await db()`
    update easytive.blog_posts
    set is_active = false, updated_at = now(), updated_by = ${user.id}
    where id = ${id} and is_active
  `;
}

/** When the blog last changed, and who changed it. For the dashboard. */
export async function lastBlogEdit(): Promise<{ at: Date; email: string | null } | null> {
  const [row] = await db()<{ at: Date; email: string | null }[]>`
    select p.updated_at as at, u.email
    from easytive.blog_posts p
    left join easytive.admin_users u on u.id = p.updated_by
    where p.is_active
    order by p.updated_at desc
    limit 1
  `;
  return row ?? null;
}
