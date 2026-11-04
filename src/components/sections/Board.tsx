import Link from "next/link";
import { doctors } from "@/data/site";
import { Arrow, Silhouette } from "../icons";
import { LogoIcon } from "../Logo";

type Props = { link?: { label: string; href: string } | null };

// Medical advisory board. Hover or focus a card to see what that doctor checks.
export function Board({ link = { label: "About the board", href: "#experts" } }: Props) {
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
          {link &&
            (link.href.startsWith("#") ? (
              <a className="link" href={link.href}>
                {link.label} <Arrow />
              </a>
            ) : (
              <Link className="link" href={link.href}>
                {link.label} <Arrow />
              </Link>
            ))}
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
