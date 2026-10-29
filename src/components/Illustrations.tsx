// SVG stand-ins for photography until real product and people shots exist.
import { toneInk, type Tone } from "./ui";

export function Bottle({ tone, name, className = "" }: { tone: Tone; name: string; className?: string }) {
  const c = toneInk[tone];
  const short = name.replace(/^Easytive\s+/, "").replace(/^The\s+/, "");
  return (
    <svg viewBox="0 0 200 260" className={className} role="img" aria-label={`${name} pack`}>
      <ellipse cx="100" cy="246" rx="62" ry="7" fill="#151515" opacity=".08" />
      <rect x="62" y="18" width="76" height="34" rx="6" fill={c} />
      <rect x="62" y="44" width="76" height="6" fill="#000" opacity=".12" />
      <rect x="44" y="50" width="112" height="194" rx="22" fill="#fbfaf7" />
      <rect x="44" y="50" width="112" height="194" rx="22" fill="none" stroke="#151515" strokeOpacity=".08" />
      <rect x="44" y="104" width="112" height="96" fill={c} opacity=".12" />
      <text x="100" y="134" textAnchor="middle" style={{ fontFamily: "var(--font-syne)" }} fontSize="17" fontWeight="600" fill="#151515">
        easytive
      </text>
      <line x1="80" y1="146" x2="120" y2="146" stroke={c} strokeWidth="1.5" />
      <text x="100" y="168" textAnchor="middle" style={{ fontFamily: "var(--font-dm-sans)" }} fontSize="11" fill="#151515" letterSpacing="1.5">
        {short.toUpperCase().slice(0, 16)}
      </text>
      <text x="100" y="186" textAnchor="middle" style={{ fontFamily: "var(--font-dm-sans)" }} fontSize="7" fill="#6f6f6f" letterSpacing="0.4">
        URINARY WELLNESS
      </text>
      <rect x="54" y="60" width="10" height="170" rx="5" fill="#fff" opacity=".7" />
    </svg>
  );
}

export function Portrait({ tone, className = "" }: { tone: Tone; className?: string }) {
  const c = toneInk[tone];
  return (
    <svg viewBox="0 0 300 380" className={className} aria-hidden="true" preserveAspectRatio="xMidYMax slice">
      <circle cx="230" cy="70" r="90" fill={c} opacity=".1" />
      <path d="M40 380c6-78 52-120 110-120s104 42 110 120Z" fill={c} opacity=".85" />
      <path d="M120 262h60l-6 40h-48Z" fill="#e9d7c6" />
      <ellipse cx="150" cy="182" rx="50" ry="60" fill="#ecdccb" />
      <path d="M98 178c-4-52 22-82 54-82 34 0 58 26 52 78-10-24-30-36-54-38-22 2-40 18-52 42Z" fill="#2b2420" />
      <path d="M118 290l32 36 32-36" fill="none" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  );
}

export function Avatar({ tone, initials }: { tone: Tone; initials: string }) {
  return (
    <span
      className="grid size-11 shrink-0 place-items-center rounded-full font-display text-sm font-semibold text-paper"
      style={{ background: toneInk[tone] }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function ArticleArt({ tone, seed, className = "" }: { tone: Tone; seed: number; className?: string }) {
  const c = toneInk[tone];
  const shapes = [
    <g key="a">
      <circle cx="210" cy="120" r="70" fill={c} opacity=".18" />
      <circle cx="150" cy="140" r="46" fill={c} opacity=".45" />
      <circle cx="120" cy="100" r="18" fill={c} />
    </g>,
    <g key="b">
      <path d="M180 40c40 60 60 90 60 120a60 60 0 0 1-120 0c0-30 20-60 60-120Z" fill={c} opacity=".35" />
      <path d="M180 90c22 33 33 50 33 66a33 33 0 0 1-66 0c0-16 11-33 33-66Z" fill={c} />
    </g>,
    <g key="c">
      <rect x="90" y="150" width="180" height="16" rx="8" fill={c} opacity=".35" />
      <circle cx="140" cy="110" r="22" fill={c} />
      <path d="M140 132v18M120 150l20-18 30 30" stroke={c} strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="240" cy="70" r="30" fill={c} opacity=".18" />
    </g>,
  ];
  return (
    <svg viewBox="0 0 360 220" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {shapes[seed % shapes.length]}
    </svg>
  );
}

export function HandHeart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 110" className={className} aria-hidden="true" fill="none">
      <path
        d="M60 100C30 78 10 60 10 36 10 20 22 10 36 10c10 0 18 6 24 16 6-10 14-16 24-16 14 0 26 10 26 26 0 24-20 42-50 64Z"
        stroke="#597b58"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M58 96C34 76 16 60 16 38 16 24 26 16 37 16" stroke="#597b58" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <path d="M96 14l8-8M104 26l10-2M88 8l2-6" stroke="#151515" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function LabPattern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 400" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="hex" width="60" height="52" patternUnits="userSpaceOnUse">
          <path d="M15 0h30l15 26-15 26H15L0 26Z" fill="none" stroke="#fff" strokeOpacity=".07" />
        </pattern>
      </defs>
      <rect width="600" height="400" fill="url(#hex)" />
      <g stroke="#fff" strokeOpacity=".25" fill="none" strokeWidth="1.5">
        <path d="M420 80v120a50 50 0 0 0 100 0V80" />
        <path d="M410 80h120" />
        <path d="M60 300h60l-20-90h-20Z" />
      </g>
      <path d="M420 170h100v30a50 50 0 0 1-100 0Z" fill="#9cc29a" opacity=".3" />
    </svg>
  );
}
