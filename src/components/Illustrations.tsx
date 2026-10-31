// SVG stand-in for product photography until real pack shots exist.
import type { Tone } from "@/data/site";
import { toneInk } from "./ui";

export function Bottle({ tone, name, className = "" }: { tone: Tone; name: string; className?: string }) {
  const c = toneInk[tone];
  const short = name.replace(/^Easytive\s+/, "").replace(/^The\s+/, "");
  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-label={`${name} pack`}>
      <ellipse cx="100" cy="246" rx="62" ry="7" fill="#22211f" opacity=".1" />
      <rect x="62" y="18" width="76" height="34" rx="6" fill={c} />
      <rect x="62" y="44" width="76" height="6" fill="#000" opacity=".15" />
      <rect x="44" y="50" width="112" height="194" rx="22" fill={c} />
      <rect x="44" y="104" width="112" height="96" fill="#fff" opacity=".92" />
      <text x="100" y="138" textAnchor="middle" style={{ fontFamily: "var(--font-playfair)" }} fontSize="19" fill="#22211f">
        easytive
      </text>
      <line x1="80" y1="150" x2="120" y2="150" stroke={c} strokeWidth="1.2" />
      <text x="100" y="170" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="10" fill="#22211f" letterSpacing="1.5">
        {short.toUpperCase().slice(0, 16)}
      </text>
      <text x="100" y="187" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="6.5" fill="#75736e" letterSpacing="0.6">
        URINARY WELLNESS
      </text>
      <rect x="54" y="60" width="8" height="170" rx="4" fill="#fff" opacity=".18" />
    </svg>
  );
}
