"use client";

import { useState } from "react";
import { footerCols } from "@/data/site";
import { WhatsAppButton } from "../Bag";
import { WhatsApp } from "../icons";
import { Logo } from "../Logo";

export function Footer() {
  const [note, setNote] = useState("");
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="ftop">
          <div className="fbrand">
            <Logo tagline title="easytive, urinary health" />
            <p>Easy does it. Made in India.</p>
          </div>
          {footerCols.map((c) => (
            <div className="fcol" key={c.title}>
              <h4>{c.title}</h4>
              <ul>
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="fnews">
            <h4>The Easy Letter</h4>
            <p>One short email every two weeks on bladder health, hydration and habits.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setNote("Thank you. This is a website preview, so sign-ups are not collected yet.");
              }}
            >
              <label htmlFor="email" className="sr">
                Email address
              </label>
              <input id="email" type="email" required placeholder="Email address" autoComplete="email" />
              <button className="btn" type="submit">
                Subscribe
              </button>
            </form>
            <div className="fnote" aria-live="polite">
              {note}
            </div>
          </div>
        </div>
        <div className="fine">
          <p>
            These statements have not been evaluated by any regulatory authority. Easytive products are dietary supplements and are
            not intended to diagnose, treat, cure or prevent any disease. Consult your doctor before use if you are pregnant, nursing
            or on medication.
          </p>
          <span>© 2026 Easytive</span>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <WhatsAppButton className="wa" label="Chat with us on WhatsApp">
      <WhatsApp />
    </WhatsAppButton>
  );
}
