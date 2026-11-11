import { Fragment } from "react";

/** Renders admin-edited text, showing *word* in italics (as <em>). Everything else is plain text. */
export function Emphasis({ text }: { text: string }) {
  return text.split(/\*([^*]+)\*/).map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : <Fragment key={i}>{part}</Fragment>));
}
