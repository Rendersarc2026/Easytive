import type { Metadata } from "next";
import Image from "next/image";
import { ConfirmButton, Spinner, SubmitButton } from "@/app/admin/buttons";
import { bodyToText, getAllPosts, type BlogPost } from "@/data/blog";
import { requireUser } from "@/lib/auth";
import { addArticle, deleteArticle, saveArticle } from "../actions";
import { Notice, PhotoField } from "../fields";

export const metadata: Metadata = { title: "Blog · Easytive admin" };

const icon = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

/** Rough reading time at 200 words a minute. */
function readMinutes(body: string[]): number {
  const words = body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function NewPostButton({ label = "New post" }: { label?: string }) {
  return (
    <form action={addArticle}>
      <SubmitButton className="a-btn" pendingLabel="Adding…">
        {label}
      </SubmitButton>
    </form>
  );
}

function Cover({ post }: { post: BlogPost }) {
  if (!post.cover) {
    return (
      <span className="bp-cover empty" aria-hidden>
        No cover
      </span>
    );
  }
  return <Image className="bp-cover" src={post.cover} alt="" width={160} height={100} sizes="320px" />;
}

// Blog posts from easytive.blog_posts, newest first (the order /blog uses;
// untitled drafts sit at the top). Each post is a row that opens into its
// edit form; View and Delete sit beside it as sibling forms/links (HTML
// forbids a form inside a form). Rows are addressed by their database id.
export default async function BlogAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireUser();
  const posts = await getAllPosts();
  const live = posts.filter((p) => p.slug).length;
  const drafts = posts.length - live;

  return (
    <>
      <header className="bp-head">
        <div>
          <h1>Blog posts</h1>
          <p className="bp-count">
            {live} live on <a href="/blog" target="_blank" rel="noreferrer">/blog</a>
            {drafts > 0 && <>, {drafts} {drafts === 1 ? "draft" : "drafts"}</>}
          </p>
        </div>
        <NewPostButton />
      </header>
      <p className="a-lede">Newest first, by the post date. A post goes live once it has a title, and every save shows on the site straight away.</p>
      <Notice searchParams={searchParams} />

      {posts.length === 0 ? (
        <div className="bp-empty">
          <h2>No posts yet</h2>
          <p>Write the first one: give it a title, a cover photo and a few paragraphs.</p>
          <NewPostButton label="Write a post" />
        </div>
      ) : (
        <div className="bp-list">
          {posts.map((d) => (
            <article className="bp" key={d.id}>
              <details className="bp-main" open={!d.title}>
                <summary className="bp-sum">
                  <Cover post={d} />
                  <span className="bp-text">
                    <span className="bp-chips">
                      <span className={`bp-status${d.slug ? " live" : ""}`}>{d.slug ? "Live" : "Draft"}</span>
                      {d.tag && <span className="bp-tag">{d.tag}</span>}
                    </span>
                    <strong className="bp-title">{d.title || "Untitled post"}</strong>
                    <span className="bp-meta">
                      {d.author && <span>{d.author}</span>}
                      <span>{d.date || "No date"}</span>
                      {d.body.length > 0 && <span>{readMinutes(d.body)} min read</span>}
                    </span>
                  </span>
                  <span className="bp-edit" aria-hidden>
                    <span className="when-closed">Edit</span>
                    <span className="when-open">Close</span>
                  </span>
                </summary>
                <form action={saveArticle} className="a-form bp-form">
                  <input type="hidden" name="id" value={d.id} />
                  <div className="a-field">
                    <label className="a-label" htmlFor={`ti-${d.id}`}>
                      Title<span className="a-req" aria-hidden> *</span>
                    </label>
                    <input className="a-input" id={`ti-${d.id}`} name="title" defaultValue={d.title} required maxLength={200} />
                    <span className="a-fielderr">Add a title.</span>
                  </div>
                  <div className="a-grid3">
                    <div className="a-field">
                      <label className="a-label" htmlFor={`tg-${d.id}`}>
                        Tag
                      </label>
                      <input className="a-input" id={`tg-${d.id}`} name="tag" defaultValue={d.tag} placeholder="Habits" maxLength={80} />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`au-${d.id}`}>
                        Author<span className="a-req" aria-hidden> *</span>
                      </label>
                      <input className="a-input" id={`au-${d.id}`} name="author" defaultValue={d.author} required maxLength={120} />
                      <span className="a-fielderr">Add the author.</span>
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`dt-${d.id}`}>
                        Date<span className="a-req" aria-hidden> *</span>
                      </label>
                      <input className="a-input" id={`dt-${d.id}`} name="date" type="date" defaultValue={d.publishedOn} required />
                      <span className="a-fielderr">Pick a date.</span>
                    </div>
                  </div>
                  <PhotoField current={d.cover ?? ""} id={`ar${d.id}`} label="Cover photo" required={!d.cover} />
                  <div className="a-field">
                    <label className="a-label" htmlFor={`bd-${d.id}`}>
                      Post<span className="a-req" aria-hidden> *</span>
                    </label>
                    <textarea className="a-input area tall" id={`bd-${d.id}`} name="body" rows={12} defaultValue={bodyToText(d.body)} required />
                    <span className="a-fielderr">Write the post.</span>
                    <span className="a-cardhint">Leave a blank line between paragraphs.</span>
                  </div>
                  <div className="a-actions">
                    <SubmitButton className="a-btn small" pendingLabel="Saving…">
                      Save post
                    </SubmitButton>
                    {d.slug && (
                      <a className="a-btn small ghost" href={`/blog/${d.slug}`} target="_blank" rel="noreferrer">
                        View on site
                      </a>
                    )}
                  </div>
                </form>
              </details>
              <div className="bp-side">
                {d.slug && (
                  <a className="bp-icon" href={`/blog/${d.slug}`} target="_blank" rel="noreferrer" title="View on site">
                    <svg {...icon}>
                      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                    </svg>
                    <span className="a-sr">View on site</span>
                  </a>
                )}
                <form action={deleteArticle}>
                  <input type="hidden" name="id" value={d.id} />
                  <ConfirmButton
                    className="bp-icon danger"
                    title={`Delete "${d.title || "this post"}"?`}
                    message="It comes off the blog straight away, with its cover photo. This can't be undone."
                    confirmLabel="Delete"
                    pendingLabel={<Spinner label="Deleting" />}
                    danger
                  >
                    <svg {...icon}>
                      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
                    </svg>
                    <span className="a-sr">Delete</span>
                  </ConfirmButton>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
