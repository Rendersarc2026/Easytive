import type { Metadata } from "next";
import { ConfirmButton, SubmitButton } from "@/app/admin/buttons";
import { bodyToText, getAllPosts } from "@/data/blog";
import { requireUser } from "@/lib/auth";
import { addArticle, deleteArticle, saveArticle } from "../actions";
import { Notice, PhotoField, Thumb } from "../fields";

export const metadata: Metadata = { title: "Blog · Easytive admin" };

// Blog posts from easytive.blog_posts, newest first (the order /blog uses;
// untitled drafts sit at the top). Each post is a collapsed row that opens
// into its edit form; its Delete button is a sibling form (HTML forbids a
// form inside a form). Rows are addressed by their database id.
export default async function BlogAdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireUser();
  const posts = await getAllPosts();

  return (
    <>
      <div className="a-toplabel">Blog</div>
      <h1>Blog posts</h1>
      <p className="a-lede">
        Posts appear on <a href="/blog" target="_blank">/blog</a> newest first, by the date you give them, and each opens
        at its own address made from the title. Posts without a title stay hidden. Changes appear on the site as soon as you
        save.
      </p>
      <Notice searchParams={searchParams} />

      <section className="a-card">
        <div className="a-cardhead">
          <h2>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </h2>
          <form action={addArticle}>
            <SubmitButton className="a-btn small" pendingLabel="Adding…">
              New post
            </SubmitButton>
          </form>
        </div>

        <div className="a-rows">
          {posts.map((d) => (
            <div className="a-row a-post" key={d.id}>
              <details className="a-rowmain" open={!d.title}>
                <summary>
                  <Thumb photo={d.cover ?? undefined} size={52} />
                  <span className="a-postsum">
                    <strong>{d.title || "Untitled post"}</strong>
                    <span className="a-cardhint">{[d.tag, d.author, d.date].filter(Boolean).join(" · ") || "Not filled in yet"}</span>
                  </span>
                  <span className="a-edit" aria-hidden>
                    <span className="when-closed">Edit</span>
                    <span className="when-open">Close</span>
                  </span>
                </summary>
                <form action={saveArticle} className="a-form a-postform">
                  <input type="hidden" name="id" value={d.id} />
                  <div className="a-field">
                    <label className="a-label" htmlFor={`ti-${d.id}`}>
                      Title
                    </label>
                    <input className="a-input" id={`ti-${d.id}`} name="title" defaultValue={d.title} required maxLength={200} />
                  </div>
                  <div className="a-grid3">
                    <div className="a-field">
                      <label className="a-label" htmlFor={`tg-${d.id}`}>
                        Tag
                      </label>
                      <input className="a-input" id={`tg-${d.id}`} name="tag" defaultValue={d.tag} placeholder="Habits" />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`au-${d.id}`}>
                        Author
                      </label>
                      <input className="a-input" id={`au-${d.id}`} name="author" defaultValue={d.author} />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`dt-${d.id}`}>
                        Date
                      </label>
                      <input className="a-input" id={`dt-${d.id}`} name="date" type="date" defaultValue={d.publishedOn} />
                    </div>
                  </div>
                  <PhotoField current={d.cover ?? ""} id={`ar${d.id}`} label="Cover photo" />
                  <div className="a-field">
                    <label className="a-label" htmlFor={`bd-${d.id}`}>
                      Post
                    </label>
                    <textarea className="a-input area tall" id={`bd-${d.id}`} name="body" rows={12} defaultValue={bodyToText(d.body)} />
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
              <div className="a-rowside">
                <form action={deleteArticle}>
                  <input type="hidden" name="id" value={d.id} />
                  <ConfirmButton title={`Delete "${d.title || "this post"}"?`} message="It comes off the blog straight away. This can't be undone." confirmLabel="Delete" danger>
                    Delete
                  </ConfirmButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
