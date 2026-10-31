import type { ReactNode } from "react";
import type { Tone } from "@/data/site";

// Strong accent per tone, used inside the product illustrations.
export const toneInk: Record<Tone, string> = {
  sage: "#3f5a3f",
  ink: "#2f3b4c",
  rose: "#9c5a50",
  lilac: "#5f5591",
  aqua: "#2f6f6f",
  sand: "#8a6a3d",
};

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[11px] uppercase tracking-[0.28em] text-muted ${className}`}>{children}</p>;
}

// Serif section title; wrap the accent word in <em> for the italic treatment.
export function Title({ children, id, className = "" }: { children: ReactNode; id?: string; className?: string }) {
  return (
    <h2
      id={id}
      className={`font-display text-4xl leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[56px] [&_em]:italic ${className}`}
    >
      {children}
    </h2>
  );
}

// Small-caps text link with an underline, as in "READ THEIR STORIES".
export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={`inline-block shrink-0 border-b border-ink pb-1.5 text-[11px] uppercase tracking-[0.24em] transition-opacity hover:opacity-60 ${className}`}
    >
      {children}
    </a>
  );
}

export function ArrowRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export const buttonStyles = {
  primary: `${buttonBase} bg-ink text-paper hover:bg-ink-soft`,
  outline: `${buttonBase} border border-ink text-ink hover:bg-ink hover:text-paper`,
  light: `${buttonBase} bg-paper text-ink hover:bg-stone`,
};

export function formatPrice(n: number) {
  return `Rs. ${n.toLocaleString("en-IN")}`;
}
