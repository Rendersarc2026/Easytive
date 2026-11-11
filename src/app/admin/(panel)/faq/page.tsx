import type { Metadata } from "next";
import { addFaqGroup, addFaqItem, deleteFaqGroup, saveFaqGroup } from "../actions";
import { faqDrafts, getOverrides } from "@/data/store";
import { ConfirmButton } from "@/app/admin/buttons";

export const metadata: Metadata = { title: "FAQ · Easytive admin" };

// Answers support **word** bold markers — the public accordion renders them.
// A group's questions all save together (its items arrive as parallel q/a
// arrays); "Drop" checkboxes remove rows on save, the small + button appends a
// blank row via its own form.
export default async function FaqPage() {
  const groups = faqDrafts(await getOverrides());

  return (
    <>
      <div className="a-toplabel">FAQ</div>
      <h1>FAQ groups &amp; questions</h1>
      <p className="a-lede">
        Renders on the FAQ accordion (full-site mode). Wrap a word in <code>**double stars**</code> to bold it in the answer.
        Saving a group saves every visible question — tick Drop next to a question to remove it.
      </p>

      <div className="a-cards">
        {groups.map((g, i) => (
          <section className="a-card" key={i}>
            <div className="a-cardhead">
              <h2>{g.group || `Group ${i + 1}`}</h2>
              <span className="a-idx">
                {g.items.length} questions
              </span>
            </div>

            <form action={saveFaqGroup}>
              <input type="hidden" name="id" value={i} />
              <div className="a-grid2">
                <div className="a-field">
                  <label className="a-label" htmlFor={`g-${i}`}>
                    Group name
                  </label>
                  <input className="a-input" id={`g-${i}`} name="group" defaultValue={g.group} />
                </div>
              </div>

              <div className="a-rows a-form" style={{ marginTop: 14 }}>
                {g.items.map((it, k) => (
                  <div className="a-row" key={k}>
                    <div className="a-rowmain">
                      <div className="a-field">
                        <label className="a-label" htmlFor={`gq-${i}-${k}`}>
                          Question
                        </label>
                        <input className="a-input" id={`gq-${i}-${k}`} name="q" defaultValue={it.q} />
                      </div>
                      <div className="a-field" style={{ marginTop: 10 }}>
                        <label className="a-label" htmlFor={`ga-${i}-${k}`}>
                          Answer (bold with **word**)
                        </label>
                        <textarea className="a-input area" id={`ga-${i}-${k}`} name="a" defaultValue={it.a} />
                      </div>
                    </div>
                    <label className="a-check" title="Remove this question on save">
                      <input type="checkbox" name="dropItem" value={k} /> drop
                    </label>
                  </div>
                ))}
              </div>

              <div className="a-actions" style={{ marginTop: 14 }}>
                <button className="a-btn small" type="submit">
                  Save group
                </button>
              </div>
            </form>

            <div className="a-actions" style={{ marginTop: 10, borderTop: "1px solid #f0ede6", paddingTop: 10 }}>
              <form action={addFaqItem}>
                <input type="hidden" name="id" value={i} />
                <button className="a-btn small ghost" type="submit">
                  Add question
                </button>
              </form>
              <form action={deleteFaqGroup}>
                <input type="hidden" name="id" value={i} />
                <ConfirmButton title="Remove this question group?" message="The group and all its questions come off the site straight away. This can't be undone." confirmLabel="Remove group" danger>
                  Drop group
                </ConfirmButton>
              </form>
            </div>
          </section>
        ))}

        <section className="a-card">
          <div className="a-cardhead">
            <h2>New group</h2>
          </div>
          <form action={addFaqGroup} className="a-form">
            <div className="a-grid2">
              <div className="a-field">
                <label className="a-label" htmlFor="ng">
                  Group name
                </label>
                <input className="a-input" id="ng" name="group" required placeholder="e.g. Subscriptions" />
              </div>
            </div>
            <div className="a-actions">
              <button className="a-btn small" type="submit">
                Add group
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
