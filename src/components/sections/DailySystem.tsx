"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { system } from "@/data/site";
import { Container, Title } from "../ui";

const PIN_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

// "Side transition" from the slide: on desktop the section pins under the hero and the cards
// slide sideways as you scroll down. On touch screens and with reduced motion it is a normal
// swipeable row.
export function DailySystem() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [pinned, setPinned] = useState(false);
  const [travel, setTravel] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const setEdgesIfChanged = useCallback((start: boolean, end: boolean) => {
    setEdges((e) => (e.start === start && e.end === end ? e : { start, end }));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const sync = () => setPinned(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // How far the track has to move so its last card lines up with the container's right edge.
  useEffect(() => {
    const f = frame.current;
    const t = track.current;
    if (!f || !t) return;
    if (!pinned) {
      t.style.transform = "";
      return;
    }
    const measure = () => setTravel(Math.max(0, t.scrollWidth - f.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(f);
    ro.observe(t);
    return () => ro.disconnect();
  }, [pinned]);

  // Pinned mode: vertical scroll position drives the sideways offset.
  useEffect(() => {
    const s = section.current;
    const t = track.current;
    if (!pinned || !s || !t) return;
    let raf = 0;
    const apply = () => {
      const p = travel ? Math.min(1, Math.max(0, -s.getBoundingClientRect().top / travel)) : 0;
      t.style.transform = `translate3d(${-p * travel}px,0,0)`;
      setEdgesIfChanged(p <= 0.01, p >= 0.99);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pinned, travel, setEdgesIfChanged]);

  // Swipe mode: read edges from the track's own scroll.
  useEffect(() => {
    const t = track.current;
    if (pinned || !t) return;
    const onScroll = () =>
      setEdgesIfChanged(t.scrollLeft <= 4, t.scrollLeft + t.clientWidth >= t.scrollWidth - 4);
    onScroll();
    t.addEventListener("scroll", onScroll, { passive: true });
    return () => t.removeEventListener("scroll", onScroll);
  }, [pinned, setEdgesIfChanged]);

  const step = (dir: 1 | -1) => {
    const t = track.current;
    const card = t?.firstElementChild as HTMLElement | null;
    if (!t || !card) return;
    const distance = card.offsetWidth + parseFloat(getComputedStyle(t).columnGap || "0");
    if (pinned) window.scrollBy({ top: dir * distance, behavior: "smooth" });
    else t.scrollBy({ left: dir * distance, behavior: "smooth" });
  };

  return (
    <section
      ref={section}
      id="system"
      aria-labelledby="system-title"
      className="relative scroll-mt-0 bg-paper"
      // Extra height = sideways distance, so one pixel scrolled down moves the cards one pixel left.
      style={pinned ? { height: `calc(100svh + ${travel}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-16" : "py-20 sm:py-28"}>
        <Container>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <Title id="system-title">
                What goes <em>into it</em>
              </Title>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
                A short list of ingredients, each with research behind it, at the doses that research used. Here is
                what each one is for.
              </p>
            </div>
            <div className="flex gap-6 text-[11px] uppercase tracking-[0.24em]">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={edges.start}
                className="inline-flex min-h-11 items-center gap-2 transition-opacity hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
              >
                <span aria-hidden="true">←</span> Prev
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={edges.end}
                className="inline-flex min-h-11 items-center gap-2 transition-opacity hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
              >
                Next <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div ref={frame}>
            <ul
              ref={track}
              aria-label="Easytive ingredients"
              tabIndex={pinned ? undefined : 0}
              className={
                pinned
                  ? "flex w-max gap-6 will-change-transform"
                  : "no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 focus-visible:outline-none sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6"
              }
            >
              {system.map((card) => (
                <li
                  key={card.title}
                  className={`relative shrink-0 snap-start overflow-hidden rounded-2xl bg-stone text-paper ${
                    pinned ? "aspect-[3/4] h-[min(56svh,500px)]" : "aspect-[3/4] w-[78%] sm:w-[44%]"
                  }`}
                >
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 44vw, 78vw"
                    className="object-cover"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/20" />
                  <span className="absolute left-4 top-4 rounded-full border border-paper/30 bg-paper/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] backdrop-blur-md">
                    {card.tag}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <h3 className="font-display text-2xl">{card.title}</h3>
                    <p className="mt-2 max-w-[30ch] text-sm leading-relaxed text-paper/80">{card.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </section>
  );
}
