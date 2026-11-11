// Default content for the pre-launch site (Home and About). The full-site
// content (products, reviews, FAQ, creators…) lives on the abin/future-update branch.
// PLACEHOLDER: doctors and the dose/testing claims are sample copy. Replace with
// verified Easytive content before launch.

import type { StaticImageData } from "next/image";
import bedJump from "@/assets/brand/bed-jump.jpg";
import bottlesLight from "@/assets/brand/bottles-light.jpg";
import hotelMorning from "@/assets/brand/hotel-morning.jpg";
import sunsetDance from "@/assets/brand/sunset-dance.jpg";

// `src` is a built-in import, or a "/media/..." path for an image uploaded in the admin.
type Photo = { src: StaticImageData | string; alt: string };

/** next/image blur placeholders exist only for built-in imports. */
export const placeholderFor = (src: StaticImageData | string) => (typeof src === "string" ? "empty" : "blur");

// Pre-launch header: Home, About us and the blog, nothing else.
export const prelaunchNav: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Blogs", href: "/blog" },
];

// ---- Hero: photos change automatically --------------------------------------
// Lifestyle photos share the lifestyle copy; the last photo carries the numbers.
// `hold` is how long each photo stays up (ms). `pos` is the CSS object-position.

export type BannerPhoto = Photo & { pos?: string };

export const heroPhotos: (BannerPhoto & { slide: "lifestyle" | "proof"; hold: number })[] = [
  { src: bedJump, alt: "A woman in a white robe leaps onto a hotel bed in warm lamplight", slide: "lifestyle", hold: 5000 },
  { src: hotelMorning, alt: "A woman in a robe sipping from a mug on the edge of a hotel bed", slide: "lifestyle", hold: 5000 },
  { src: sunsetDance, alt: "A couple dancing on a lakeside deck at sunset", slide: "lifestyle", hold: 5000, pos: "50% 30%" },
  { src: bottlesLight, alt: "Two clear Easytive bottles with brushed metal caps in warm light", slide: "proof", hold: 5000 },
];

export const heroCopy = {
  lifestyle: { tag: "Easy does it" },
  proof: {
    tag: "The proof",
    stats: [
      { value: "36 mg", label: "cranberry PACs, the dose used in published studies" },
      { value: "2 g", label: "D-Mannose per serving" },
      { value: "100%", label: "of batches checked by an independent lab" },
      { value: "4", label: "doctors review every formula" },
    ],
  },
};

// ---- Medical advisory board ------------------------------------------------
// PLACEHOLDER: names, roles and photos. Silhouettes until real headshots arrive.

export const doctors = [
  { name: "Dr. Ananya Rao", role: "Urology", reviews: "every formula and dose, and the claims on every pack." },
  { name: "Dr. Kabir Mehta", role: "Internal medicine", reviews: "interactions with common medicines and who should check with a doctor first." },
  { name: "Dr. Meera Nair", role: "Women's health", reviews: "Pro-Flora, Comfort and all advice for pregnancy and menopause." },
  { name: "Dr. Arjun Iyer", role: "Formulation", reviews: "ingredient sourcing, botanicals and every batch report." },
];

// ---- About page ---------------------------------------------------------------
// Copy from the "About Easytive" brief. In headings, *word* is shown in italics.

type AboutPrinciple = { label: string; title: string; body: string };

export type AboutCopy = {
  eyebrow: string;
  heading: string;
  intro: string;
  statement: string;
  story: string[];
  valuesHeading: string;
  principles: AboutPrinciple[];
  teamHeading: string;
  teamSub: string;
};

export const aboutCopy: AboutCopy = {
  eyebrow: "About Easytive",
  heading: "Make room for *more* of life.",
  intro:
    "Easytive is a science-led health brand committed to expanding the possibilities of everyday life. We bring together global health research and the expertise of doctors and scientists to develop thoughtful care that helps people live beyond the limitations of their health.",
  statement: "No one should have to live a smaller life because of their body.",
  story: [
    "Health shapes how we experience the world. Yet, many health concerns quietly influence the choices we make, the experiences we avoid and the possibilities we hold back from.",
    "We believe this should not be the way.",
    "Easytive was founded on a simple conviction: better science should lead to better ways of living. We follow advances in health research, work alongside doctors and scientists, and translate scientific understanding into thoughtful every day care that makes a meaningful difference in people's lives.",
    "We began with urinary health, an essential part of wellbeing that deserves greater understanding, better conversations and more considered care.",
    "Our ambition goes beyond any one area of health. As science advances, so will our work, continually exploring new ways to help people experience life with greater freedom and fewer limitations.",
  ],
  valuesHeading: "What guides *us*",
  principles: [
    {
      label: "Research",
      title: "Grounded in science. Informed by the world.",
      body: "We look beyond boundaries to follow the latest clinical research and scientific discoveries. We examine the evidence, understand its relevance and consider the needs of the people and communities we serve.",
    },
    {
      label: "Formulation",
      title: "Thoughtfully developed for real human needs.",
      body: "Human health is complex and individual. We consider the science behind age, genetics, lifestyle and other influencing factors to develop formulations with purpose, precision and individual differences in mind.",
    },
    {
      label: "Advice",
      title: "Expertise behind every decision.",
      body: "Medical knowledge is fundamental to what we do. Doctors and scientists guide our approach, bringing clinical understanding and scientific scrutiny to our formulations and the health information we share.",
    },
  ],
  teamHeading: "Meet the minds behind the *science*.",
  teamSub: "Doctors and scientists guide our approach to health, shape our formulations and bring scientific knowledge into everyday care.",
};
