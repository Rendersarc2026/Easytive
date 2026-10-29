import type { ReactNode } from "react";

export type Tone = "sage" | "ink" | "rose" | "lilac" | "aqua" | "sand";

export const toneBg: Record<Tone, string> = {
  sage: "bg-sage-50",
  ink: "bg-[#e6e8ec]",
  rose: "bg-rose-50",
  lilac: "bg-lilac-50",
  aqua: "bg-aqua-50",
  sand: "bg-sand-50",
};

// Strong accent per tone, used inside illustrations.
export const toneInk: Record<Tone, string> = {
  sage: "#597b58",
  ink: "#2f3b4c",
  rose: "#b9665a",
  lilac: "#6f63a3",
  aqua: "#3f8c8c",
  sand: "#a07a45",
};

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-medium uppercase tracking-[0.18em] text-sage ${className}`}>{children}</p>
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
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage";

export const buttonStyles = {
  primary: `${buttonBase} bg-ink text-paper hover:bg-sage-dark`,
  outline: `${buttonBase} border border-ink text-ink hover:bg-ink hover:text-paper`,
  light: `${buttonBase} bg-paper text-ink hover:bg-sage-50`,
};

export function formatPrice(n: number) {
  return `Rs. ${n.toLocaleString("en-IN")}`;
}
