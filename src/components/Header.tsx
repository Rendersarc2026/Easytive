"use client";

import { useEffect, useState } from "react";
import { announcement, nav } from "@/data/site";

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
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="bg-ink px-4 py-2.5 text-center text-xs tracking-wide text-paper sm:text-[13px]">
        <span className="sm:hidden">{announcement.short}</span>
        <span className="hidden sm:inline">{announcement.full}</span>
      </div>
      <header
        className={`sticky top-0 z-40 transition-colors duration-300 ${
          scrolled || open ? "border-b border-line bg-cream/90 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
          <a href="#top" className="font-display text-[28px] font-medium tracking-tight sm:text-[34px]">
            easytive
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex gap-9 text-[15px]">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-block py-2.5 transition-colors hover:text-sage">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 text-[15px] sm:gap-5">
            <a href="#" className="hidden min-h-11 items-center hover:text-sage sm:inline-flex">
              Login
            </a>
            <a href="#shop" className="inline-flex min-h-11 items-center px-1 hover:text-sage">
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
              <svg viewBox="0 0 24 24" fill="none" className="w-7" aria-hidden="true">
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
          <nav id="mobile-menu" aria-label="Mobile" className="h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-cream pb-10 lg:hidden">
            <ul className="flex flex-col px-4 pt-6 sm:px-6">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-4 font-display text-2xl"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#" className="block py-4 font-display text-2xl" onClick={() => setOpen(false)}>
                  Login
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
