import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";

// Admin-only typeface (a free stand-in for Gotham). Loaded here so the public
// site doesn't download it; admin.css reads it through --font-admin.
const montserrat = Montserrat({
  variable: "--font-admin",
  subsets: ["latin"],
});

// Every admin page: "<title> · Easytive admin", kept out of search results.
export const metadata: Metadata = {
  title: { default: "Easytive admin", template: "%s · Easytive admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className={`${montserrat.variable} a-font`}>{children}</div>;
}
