import Image from "next/image";
import { ConfirmButton, Spinner, SubmitButton } from "@/app/admin/buttons";
import { bodyToText, type BlogPost } from "@/data/blog";
import { deleteArticle, saveArticle } from "../actions";
import { PhotoField } from "../photo-field";

// One post in the admin list, and the form fields shared by "edit post" and
// "new post". Rendered by the page for the first 9 posts and by the
// load-more server function for the rest, so every row is identical.

const icon = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

const Req = () => (
  <span className="a-req" aria-hidden>
    {" "}
    *
  </span>
);

/** Rough reading time at 200 words a minute. */
function readMinutes(body: string[]): number {
  const words = body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Title, tag, author, date, cover and text. `post` prefills them (editing); without it they start empty. */
export function PostFields({ post, idPrefix, autoFocus = false }: { post?: BlogPost; idPrefix: string; autoFocus?: boolean }) {
  const id = (name: string) => `${idPrefix}-${name}`;
  return (
    <>
      <div className="a-field">
        <label className="a-label" htmlFor={id("title")}>
          Title
          <Req />
        </label>
        <input className="a-input" id={id("title")} name="title" defaultValue={post?.title} required maxLength={200} autoFocus={autoFocus} />
        <span className="a-fielderr">Add a title.</span>
      </div>
      <div className="a-grid3">
        <div className="a-field">
          <label className="a-label" htmlFor={id("tag")}>
            Tag
          </label>
          <input className="a-input" id={id("tag")} name="tag" defaultValue={post?.tag} placeholder="Habits" maxLength={80} />
        </div>
        <div className="a-field">
          <label className="a-label" htmlFor={id("author")}>
            Author
            <Req />
          </label>
          <input className="a-input" id={id("author")} name="author" defaultValue={post?.author} required maxLength={120} />
          <span className="a-fielderr">Add the author.</span>
        </div>
        <div className="a-field">
          <label className="a-label" htmlFor={id("date")}>
            Date
            <Req />
          </label>
          <input className="a-input" id={id("date")} name="date" type="date" defaultValue={post?.publishedOn} required />
          <span className="a-fielderr">Pick a date.</span>
        </div>
      </div>
      <PhotoField current={post?.cover ?? ""} id={id("cover")} label="Cover photo" required={!post?.cover} />
      <div className="a-field">
        <label className="a-label" htmlFor={id("body")}>
          Post
          <Req />
        </label>
        <textarea className="a-input area tall" id={id("body")} name="body" rows={12} defaultValue={post ? bodyToText(post.body) : undefined} required />
        <span className="a-fielderr">Write the post.</span>
        <span className="a-cardhint">Leave a blank line between paragraphs.</span>
      </div>
    </>
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

/** A post: summary that opens into its edit form, with View and Delete beside it (sibling forms: HTML forbids nesting). */
export function PostRow({ post: d }: { post: BlogPost }) {
  return (
    <article className="bp">
      <details className="bp-main">
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
          <PostFields post={d} idPrefix={`p${d.id}`} />
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
            message="It comes off the blog and this list straight away. It's kept in the database, so it can be restored there if needed."
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
  );
}
