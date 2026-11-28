import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { legal } from "@/data/site";

// Shared layout for /privacy and /terms: title, last-updated date, then the sections.
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="legal">
        <div className="wrap">
          <span className="label">Legal</span>
          <h1>{title}</h1>
          <p className="legal-date">Last updated {legal.updated}</p>
          <div className="legal-body">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/** Contact block both pages end with. */
export function LegalContact() {
  return (
    <p>
      {legal.company}
      <br />
      {legal.address}
      <br />
      Email: <a href={`mailto:${legal.email}`}>{legal.email}</a>
    </p>
  );
}
