import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import "./site.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Easytive | Daily urinary support",
  description:
    "Doctor-guided, third-party tested supplements for everyday bladder and urinary tract comfort.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
