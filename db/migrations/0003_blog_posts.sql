-- Blog posts get their own table: one row per post, edited from /admin/blog.
-- Until now they were a JSON list in site_content (key 'articles') with
-- sample posts in the code. A one-off import copied the existing posts in.
--
-- Cover images live in the storage bucket; cover_key is the object key
-- (uploads/<year>/<uuid>.<ext>), served by this site at /media/<key>.

create table easytive.blog_posts (
  id bigint generated always as identity primary key,
  -- URL part, made from the title. Null while a post is an untitled draft
  -- (drafts are listed in the admin and hidden from readers).
  slug text unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null default '' check (char_length(title) <= 200),
  tag text not null default '' check (char_length(tag) <= 80),
  author text not null default '' check (char_length(author) <= 120),
  -- The date shown on the post; also its place in the list (newest first).
  published_on date,
  -- Paragraphs separated by a blank line.
  body text not null default '' check (char_length(body) <= 100000),
  cover_key text check (cover_key ~ '^uploads/[0-9]{4}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|avif)$'),
  cover_alt text not null default '' check (char_length(cover_alt) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references easytive.admin_users (id) on delete set null,
  check (slug is not null or title = '')
);

-- The order both the blog and the admin list posts in.
create index blog_posts_order_idx on easytive.blog_posts (published_on desc nulls first, id desc);
create index blog_posts_updated_by_idx on easytive.blog_posts (updated_by);

-- Same lock-down as every other table here: private schema, RLS on, no
-- policies, no grants for the API roles. The app connects as the owner.
alter table easytive.blog_posts enable row level security;
revoke all on easytive.blog_posts from public;
revoke all on easytive.blog_posts from anon, authenticated;
