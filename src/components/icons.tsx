export function Arrow() {
  return (
    <svg viewBox="0 0 15 10" aria-hidden="true">
      <path d="M0 5h14M9.5 .5 14 5l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function ArrowLeft() {
  return (
    <svg viewBox="0 0 15 10" aria-hidden="true">
      <path d="M15 5H1M5.5 .5 1 5l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function Star() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" fill="currentColor" />
    </svg>
  );
}

export function Heart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20.5s-7.5-4.6-9.2-9.3C1.6 7.8 3.9 4.5 7.3 4.5c2 0 3.5 1.1 4.7 2.7 1.2-1.6 2.7-2.7 4.7-2.7 3.4 0 5.7 3.3 4.5 6.7-1.7 4.7-9.2 9.3-9.2 9.3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Send() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 3L3 10.5l7 2.8M21 3l-7.5 18-3.5-7.7M21 3L10 13.3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsApp({ stroke = 2 }: { stroke?: number }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M16 3.5C9.1 3.5 3.5 9 3.5 15.8c0 2.4.7 4.6 1.9 6.5L3.6 28.5l6.4-1.7c1.8 1 3.9 1.5 6 1.5 6.9 0 12.5-5.5 12.5-12.4S22.9 3.5 16 3.5z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
      <path
        d="M12 10.5c.4 0 .7 0 .9.6l1 2.3c.1.3 0 .6-.1.8l-.7.9c-.2.2-.2.5 0 .8.9 1.5 2.1 2.6 3.6 3.4.3.2.6.1.8-.1l.9-1c.2-.3.5-.3.8-.2l2.3 1.1c.3.1.5.4.4.8-.2 1.3-1.4 2.3-2.7 2.3-4.4-.2-8.5-4.2-8.7-8.6 0-1.4 1-2.6 2.4-2.8z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/** Head-and-shoulders placeholder for advisor portraits. */
export function Silhouette() {
  return (
    <svg className="sil" viewBox="0 0 200 220" aria-hidden="true">
      <circle cx="100" cy="72" r="44" fill="currentColor" />
      <path d="M12 220c0-52 40-90 88-90s88 38 88 90z" fill="currentColor" />
    </svg>
  );
}
