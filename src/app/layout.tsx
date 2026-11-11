import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import "./site.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Defaults for every page. Pages set their own `title` (shown as "<title> · Easytive")
// and `alternates.canonical`. The share image is app/opengraph-image.jpg.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} · Everyday bladder and urinary tract comfort`, template: `%s · ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { type: "website", siteName: SITE_NAME },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
