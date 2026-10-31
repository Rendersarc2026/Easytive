"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/data/site";
import { Arrow } from "../icons";

// How long each slide stays up (ms): lifestyle first, then the numbers. Loops; pauses on hover.
const HOLD = [2000, 5000];

export function Hero() {
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const schedule = useCallback((i: number) => {
    window.clearTimeout(timer.current);
    if (paused.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = window.setTimeout(() => setActive((i + 1) % HOLD.length), HOLD[i]);
  }, []);

  useEffect(() => {
    schedule(active);
    return () => window.clearTimeout(timer.current);
  }, [active, schedule]);

  const { lifestyle, proof } = heroSlides;

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
        <div className={`hs${active === 0 ? " on" : ""}`} aria-hidden={active !== 0}>
          <Image src={lifestyle.image.src} alt={lifestyle.image.alt} fill preload placeholder="blur" sizes="(min-width: 1440px) 1296px, 100vw" />
          <div className="hero-copy">
            <span className="tag">{lifestyle.tag}</span>
            <h1>
              Stop counting <em>washroom breaks.</em>
            </h1>
            <div className="ctas">
              <a className="btn btn-light" href="#shop" tabIndex={active === 0 ? undefined : -1}>
                Shop the range <Arrow />
              </a>
              <a className="btn" href="#system" tabIndex={active === 0 ? undefined : -1}>
                How it works
              </a>
            </div>
          </div>
        </div>

        <div className={`hs proof${active === 1 ? " on" : ""}`} aria-hidden={active !== 1}>
          <Image src={proof.image.src} alt={proof.image.alt} fill placeholder="blur" sizes="(min-width: 1440px) 1296px, 100vw" />
          <div className="hero-copy">
            <span className="tag">{proof.tag}</span>
            <p role="heading" aria-level={2} className="h1">
              The doses from the studies. <em>Every</em> batch tested.
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
              <a className="btn btn-light" href="#shop" tabIndex={active === 1 ? undefined : -1}>
                Shop Easytive Daily <Arrow />
              </a>
              <a className="btn" href="#experts" tabIndex={active === 1 ? undefined : -1}>
                Meet the doctors
              </a>
            </div>
          </div>
        </div>

        <div className="hero-dots" role="group" aria-label="Hero slides">
          {["Lifestyle slide", "Numbers slide"].map((label, i) => (
            <button
              key={label}
              type="button"
              aria-label={label}
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
