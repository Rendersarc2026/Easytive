"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { products, reels, type Reel, type ReelType } from "@/data/site";
import { useBag } from "../Bag";
import { Arrow, ArrowLeft, Heart, Send } from "../icons";

const REEL_MS = 6000;

function TypeOverlay({ type }: { type: ReelType }) {
  if (type.kind === "pill") return <span className="ty-pill">{type.text}</span>;
  if (type.kind === "mix")
    return (
      <div className="ty-mix">
        {type.line}
        <em>{type.em}</em>
      </div>
    );
  return (
    <div className="ty-stack">
      <small>{type.small}</small>
      {type.main}
      <span>{type.end}</span>
    </div>
  );
}

function Media({ reel, auto, sizes }: { reel: Reel; auto?: boolean; sizes: string }) {
  if (reel.video)
    return <video src={reel.video} poster={reel.image.src.src} muted playsInline loop autoPlay={auto} aria-label={reel.image.alt} />;
  return <Image src={reel.image.src} alt={reel.image.alt} fill placeholder="blur" sizes={sizes} />;
}

export function Creators() {
  const { add, say } = useBag();
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [liked, setLiked] = useState<boolean[]>(() => reels.map(() => false));
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  const updateEdges = useCallback(() => {
    const t = track.current;
    if (!t) return;
    const start = t.scrollLeft < 8;
    const end = t.scrollLeft + t.clientWidth >= t.scrollWidth - 8;
    setEdges((e) => (e.start === start && e.end === end ? e : { start, end }));
  }, []);

  useEffect(() => {
    const t = track.current!;
    updateEdges();
    t.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      t.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [updateEdges]);

  const scrollBy = (d: number) => {
    const t = track.current!;
    const card = t.querySelector<HTMLElement>(".cr");
    t.scrollBy({ left: d * ((card?.getBoundingClientRect().width ?? 264) + 16) * 2, behavior: "smooth" });
  };

  const share = () => {
    const url = `${location.href.split("#")[0]}#creators`;
    if (!navigator.clipboard) return say(`Copy this link: ${url}`);
    navigator.clipboard.writeText(url).then(
      () => say("Link copied"),
      () => say(`Copy this link: ${url}`),
    );
  };

  return (
    <section className="creators" id="creators" aria-label="Creators">
      <div className="wrap">
        <div className="shead">
          <div>
            <span className="label" style={{ display: "block", marginBottom: 12 }}>
              Creators
            </span>
            <h2>
              Easy, in <em>their</em> words
            </h2>
          </div>
          <div className="r">
            <p>Real routines from creators who live with it. Tap any reel to watch.</p>
            <div className="arrows">
              <button type="button" className="arrow-btn" aria-label="Scroll reels back" disabled={edges.start} onClick={() => scrollBy(-1)}>
                <ArrowLeft />
              </button>
              <button type="button" className="arrow-btn" aria-label="Scroll reels forward" disabled={edges.end} onClick={() => scrollBy(1)}>
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="cr-track" ref={track} tabIndex={0} aria-label="Creator reels, scroll sideways">
        {reels.map((r, i) => (
          <article className="cr" key={i}>
            <div className="cr-frame">
              <button className="cr-media" type="button" aria-label={`Watch reel ${i + 1}: ${r.creator}`} onClick={() => setOpen(i)}>
                <Media reel={r} sizes="280px" />
              </button>
              <div className={`cr-type ${r.pos}`}>
                <TypeOverlay type={r.type} />
              </div>
              <div className="cr-acts">
                <button
                  type="button"
                  className="like"
                  aria-pressed={liked[i]}
                  aria-label="Like this reel"
                  onClick={() => {
                    const on = !liked[i];
                    setLiked((l) => l.map((v, k) => (k === i ? on : v)));
                    if (on) say("Saved to your liked reels");
                  }}
                >
                  <Heart />
                </button>
                <button type="button" className="share" aria-label="Copy link to creator reels" onClick={share}>
                  <Send />
                </button>
              </div>
            </div>
            <div className="cr-meta">
              <div>
                <span className="k">{r.creator}</span>
                <b>{products[r.product].name}</b>
              </div>
              <button type="button" className="cr-add" onClick={() => add(r.product)}>
                Add
              </button>
            </div>
          </article>
        ))}
      </div>

      {open !== null && <Viewer start={open} onClose={close} onAdd={add} />}
    </section>
  );
}

// Full-screen story viewer: progress bars, tap left/right, auto-advance, closes after the last reel.
function Viewer({ start, onClose, onAdd }: { start: number; onClose: () => void; onAdd: (p: Reel["product"]) => void }) {
  const [i, setI] = useState(start);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const go = useCallback((n: number) => setI((n + reels.length) % reels.length), []);

  useEffect(() => {
    const last = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      last?.focus();
    };
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => (i < reels.length - 1 ? go(i + 1) : onClose()), REEL_MS);
    return () => window.clearTimeout(t);
  }, [i, go, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [i, go, onClose]);

  const r = reels[i];
  return (
    <div className="viewer" role="dialog" aria-modal="true" aria-label="Creator reel" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button type="button" className="v-close" ref={closeBtn} onClick={onClose}>
        Close
      </button>
      <div className="v-frame">
        <div className="v-bars">
          {reels.map((_, k) => (
            <i key={k} className={k < i ? "done" : k === i ? "on" : undefined} />
          ))}
        </div>
        <div className="v-media" key={i}>
          <Media reel={r} auto sizes="430px" />
        </div>
        <div className={`cr-type v-type ${r.pos}`}>
          <TypeOverlay type={r.type} />
        </div>
        <button type="button" className="v-nav v-prev" aria-label="Previous reel" onClick={() => go(i - 1)} />
        <button type="button" className="v-nav v-next" aria-label="Next reel" onClick={() => go(i + 1)} />
        <div className="v-foot">
          <div>
            <span>{r.creator}</span>
            <b>{products[r.product].name}</b>
          </div>
          <button type="button" onClick={() => onAdd(r.product)}>
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}
