"use client";

import { Fragment, useState } from "react";
import { faq } from "@/data/site";
import { WhatsAppButton } from "../Bag";
import { WhatsApp } from "../icons";

// "**word**" in an answer renders bold.
function Rich({ text }: { text: string }) {
  return text.split(/\*\*(.+?)\*\*/).map((part, i) => (i % 2 ? <b key={i}>{part}</b> : <Fragment key={i}>{part}</Fragment>));
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.flatMap((g) =>
    g.items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a.replaceAll("**", "") },
    })),
  ),
};

export function Faq() {
  const [open, setOpen] = useState<Set<string>>(() => new Set([faq[0].items[0].q]));
  const toggle = (q: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(q)) n.delete(q);
      else n.add(q);
      return n;
    });

  let id = 0;
  return (
    <section className="faq" id="faq" aria-label="Frequently asked questions">
      <div className="wrap">
        <div className="faq-l">
          <span className="label">FAQ</span>
          <h2>
            Questions, <em>answered.</em>
          </h2>
          <p>Something personal you&apos;d rather ask a person? Our team replies on WhatsApp, quietly and quickly.</p>
          <WhatsAppButton className="faq-wa">
            <i>
              <WhatsApp stroke={2.4} />
            </i>
            Ask us on WhatsApp
          </WhatsAppButton>
        </div>
        <div className="faq-r">
          {faq.map((g) => (
            <div className="faq-g" key={g.group}>
              <h3>{g.group}</h3>
              {g.items.map((it) => {
                const n = ++id;
                const isOpen = open.has(it.q);
                return (
                  <div className={`qa${isOpen ? " open" : ""}`} key={it.q}>
                    <button type="button" aria-expanded={isOpen} aria-controls={`faq-a${n}`} id={`faq-q${n}`} onClick={() => toggle(it.q)}>
                      {it.q}
                      <span className="pm" aria-hidden="true" />
                    </button>
                    <div className="ans" id={`faq-a${n}`} role="region" aria-labelledby={`faq-q${n}`}>
                      <div>
                        <p>
                          <Rich text={it.a} />
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </section>
  );
}
