import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Easytive | Daily urinary support",
  description:
    "Daily supplements for bladder and urinary tract health. An independent lab tests every batch.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
