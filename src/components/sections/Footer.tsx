"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { socials } from "@/data/site";
import { SocialIcon } from "@/components/icons";

export function Footer() {
  const [note, setNote] = useState("");
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="ftop solo">
          <div className="fbrand">
            <Image src="/easytive-logo.png" alt="Easytive" width={3202} height={700} sizes="120px" />
            <ul className="fsocial" aria-label="Easytive on social media">
              {socials.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Easytive on ${s.name}`}>
                    <SocialIcon name={s.name} />
                  </a>
                </li>
              ))}
            </ul>
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
          <div className="flegal">
            <Link href="/">Privacy policy</Link>
            <Link href="/">Terms and conditions</Link>
            <span>© 2026 Easytive</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
