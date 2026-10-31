"use client";

import Image from "next/image";
import { useEffect, useState, type SubmitEvent } from "react";
import { BAND_MS, bandPhotos, moments, reviewCount } from "@/data/site";
import { useBag } from "../Bag";
import { Arrow } from "../icons";
import { PhotoStack } from "../PhotoStack";

export function Moments() {
  return (
    <section className="moments" id="moments" aria-label="Easy moments">
      <div className="wrap">
        <div className="shead">
          <h2>
            Long drives, <em>late nights</em>
          </h2>
          <a className="link" href="#creators">
            More stories <Arrow />
          </a>
        </div>
        <div className="mgrid">
          {moments.map((m) => (
            <figure key={m.label}>
              <div className="ph">
                <Image src={m.image.src} alt={m.image.alt} fill placeholder="blur" sizes="(min-width: 1000px) 19vw, 280px" />
              </div>
              <figcaption>
                <small>{m.label}</small>
                <span>{m.line}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// Brand note with a batch-report lookup. PLACEHOLDER: the report is a sample layout.
export function Note() {
  const { say } = useBag();
  const [open, setOpen] = useState(false);
  const [batch, setBatch] = useState("");
  const [shown, setShown] = useState<string | null>(null);

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const v = batch.trim().toUpperCase();
    if (!v) return say("Enter the batch number from the base of your pack");
    setShown(v);
  };

  return (
    <section className="note" aria-label="Our approach">
      <div className="wrap">
        <p className="l">
          We only use ingredients that have been studied, at the doses the studies used, plus a few herbs from Ayurveda. Every
          dose is printed on the label.
        </p>
        <div className="r">
          <p>
            A urologist, a gynaecologist and a formulation scientist review each product before it goes on sale. An independent
            lab then tests every batch for purity and strength.
          </p>
          <button className="btn" type="button" aria-expanded={open} aria-controls="lookup-box" onClick={() => setOpen((o) => !o)}>
            View batch reports <Arrow />
          </button>
          {open && (
            <div id="lookup-box" className="lookup-box">
              <form className="lookup" onSubmit={onSubmit}>
                <label htmlFor="batch-input" className="sr">
                  Batch number
                </label>
                <input
                  id="batch-input"
                  placeholder="e.g. ET-2610-A"
                  autoComplete="off"
                  autoFocus
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                />
                <button className="btn btn-dark" type="submit">
                  Look up
                </button>
              </form>
              {shown && (
                <div className="report">
                  <span>Sample report layout for {shown}</span>
                  <dl>
                    {["Identity & potency", "Heavy metals", "Microbial limits", "Pesticide residue"].map((t) => (
                      <div key={t} style={{ display: "contents" }}>
                        <dt>{t}</dt>
                        <dd>Pass</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Bottom banner: the photo behind the text changes every BAND_MS. Pauses on hover.
export function Band() {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (hover || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % bandPhotos.length), BAND_MS);
    return () => window.clearTimeout(t);
  }, [active, hover]);

  return (
    <div className="wrap" style={{ paddingBottom: "clamp(16px,2vw,24px)" }}>
      <section className="band" aria-label="Community" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <PhotoStack photos={bandPhotos} active={active} sizes="(min-width: 1440px) 1296px, 100vw" />
        <div className="in">
          <span className="label" style={{ color: "#fff" }}>
            {reviewCount} reviews
          </span>
          <h2>
            Mostly from people who <em>never talk about this.</em>
          </h2>
          <a className="btn btn-light" href="#reviews">
            Read the reviews <Arrow />
          </a>
        </div>
      </section>
    </div>
  );
}
