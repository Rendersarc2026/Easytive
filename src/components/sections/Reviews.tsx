"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { products, reviews } from "@/data/site";
import { useBag } from "../Bag";
import { Arrow, ArrowLeft, Star } from "../icons";

// How long each review stays up (ms). Starts once the section is on screen; pauses on hover or focus.
const DUR = 2000;

const pad = (n: number) => String(n).padStart(2, "0");

export function Reviews() {
  const { add } = useBag();
  const root = useRef<HTMLElement>(null);
  const [cur, setCur] = useState(0);
  const [out, setOut] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);

  const timer = useRef<number | undefined>(undefined);
  const left = useRef(DUR);
  const since = useRef(0);
  const curRef = useRef(0);
  const goRef = useRef<(n: number) => void>(() => {});

  const schedule = useCallback((ms: number) => {
    window.clearTimeout(timer.current);
    left.current = ms;
    since.current = Date.now();
    timer.current = window.setTimeout(() => goRef.current(curRef.current + 1), ms);
  }, []);

  const go = useCallback(
    (n: number) => {
      const next = (n + reviews.length) % reviews.length;
      if (next === curRef.current) return;
      setOut(curRef.current);
      window.setTimeout(() => setOut(null), 230);
      curRef.current = next;
      setCur(next);
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setStarted(true);
        schedule(DUR);
      }
    },
    [schedule],
  );

  useEffect(() => {
    goRef.current = go;
  }, [go]);

  // Start the clock the first time the section is mostly in view.
  useEffect(() => {
    const el = root.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setStarted(true);
        schedule(DUR);
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer.current);
    };
  }, [schedule]);

  const pause = () => {
    if (paused || !started) return;
    setPaused(true);
    window.clearTimeout(timer.current);
    left.current -= Date.now() - since.current;
  };
  const resume = () => {
    if (!paused) return;
    setPaused(false);
    schedule(Math.max(400, left.current));
  };

  return (
    <section
      ref={root}
      className={`rv${paused ? " paused" : ""}`}
      id="reviews"
      aria-label="Customer reviews"
      aria-roledescription="carousel"
      style={{ "--rv-dur": `${DUR}ms` } as CSSProperties}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && resume()}
    >
      <div className="wrap">
        <div className="rv-top">
          <div className="left">
            <span className="label">Customer reviews</span>
            <span className="rv-tag">Sample reviews</span>
          </div>
          <div className="arrows">
            <button type="button" className="arrow-btn" aria-label="Previous review" onClick={() => go(cur - 1)}>
              <ArrowLeft />
            </button>
            <button type="button" className="arrow-btn" aria-label="Next review" onClick={() => go(cur + 1)}>
              <Arrow />
            </button>
          </div>
        </div>

        <div className="rv-stack" aria-live="polite">
          {reviews.map((r, i) => {
            const words = r.quote.split(" ");
            return (
              <article key={r.name} className={`rv-item${i === cur ? " on" : ""}${i === out ? " out" : ""}`} aria-hidden={i !== cur}>
                <div className="rv-head">
                  <div className="rv-stars" role="img" aria-label="Rated 5 out of 5">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} />
                    ))}
                  </div>
                  <span className="rv-prod">{products[r.product].name}</span>
                </div>
                <blockquote className="rv-q">
                  &ldquo;
                  {words.map((w, k) => (
                    <span key={k}>
                      <span className="w" style={{ "--i": k } as CSSProperties}>
                        {k === words.length - 1 ? `${w}”` : w}
                      </span>
                      {k < words.length - 1 && " "}
                    </span>
                  ))}
                </blockquote>
                <div className="rv-foot">
                  <p className="rv-who">
                    {r.name} <span>· {r.about}</span>
                  </p>
                  <div className="rv-links">
                    <a className="rv-more" href="#reviews" tabIndex={i === cur ? undefined : -1}>
                      read more reviews
                    </a>
                    <button type="button" className="rv-add" tabIndex={i === cur ? undefined : -1} onClick={() => add(r.product)}>
                      Add {products[r.product].name} to bag
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="rv-ctrl">
          <div className="rv-bars">
            {reviews.map((r, i) => (
              <button
                key={r.name}
                type="button"
                aria-label={`Show review ${i + 1}`}
                aria-current={i === cur}
                className={i < cur ? "done" : i === cur ? (started ? "on" : "cur") : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <span className="rv-count">
            {pad(cur + 1)} / {pad(reviews.length)}
          </span>
        </div>
      </div>
    </section>
  );
}
