"use client";

import { useEffect, useState } from "react";
import { nav } from "@/data/site";
import { Logo } from "./Logo";

// Floating pill nav: glassy and white over the hero, solid once the page scrolls.
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={`mx-auto flex h-14 max-w-[900px] items-center justify-between rounded-full border pl-5 pr-2 backdrop-blur-md transition-colors duration-300 sm:pl-6 sm:pr-3 ${
          solid ? "border-line bg-paper/90 text-ink shadow-[0_6px_24px_-12px_rgb(0_0_0/0.25)]" : "border-paper/20 bg-ink/20 text-paper"
        }`}
      >
        <a href="#top" className="inline-flex min-h-11 items-center">
          <Logo className="h-[18px] w-auto sm:h-5" title="Easytive home" />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex gap-7 text-[13px]">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="inline-block py-2.5 transition-opacity hover:opacity-60">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 text-[13px] sm:gap-4">
          <a href="#" className="hidden min-h-11 items-center px-1 transition-opacity hover:opacity-60 sm:inline-flex">
            Account
          </a>
          <a href="#shop" className="inline-flex min-h-11 items-center px-2 transition-opacity hover:opacity-60">
            Cart (0)
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6" aria-hidden="true">
              {open ? (
                <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              ) : (
                <path d="M11 17H19M5 12H19M11 7H19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="mx-auto mt-2 max-w-[900px] rounded-3xl border border-line bg-paper p-3 text-ink shadow-[0_16px_40px_-20px_rgb(0_0_0/0.35)] lg:hidden"
        >
          <ul>
            {[...nav, { label: "Account", href: "#" }].map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3.5 font-display text-2xl transition-colors hover:bg-stone-50"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
