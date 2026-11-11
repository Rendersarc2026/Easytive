import type { Metadata } from "next";
import { addReview, deleteReview, saveReview, saveReviewCount } from "../actions";
import { getOverrides, reviewDrafts, siteDataOf } from "@/data/store";
import { products, type ProductKey } from "@/data/site";
import { ConfirmButton } from "@/app/admin/buttons";

export const metadata: Metadata = { title: "Reviews · Easytive admin" };

const productKeys = Object.keys(products) as ProductKey[];
const niceName: Record<string, string> = Object.fromEntries(Object.entries(products).map(([k, v]) => [k, v.name]));

// Big-quotes carousel data: the counter ("12,400+") and the six editable
// testimonials. Each review is one form + one drop form.
export default async function ReviewsPage() {
  const o = await getOverrides();
  const drafts = reviewDrafts(o);
  const reviewCount = siteDataOf(o).reviewCount;

  return (
    <>
      <div className="a-toplabel">Social proof</div>
      <h1>Reviews</h1>
      <p className="a-lede">
        Feeds the rotating reviews section. Keep quotes real — these are claims about health products, so placeholders must be
        replaced with verified testimonials before launch.
      </p>

      <div className="a-cards">
        <section className="a-card">
          <div className="a-cardhead">
            <h2>Counter</h2>
          </div>
          <form action={saveReviewCount} className="a-form">
            <div className="a-grid2">
              <div className="a-field">
                <label className="a-label" htmlFor="rc">
                  Reviews headline (e.g. 12,400+)
                </label>
                <input className="a-input" id="rc" name="reviewCount" defaultValue={reviewCount} required />
              </div>
              <span className="a-check">Shown next to the rotating quotes.</span>
            </div>
            <div className="a-actions">
              <button className="a-btn small" type="submit">
                Save counter
              </button>
            </div>
          </form>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <h2>{drafts.length} reviews</h2>
          </div>
          <div className="a-rows">
            {drafts.map((r, i) => (
              <div className="a-row" key={i}>
                <form action={saveReview} className="a-rowmain">
                  <input type="hidden" name="id" value={i} />
                  <div className="a-field">
                    <label className="a-label" htmlFor={`q-${i}`}>
                      Quote
                    </label>
                    <textarea className="a-input area" id={`q-${i}`} name="quote" defaultValue={r.quote} required />
                  </div>
                  <div className="a-grid3" style={{ marginTop: 12 }}>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`n-${i}`}>
                        Name
                      </label>
                      <input className="a-input" id={`n-${i}`} name="name" defaultValue={r.name} required />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`ab-${i}`}>
                        About (profession, age · city)
                      </label>
                      <input className="a-input" id={`ab-${i}`} name="about" defaultValue={r.about} />
                    </div>
                    <div className="a-field">
                      <label className="a-label" htmlFor={`pr-${i}`}>
                        Product
                      </label>
                      <select className="a-input" id={`pr-${i}`} name="product" defaultValue={r.product}>
                        {productKeys.map((k) => (
                          <option key={k} value={k}>
                            {niceName[k] ?? k}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="a-actions" style={{ marginTop: 12 }}>
                    <button className="a-btn small" type="submit">
                      Save
                    </button>
                  </div>
                </form>
                <div className="a-rowside">
                  <form action={deleteReview}>
                    <input type="hidden" name="id" value={i} />
                    <ConfirmButton title="Remove this review?" message="It comes off the site straight away. This can't be undone." confirmLabel="Remove" danger>
                      Drop
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="a-card">
          <div className="a-cardhead">
            <h2>Add a review</h2>
          </div>
          <form action={addReview} className="a-form">
            <div className="a-field">
              <label className="a-label" htmlFor="aq">
                Quote
              </label>
              <textarea className="a-input area" id="aq" name="quote" required />
            </div>
            <div className="a-grid3">
              <div className="a-field">
                <label className="a-label" htmlFor="an">
                  Name
                </label>
                <input className="a-input" id="an" name="name" required />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="aab">
                  About
                </label>
                <input className="a-input" id="aab" name="about" />
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="apr">
                  Product
                </label>
                <select className="a-input" id="apr" name="product" defaultValue="daily">
                  {productKeys.map((k) => (
                    <option key={k} value={k}>
                      {niceName[k] ?? k}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="a-actions">
              <button className="a-btn small" type="submit">
                Add review
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
