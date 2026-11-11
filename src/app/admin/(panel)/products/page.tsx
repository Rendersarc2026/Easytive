import type { Metadata } from "next";
import { saveProduct } from "../actions";
import { getOverrides, siteDataOf, type ProductsMap } from "@/data/store";

export const metadata: Metadata = { title: "Products · Easytive admin" };

// One form per product. Badge left empty = hidden; the two hex colours are the
// pack gradient layers the site renders, tint is the glow behind the pack.
// One form per product. Badge left empty = hidden; gradients keep the two pack
// layers the site renders (tint = glow behind the pack, l1/l2 = pack surface).
export default async function ProductsPage() {
  const products: ProductsMap = siteDataOf(await getOverrides()).products;

  return (
    <>
      <div className="a-toplabel">Catalog</div>
      <h1>Products</h1>
      <p className="a-lede">
        Names, prices and pack colours for the shop grid. Colors are hex values from the pack artwork (top gradient l1, bottom
        l2, and the glow behind it).
      </p>

      <div className="a-cards">
        {Object.entries(products).map(([key, p]) => {
          return (
            <section className="a-card" key={key}>
              <div className="a-cardhead">
                <h2>{p.name || key}</h2>
                <span className="a-idx">{key}</span>
              </div>
              <form action={saveProduct} className="a-form">
                <input type="hidden" name="key" value={key} />
                <div className="a-grid2">
                  <div className="a-field">
                    <label className="a-label" htmlFor={`f-${key}`}>
                      Name
                    </label>
                    <input className="a-input" id={`f-${key}`} name="name" defaultValue={p.name} required />
                  </div>
                  <div className="a-field">
                    <label className="a-label" htmlFor={`p-${key}`}>
                      Price (Rs.)
                    </label>
                    <input className="a-input" id={`p-${key}`} name="price" type="number" min="0" step="1" defaultValue={p.price} required />
                  </div>
                </div>
                <div className="a-field">
                  <label className="a-label" htmlFor={`d-${key}`}>
                    One-line description
                  </label>
                  <input className="a-input" id={`d-${key}`} name="desc" defaultValue={p.desc} />
                </div>
                <div className="a-grid3">
                  <div className="a-field">
                    <label className="a-label" htmlFor={`b-${key}`}>
                      Badge (leave empty to hide)
                    </label>
                    <input className="a-input" id={`b-${key}`} name="badge" defaultValue={p.badge ?? ""} placeholder="Bestseller" />
                  </div>
                  <div className="a-field">
                    <label className="a-label" htmlFor={`s-${key}`}>
                      Sachet?
                    </label>
                    <label className="a-check">
                      <input id={`s-${key}`} type="checkbox" name="sachet" defaultChecked={p.sachet ?? false} /> renders as a
                      sachet, not a bottle
                    </label>
                  </div>
                </div>
                <div className="a-grid3">
                  {(
                    [
                      ["tint", "Glow behind pack", p.tint],
                      ["l1", "Pack gradient · top", p.l1],
                      ["l2", "Pack gradient · bottom", p.l2],
                    ] as const
                  ).map(([name, label, value]) => (
                    <div className="a-field" key={name}>
                      <label className="a-label" htmlFor={`c-${key}-${name}`}>
                        {label}
                      </label>
                      <div className="a-actions">
                        <input className="a-input" id={`c-${key}-${name}`} name={name} defaultValue={value} required />
                        <span className="a-swatch" style={{ background: value }} aria-hidden />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="a-actions">
                  <button className="a-btn small" type="submit">
                    Save {p.name || key}
                  </button>
                </div>
              </form>
            </section>
          );
        })}
      </div>
    </>
  );
}
