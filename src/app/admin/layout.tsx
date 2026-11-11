import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";

// Admin-only typeface (a free stand-in for Gotham). Loaded here so the public
// site doesn't download it; admin.css reads it through --font-admin.
const montserrat = Montserrat({
  variable: "--font-admin",
  subsets: ["latin"],
});

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className={`${montserrat.variable} a-font`}>{children}</div>;
}
