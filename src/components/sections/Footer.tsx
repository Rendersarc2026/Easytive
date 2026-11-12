"use client";

import { useState } from "react";
import Image from "next/image";

export function Footer() {
  const [note, setNote] = useState("");
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="ftop solo">
          <div className="fbrand">
            <Image src="/easytive-logo.png" alt="Easytive" width={3202} height={700} sizes="120px" />
            <p>Doctor-guided, third-party tested urinary wellness. Made in India.</p>
          </div>
          <div className="fnews" id="letter">
            <h4>The Easy Letter</h4>
            <p>One short email a fortnight on bladder health, hydration and habits.</p>
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
