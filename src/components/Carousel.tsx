"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  heading: ReactNode;
  children: ReactNode;
  label: string;
};

// Horizontal scroll-snap track with prev/next buttons beside the heading.
export function Carousel({ heading, children, label }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-6">
        <div className="min-w-0">{heading}</div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <ArrowButton dir={-1} disabled={atStart} onClick={() => scroll(-1)} />
          <ArrowButton dir={1} disabled={atEnd} onClick={() => scroll(1)} />
        </div>
      </div>
      <div
        ref={track}
        role="region"
        aria-label={label}
        tabIndex={0}
        // `relative` keeps absolutely positioned children (e.g. sr-only labels) clipped by the track.
        className="no-scrollbar relative -mx-4 flex overscroll-x-contain snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 focus-visible:outline-none sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0 lg:gap-6"
      >
        {children}
      </div>
    </div>
  );
}

function ArrowButton({ dir, disabled, onClick }: { dir: 1 | -1; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 1 ? "Next" : "Previous"}
      className="grid size-11 place-items-center rounded-full border border-ink/80 text-ink transition hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-25"
    >
      <svg viewBox="0 0 16 18" fill="none" className={`w-3.5 ${dir === -1 ? "rotate-180" : ""}`} aria-hidden="true">
        <path d="m5 17 8-8-8-8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
