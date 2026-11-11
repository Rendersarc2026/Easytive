import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { doctors as siteDoctors, placeholderFor } from "@/data/site";
import type { DoctorCard } from "@/data/store";
import { Arrow, Silhouette } from "../icons";
import { LogoIcon } from "../Logo";

type Props = {
  link?: { label: string; href: string } | null;
  /** Board members; pass the admin's merged list (data/store) to show edits. */
  doctors?: DoctorCard[];
  /** Heading and subline; the defaults are the home page's wording. */
  title?: ReactNode;
  sub?: string;
};

// Medical advisory board. Hover or focus a card to see what that doctor checks.
export function Board({
  link = { label: "About the board", href: "#experts" },
  doctors = siteDoctors,
  title = (
    <>
      Meet our <em>scientists</em>.
    </>
  ),
  sub = "Urologists, gynaecologists and formulation scientists review every formula and every article before it reaches you.",
}: Props) {
  return (
    <section className="board" id="experts" aria-label="Medical advisory board">
      <div className="wrap">
        <div className="shead">
          <div>
            <h2>{title}</h2>
            <p className="sub">{sub}</p>
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
                {d.image ? (
                  <Image src={d.image.src} alt={d.image.alt} fill placeholder={placeholderFor(d.image.src)} sizes="(min-width: 900px) 22vw, 45vw" className="photo" />
                ) : (
                  <>
                    <Silhouette />
                    <span className="soon">Photo to come</span>
                  </>
                )}
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
