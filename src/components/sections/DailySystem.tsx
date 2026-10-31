"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { steps } from "@/data/site";
import { Arrow, ArrowLeft } from "../icons";

// On wide screens the rail drifts left as the section scrolls past; the page never stops scrolling.
// On small screens and with reduced motion it is a normal swipeable row ("free" mode).
export function DailySystem() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const api = useRef<{ step: (d: number) => void }>({ step: () => {} });

  useEffect(() => {
    const sys = section.current!;
    const r = rail.current!;
    const b = bar.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let drift = false;
    let dist = 0;
    let nudge = 0;
    let settle: number | undefined;

    const progress = () => {
      const vh = window.innerHeight;
      const top = sys.getBoundingClientRect().top;
      return Math.min(1, Math.max(0, (vh * 0.85 - top) / (vh * 0.85 - 68)));
    };

    const update = () => {
      if (!drift) {
        const max = r.scrollWidth - r.clientWidth;
        b.style.width = `${max > 0 ? (r.scrollLeft / max) * 100 : 0}%`;
        return;
      }
      const x = Math.min(dist, Math.max(0, progress() * dist + nudge));
      r.style.transform = `translate3d(${-x}px,0,0)`;
      b.style.width = `${dist ? (x / dist) * 100 : 0}%`;
    };

    const layout = () => {
      drift = !reduce.matches && window.innerWidth > 900;
      sys.classList.toggle("free", !drift);
      r.style.transform = "";
      dist = drift ? Math.max(0, r.scrollWidth - window.innerWidth) : 0;
      nudge = 0;
      update();
    };

    api.current.step = (d: number) => {
      const first = r.querySelector<HTMLElement>(".step");
      const w = (first?.getBoundingClientRect().width ?? 300) + 18;
      if (!drift) {
        r.scrollBy({ left: d * w, behavior: "smooth" });
        return;
      }
      const base = progress() * dist;
      nudge = Math.min(dist - base, Math.max(-base, nudge + d * w));
      r.style.transition = "transform .6s cubic-bezier(.2,.7,.2,1)";
      update();
      window.clearTimeout(settle);
      settle = window.setTimeout(() => (r.style.transition = ""), 650);
    };

    const onScroll = () => drift && update();
    layout();
    r.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    reduce.addEventListener("change", layout);
    return () => {
      window.clearTimeout(settle);
      r.removeEventListener("scroll", update);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
      reduce.removeEventListener("change", layout);
    };
  }, []);

  return (
    <section className="system" id="system" ref={section} aria-label="How it works">
      <div className="pin">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="label" style={{ display: "block", marginBottom: 12 }}>
                How it works
              </span>
              <h2>
                What to take, <em>and when</em>
              </h2>
            </div>
            <div className="r">
              <p>Five steps across a day. Most people only need the first one.</p>
              <div className="arrows">
                <button type="button" className="arrow-btn" aria-label="Previous step" onClick={() => api.current.step(-1)}>
                  <ArrowLeft />
                </button>
                <button type="button" className="arrow-btn" aria-label="Next step" onClick={() => api.current.step(1)}>
                  <Arrow />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="rail" ref={rail}>
          {steps.map((s, i) => (
            <article className="step" key={s.title}>
              <div className="ph">
                <Image src={s.image.src} alt={s.image.alt} fill placeholder="blur" sizes="(min-width: 1500px) 420px, (min-width: 900px) 28vw, 250px" />
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span className="pill">{s.pill}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
        <div className="wrap">
          <div className="progress" aria-hidden="true">
            <i ref={bar} />
          </div>
        </div>
      </div>
    </section>
  );
}
