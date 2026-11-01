import type { CSSProperties } from "react";
import { formatPrice, products, shopGrid, type Product } from "@/data/site";
import { AddButton } from "../Bag";
import { Arrow } from "../icons";
import { Logo } from "../Logo";

// CSS pack shot until real product photography exists.
function Bottle({ p }: { p: Product }) {
  const short = p.name.replace(/^Easytive\s+/, "").toUpperCase();
  return (
    <div className={`bottle${p.sachet ? " sachet" : ""}`} style={{ "--l1": p.l1, "--l2": p.l2 } as CSSProperties} aria-hidden="true">
      <div className="cap" />
      <div className="body">
        <div className="lbl">
          <Logo />
          <b>{short}</b>
          <i>URINARY WELLNESS</i>
        </div>
      </div>
    </div>
  );
}

export function Products() {
  return (
    <section className="products" id="shop">
      <div className="wrap">
        <div className="panel">
          <div className="shead">
            <h2>
              Designed around your <em>daily rhythm</em>
            </h2>
            <div className="r">
              <p>Studied ingredients at meaningful doses, doctor-reviewed and third-party tested, batch by batch.</p>
              <a className="link" href="#shop">
                Shop all <Arrow />
              </a>
            </div>
          </div>
          <div className="grid">
            {shopGrid.map((key) => {
              const p: Product = products[key];
              return (
                <article className="card" key={key}>
                  <div className="stage" style={{ "--tint": p.tint } as CSSProperties}>
                    {p.badge && <span className="badge">{p.badge}</span>}
                    <div className="pack">
                      <Bottle p={p} />
                    </div>
                  </div>
                  <div className="meta">
                    <h3>{p.name}</h3>
                    <span className="price">{formatPrice(p.price)}</span>
                    <span className="sub">{p.desc}</span>
                    <AddButton product={key} className="add">
                      Add to bag
                    </AddButton>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
