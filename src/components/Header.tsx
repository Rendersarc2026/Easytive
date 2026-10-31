"use client";

import { useEffect, useState } from "react";
import { announcement, drawerNav, nav } from "@/data/site";
import { useBag } from "./Bag";
import { Logo } from "./Logo";

// Announcement bar, then a sticky white bar: links left, logo centre, stories + bag right.
export function Header() {
  const { count, say } = useBag();
  const [lined, setLined] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setLined(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const onBag = () =>
    say(count ? `${count} ${count > 1 ? "items" : "item"} in your bag. Checkout opens at launch.` : "Your bag is empty. Start with Easytive Daily.");

  return (
    <>
      <div className="ann">{announcement.join("  ·  ")}</div>
      <header className={`site${lined ? " lined" : ""}`}>
        <div className="wrap hbar">
          <nav aria-label="Primary">
            {nav.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
          <button className="menu-btn" type="button" aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(true)}>
            Menu
          </button>
          <a className="logo" href="#top">
            <Logo title="Easytive home" />
          </a>
          <div className="hright">
            <a href="#moments" className="hide-sm">
              Stories
            </a>
            <button type="button" onClick={onBag}>
              Bag ({count})
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
          {drawerNav.map((n) => (
            <a key={n.label} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
