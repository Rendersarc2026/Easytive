// Blog posts, stored in easytive.blog_posts (one row per post). Cover images
// are objects in the storage bucket; a post keeps the object key and the site
// serves it at /media/<key>.
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

async function readPosts(): Promise<BlogPost[]> {
  const rows = await db()<BlogPostRow[]>`
    select id, slug, title, tag, author, published_on::text as published_on, body, cover_key, cover_alt
    from easytive.blog_posts
    order by published_on desc nulls first, id desc
  `;
  return rows.map(toPost);
}

/** Every post, drafts included, newest first. For the admin. */
export async function getAllPosts(): Promise<BlogPost[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("blog");
  return readPosts();
}

export type PublishedPost = BlogPost & { slug: string };

/** Posts readers can see (anything with a title), newest first. */
export async function getPublishedPosts(): Promise<PublishedPost[]> {
  return (await getAllPosts()).filter((p): p is PublishedPost => p.slug !== null);
}

export async function getPostBySlug(slug: string): Promise<PublishedPost | undefined> {
  return (await getPublishedPosts()).find((p) => p.slug === slug);
}

// ---- Writes (admin only) -----------------------------------------------------

/** Adds an empty, untitled draft and returns its id. */
export async function createDraft(): Promise<number> {
  const user = await requireUser();
  const [row] = await db()<{ id: string }[]>`
    insert into easytive.blog_posts (updated_by) values (${user.id}) returning id
  `;
  return Number(row.id);
}

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
        where id <> ${id} and (slug = ${base} or slug like ${base + "-%"})
      `
    ).map((r) => r.slug),
  );
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
}

/**
 * Saves a post. Returns the cover key it replaced (so the caller can remove
 * the old image from the bucket), or null. Returns false if the post is gone.
 */
export async function updatePost(id: number, input: PostInput): Promise<string | null | false> {
  const user = await requireUser();
  const slug = input.title ? await freeSlug(input.title, id) : null;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(input.publishedOn) ? input.publishedOn : null;
  const [row] = await db()<{ old_cover: string | null }[]>`
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
    from (select cover_key from easytive.blog_posts where id = ${id} for update) old
    where p.id = ${id}
    returning old.cover_key as old_cover
  `;
  if (!row) return false;
  return input.coverKey && row.old_cover !== input.coverKey ? row.old_cover : null;
}

/** True if the post already has a cover image. */
export async function hasCover(id: number): Promise<boolean> {
  const [row] = await db()`select 1 from easytive.blog_posts where id = ${id} and cover_key is not null`;
  return Boolean(row);
}

/** Deletes a post and returns its cover key (to remove from the bucket), or null. */
export async function deletePost(id: number): Promise<string | null> {
  await requireUser();
  const [row] = await db()<{ cover_key: string | null }[]>`
    delete from easytive.blog_posts where id = ${id} returning cover_key
  `;
  return row?.cover_key ?? null;
}

/** When the blog last changed, and who changed it. For the dashboard. */
export async function lastBlogEdit(): Promise<{ at: Date; email: string | null } | null> {
  const [row] = await db()<{ at: Date; email: string | null }[]>`
    select p.updated_at as at, u.email
    from easytive.blog_posts p
    left join easytive.admin_users u on u.id = p.updated_by
    order by p.updated_at desc
    limit 1
  `;
  return row ?? null;
}
