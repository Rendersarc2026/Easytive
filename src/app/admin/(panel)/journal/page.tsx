import type { Metadata } from "next";
import { addArticle, deleteArticle, saveArticle } from "../actions";
import { articleDrafts, articlesOf, bodyToText, photoBank, photoOptions, getOverrides } from "@/data/store";

export const metadata: Metadata = { title: "Journal · Easytive admin" };

// Articles are stored with photo *keys*; rows prefill from the draft list that
// the actions also mutate, so form indexes stay in step with the saved file.
// Each article is one edit form; its Drop button is a separate sibling form
// (HTML forbids a form inside a form).
export default async function JournalPage() {
  const o = await getOverrides();
  const drafts = articleDrafts(o);
  const shown = articlesOf(o); // what readers get, images resolved

  return (
    <>
      <div className="a-toplabel">Journal</div>
      <h1>Journal articles</h1>
      <p className="a-lede">
        The list on <code>/blog</code> reads these, and each one opens at <code>/blog/&lt;title-slug&gt;</code>. Dates are
        display strings (12 Oct 2025). Tags and titles render as written; in the body, leave a blank line between paragraphs.
      </p>

      <div className="a-cards">
        <section className="a-card">
          <div className="a-cardhead">
            <h2>{drafts.length} articles</h2>
            <form action={addArticle}>
              <button className="a-btn small ghost" type="submit">
                Add article
              </button>
            </form>
          </div>

          <div className="a-rows">
            {drafts.map((d, i) => (
              <div className="a-row" key={i}>
                <span
                  aria-hidden
                  style={{
                    flex: "none",
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    background: `url(${shown[i].image.src.src}) center/cover`,
                  }}
                />
                <form action={saveArticle} className="a-rowmain">
                  <input type="hidden" name="id" value={i} />
                  <div className="a-grid3">
                    <div className="a-field">
                      <label className="a-label" htmlFor={`ph-${i}`}>
                        Photo
                      </label>
                      <select className="a-input" id={`ph-${i}`} name="photo" defaultValue={d.photo}>
                        <option value="">(unchanged)</option>
                        {photoOptions.map((o2) => (
                          <option key={o2.key} value={o2.key}>
                            {o2.key}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`tg-${i}`}>
                        Tag
                      </label>
                      <input className="a-input" id={`tg-${i}`} name="tag" defaultValue={d.tag} />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`ti-${i}`}>
                        Title
                      </label>
                      <input className="a-input" id={`ti-${i}`} name="title" defaultValue={d.title} required />
                    </div>
                  </div>
                  <div className="a-grid2" style={{ marginTop: 12 }}>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`au-${i}`}>
                        Author
                      </label>
                      <input className="a-input" id={`au-${i}`} name="author" defaultValue={d.author} />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`dt-${i}`}>
                        Date shown
                      </label>
                      <input className="a-input" id={`dt-${i}`} name="date" defaultValue={d.date} />
                    </div>
                  </div>
                  <div className="a-field" style={{ marginTop: 12 }}>
                    <label className="a-label" htmlFor={`bd-${i}`}>
                      Body
                    </label>
                    <textarea className="a-input area" id={`bd-${i}`} name="body" rows={8} defaultValue={bodyToText(d.body)} />
                  </div>
                  <div className="a-actions" style={{ marginTop: 12 }}>
                    <a className="a-btn small ghost" href={`/blog/${shown[i].slug}`} target="_blank" rel="noreferrer">
                      View
                    </a>
                    <button className="a-btn small" type="submit">
                      Save
                    </button>
                  </div>
                </form>
                <div className="a-rowside">
                  <form action={deleteArticle}>
                    <input type="hidden" name="id" value={i} />
                    <button className="a-btn small subtle" type="submit">
                      Drop
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="a-card">
          <p className="a-cardhint">
            Photo bank keys ({Object.keys(photoBank).length} available): {Object.keys(photoBank).join(" · ")}
          </p>
        </section>
      </div>
    </>
  );
}
