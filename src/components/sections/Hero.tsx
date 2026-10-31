"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { heroCopy, heroPhotos } from "@/data/site";
import { Arrow } from "../icons";
import { PhotoStack } from "../PhotoStack";

const SIZES = "(min-width: 1440px) 1296px, 100vw";

// Photos change on their own (each photo's `hold` in data/site.ts) and loop.
// The copy switches between the lifestyle line and the numbers. Pauses on hover.
export function Hero() {
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const schedule = useCallback((i: number) => {
    window.clearTimeout(timer.current);
    if (paused.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = window.setTimeout(() => setActive((i + 1) % heroPhotos.length), heroPhotos[i].hold);
  }, []);

  useEffect(() => {
    schedule(active);
    return () => window.clearTimeout(timer.current);
  }, [active, schedule]);

  const slide = heroPhotos[active].slide;
  const { lifestyle, proof } = heroCopy;
  const tab = (s: typeof slide) => (slide === s ? undefined : -1);

  return (
    <div className="wrap" style={{ paddingTop: "clamp(8px,1vw,16px)" }}>
      <section
        className="hero"
        aria-label="Introduction"
        aria-roledescription="carousel"
        onMouseEnter={() => {
          paused.current = true;
          window.clearTimeout(timer.current);
        }}
        onMouseLeave={() => {
          paused.current = false;
          schedule(active);
        }}
      >
        <PhotoStack photos={heroPhotos} active={active} sizes={SIZES} preloadFirst />

        <div className={`hs${slide === "lifestyle" ? " on" : ""}`} aria-hidden={slide !== "lifestyle"}>
          <div className="hero-copy">
            <span className="tag">{lifestyle.tag}</span>
            <h1>
              Comfort, built into <em>every</em> day.
            </h1>
            <div className="ctas">
              <a className="btn btn-light" href="#shop" tabIndex={tab("lifestyle")}>
                Shop the range <Arrow />
              </a>
              <a className="btn" href="#system" tabIndex={tab("lifestyle")}>
                How it works
              </a>
            </div>
          </div>
        </div>

        <div className={`hs proof${slide === "proof" ? " on" : ""}`} aria-hidden={slide !== "proof"}>
          <div className="hero-copy">
            <span className="tag">{proof.tag}</span>
            <p role="heading" aria-level={2} className="h1">
              Clinically studied doses. <em>Tested</em> every batch.
            </p>
            <ul className="proof-row">
              {proof.stats.map((s) => (
                <li key={s.value}>
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
            <div className="ctas">
              <a className="btn btn-light" href="#shop" tabIndex={tab("proof")}>
                Shop Easytive Daily <Arrow />
              </a>
              <a className="btn" href="#experts" tabIndex={tab("proof")}>
                Meet the doctors
              </a>
            </div>
          </div>
        </div>

        <div className="hero-dots" role="group" aria-label="Hero photos">
          {heroPhotos.map((p, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show photo ${i + 1} of ${heroPhotos.length}`}
              aria-pressed={active === i}
              className={active === i ? "on" : undefined}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
