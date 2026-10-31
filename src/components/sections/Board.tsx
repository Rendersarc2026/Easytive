import { doctors } from "@/data/site";
import { Arrow, Silhouette } from "../icons";
import { LogoIcon } from "../Logo";

// Medical advisory board. Hover or focus a card to see what that doctor checks.
export function Board() {
  return (
    <section className="board" id="experts" aria-label="Medical advisory board">
      <div className="wrap">
        <div className="shead">
          <div>
            <h2>
              Meet our <em>scientists</em>.
            </h2>
            <p className="sub">
              Urologists, gynaecologists and formulation scientists review every formula and every article before it reaches
              you.
            </p>
          </div>
          <a className="link" href="#experts">
            About the board <Arrow />
          </a>
        </div>
        <div className="docs">
          {doctors.map((d) => (
            <article className="doc" tabIndex={0} key={d.name}>
              <div className="portrait">
                <Silhouette />
                <span className="soon">Photo to come</span>
                <LogoIcon className="mark" />
                <p className="reviews">
                  <b>Reviews:</b> {d.reviews}
                </p>
              </div>
              <h3>{d.name}</h3>
              <span className="cred">Credentials to come</span>
              <span className="role">{d.role}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
