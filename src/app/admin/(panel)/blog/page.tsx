import type { Metadata } from "next";
import { cookies } from "next/headers";
import { InfiniteMore } from "@/components/InfiniteMore";
import { getAdminPage, getPostCounts, lastBlogEdit, PAGE_SIZE } from "@/data/blog";
import { requireUser } from "@/lib/auth";
import { Notice } from "../fields";
import { loadMoreAdminPostsAction } from "./load-more";
import { PostFields, PostRow } from "./post-row";
import { BlogViewProvider, ComposePanel, NewPostButton, PostList, ViewToggle } from "./view";

export const metadata: Metadata = { title: "Blog · Easytive admin" };

// Blog posts from easytive.blog_posts, newest first (the order /blog uses).
// The first 9 render here; the rest load 9 at a time as the list is
// scrolled (load-more.tsx). "New post" opens an empty form; the post is only
// created when that form is submitted.
export default async function BlogAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireUser();
  const [page, counts, lastEdit, jar] = await Promise.all([getAdminPage(null), getPostCounts(), lastBlogEdit(), cookies()]);
  // Grid unless the person picked the list last time.
  const view = jar.get("blog-view")?.value === "list" ? "list" : "grid";
  const total = counts.live + counts.drafts;
  // Changes whenever a post is added, edited or deleted, so the scroller
  // refreshes the pages it already loaded.
  const version = `${total}:${lastEdit?.at.getTime() ?? 0}`;

  return (
    <BlogViewProvider initial={view}>
      <header className="bp-head">
        <div>
          <h1>Blog posts</h1>
          <p className="bp-count">
            {counts.live} live on <a href="/blog" target="_blank" rel="noreferrer">/blog</a>
            {counts.drafts > 0 && <>, {counts.drafts} {counts.drafts === 1 ? "draft" : "drafts"}</>}
          </p>
        </div>
        <div className="bp-tools">
          {total > 0 && <ViewToggle />}
          <NewPostButton />
        </div>
      </header>
      <p className="a-lede">Newest first, by the post date. Every save shows on the site straight away.</p>
      <Notice searchParams={searchParams} />

      <ComposePanel>
        <PostFields idPrefix="new" autoFocus />
      </ComposePanel>

      {total === 0 ? (
        <div className="bp-empty">
          <h2>No posts yet</h2>
          <p>Write the first one: give it a title, a cover photo and a few paragraphs.</p>
          <NewPostButton label="Write a post" />
        </div>
      ) : (
        <PostList>
          {page.posts.map((p) => (
            <PostRow key={p.id} post={p} />
          ))}
          <InfiniteMore next={page.next} loadAction={loadMoreAdminPostsAction} pageSize={PAGE_SIZE} version={version} className="a-more" />
        </PostList>
      )}
    </BlogViewProvider>
  );
}
