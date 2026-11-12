import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { DoctorCard } from "@/data/store";
import { Arrow, Silhouette } from "../icons";
import { LogoIcon } from "../Logo";

type Props = {
  doctors: DoctorCard[];
  title: ReactNode;
  sub: string;
  link: { label: string; href: string };
};

// Medical advisory board (About page). Hover or focus a card to see what that doctor checks.
export function Board({ doctors, title, sub, link }: Props) {
  return (
    <section className="board" aria-label="Medical advisory board">
      <div className="wrap">
        <div className="shead">
          <div>
            <h2>{title}</h2>
            <p className="sub">{sub}</p>
          </div>
          <Link className="link" href={link.href}>
            {link.label} <Arrow />
          </Link>
        </div>
        <div className="docs">
          {doctors.map((d) => (
            <article className="doc" tabIndex={0} key={d.name}>
              <div className="portrait">
                {d.image ? (
                  <Image src={d.image.src} alt={d.image.alt} fill sizes="(min-width: 900px) 22vw, 45vw" className="photo" />
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
