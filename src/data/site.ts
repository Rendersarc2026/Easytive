// All homepage content lives here.
// PLACEHOLDER: products, prices, reviews, creators, articles and the claims in the
// "daily system" cards are sample copy. Replace with verified Easytive content before
// launch — health claims, credentials and testimonials must be real.

import type { StaticImageData } from "next/image";
import balconyReading from "@/assets/brand/balcony-reading.jpg";
import beachLaugh from "@/assets/brand/beach-laugh.jpg";
import bedJump from "@/assets/brand/bed-jump.jpg";
import bottleHand from "@/assets/brand/bottle-hand.jpg";
import bottlesLight from "@/assets/brand/bottles-light.jpg";
import friendsCar from "@/assets/brand/friends-car.jpg";
import hotelMorning from "@/assets/brand/hotel-morning.jpg";
import iconEmboss from "@/assets/brand/icon-emboss.jpg";
import sunsetDance from "@/assets/brand/sunset-dance.jpg";
import sunsetRocks from "@/assets/brand/sunset-rocks.jpg";
import windowBlur from "@/assets/brand/window-blur.jpg";

export type Tone = "sage" | "ink" | "rose" | "lilac" | "aqua" | "sand";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAt?: number;
  tone: Tone;
  badge?: string;
};

export const nav = [
  { label: "Shop", href: "#shop" },
  { label: "Science", href: "#system" },
  { label: "Stories", href: "#moments" },
  { label: "Reviews", href: "#reviews" },
  { label: "Journal", href: "#journal" },
];

// Short quotes for the ticker under the hero.
export const reviewCount = "12,400+";
export const quickReviews = [
  { quote: "Stopped planning around washrooms", name: "Priya S." },
  { quote: "Easiest habit I've kept", name: "Neha K." },
  { quote: "Finally sleeping through", name: "Rajesh M." },
  { quote: "Love that they publish test reports", name: "Farah A." },
  { quote: "Discreet, simple, works for me", name: "Sneha R." },
];

// "A daily system, precisely applied" — slides sideways on scroll.
export const system: { tag: string; title: string; body: string; image: StaticImageData; alt: string }[] = [
  {
    tag: "Clinically studied",
    title: "Urinary tract support",
    body: "36 mg cranberry PACs, the dose most studies use.",
    image: bottlesLight,
    alt: "Two clear Easytive bottles glowing in warm light",
  },
  {
    tag: "Fast-acting",
    title: "Everyday comfort",
    body: "D-Mannose sachets for the days you need a little more.",
    image: bottleHand,
    alt: "A hand holding a clear Easytive bottle",
  },
  {
    tag: "Botanical",
    title: "Bladder control",
    body: "Pumpkin seed and Punarnava, rooted in Ayurveda.",
    image: sunsetRocks,
    alt: "Two friends sitting on rocks by the sea at sunset",
  },
  {
    tag: "Probiotic",
    title: "Flora balance",
    body: "Lactobacillus strains chosen for women's urinary flora.",
    image: balconyReading,
    alt: "A woman reading in the sun on a balcony by the water",
  },
  {
    tag: "No added sugar",
    title: "Smart hydration",
    body: "Electrolytes that make drinking enough water easier.",
    image: windowBlur,
    alt: "A woman relaxing by a window overlooking the sea",
  },
  {
    tag: "Third-party tested",
    title: "Nothing hidden",
    body: "Every batch tested, every report published.",
    image: iconEmboss,
    alt: "The Easytive mark embossed on a dark pack",
  },
];

// Small round photos that sit inside the statement line.
export const statementImages = { a: bottlesLight, b: sunsetRocks, c: windowBlur };

export const products: Product[] = [
  {
    slug: "daily-urinary-support",
    name: "Easytive Daily",
    tagline: "Cranberry PACs + D-Mannose urinary support",
    price: 1199,
    compareAt: 1499,
    tone: "sage",
    badge: "Bestseller",
  },
  {
    slug: "comfort-sachets",
    name: "Easytive Comfort",
    tagline: "D-Mannose sachets, cranberry flavour",
    price: 899,
    compareAt: 1099,
    tone: "rose",
    badge: "New",
  },
  {
    slug: "pro-flora",
    name: "Easytive Pro-Flora",
    tagline: "Women's probiotic for urinary flora",
    price: 1249,
    compareAt: 1499,
    tone: "lilac",
    badge: "Bestseller",
  },
  {
    slug: "hydrate-plus",
    name: "Easytive Hydrate+",
    tagline: "Electrolyte drink mix, no added sugar",
    price: 749,
    compareAt: 899,
    tone: "aqua",
  },
];

// Creator reels: brand photos stand in for video posters.
export type ReelOverlay =
  | { kind: "title"; lines: [string, string] }
  | { kind: "pill"; text: string }
  | { kind: "inside"; label: string; value: string; detail: string };

export const reels: { image: StaticImageData; overlay: ReelOverlay; creator: string; product: string; caption: string }[] = [
  {
    image: hotelMorning,
    overlay: { kind: "title", lines: ["Morning", "Ritual"] },
    creator: "Wellness creator",
    product: "Easytive Daily",
    caption: "Morning ritual",
  },
  {
    image: friendsCar,
    overlay: { kind: "pill", text: "Road-trip ready" },
    creator: "Travel creator",
    product: "Easytive Daily",
    caption: "Road-trip ready",
  },
  {
    image: bottleHand,
    overlay: { kind: "inside", label: "what's inside:", value: "36 mg", detail: "cranberry PACs" },
    creator: "Unboxing",
    product: "Easytive Daily",
    caption: "What's inside: 36 mg cranberry PACs",
  },
  {
    image: sunsetDance,
    overlay: { kind: "title", lines: ["Stay for the", "last song"] },
    creator: "Wedding season",
    product: "Easytive Comfort",
    caption: "Stay for the last song",
  },
  {
    image: beachLaugh,
    overlay: { kind: "pill", text: "Beach day, all day" },
    creator: "Fitness creator",
    product: "Easytive Hydrate+",
    caption: "Beach day, all day",
  },
  {
    image: bedJump,
    overlay: { kind: "title", lines: ["Sleep through", "the night"] },
    creator: "Over-40 wellness",
    product: "Easytive Pro-Flora",
    caption: "Sleep through the night",
  },
];

export const moments: { image: StaticImageData; alt: string; label: string; line: string }[] = [
  { image: friendsCar, alt: "Two friends laughing in a convertible", label: "The road trip", line: "No pit-stop maths." },
  { image: sunsetDance, alt: "A couple dancing on a deck at sunset", label: "The party", line: "Stay for the last song." },
  { image: balconyReading, alt: "A woman reading on a sunny balcony", label: "The morning", line: "A slow one, uninterrupted." },
  { image: beachLaugh, alt: "A woman laughing on a sunny beach", label: "The beach day", line: "All day, all yours." },
  { image: windowBlur, alt: "A woman relaxing by a window over the sea", label: "The pause", line: "Nowhere you need to be." },
];

export const articles = [
  {
    title: "Cranberry vs D-Mannose: what the research says",
    author: "Dr. Ananya Rao",
    date: "12 Oct 2026",
    tag: "Ingredients",
    image: bottleHand,
  },
  {
    title: "How much water do you need? A realistic guide",
    author: "Easytive Team",
    date: "28 Sep 2026",
    tag: "Habits",
    image: hotelMorning,
  },
  {
    title: "Five pelvic floor exercises you can do at your desk",
    author: "Dr. Meera Nair",
    date: "09 Sep 2026",
    tag: "Movement",
    image: iconEmboss,
  },
];

export const footerLinks = {
  policies: ["Shipping policy", "Cancellation policy", "Terms & conditions", "Privacy policy"],
  site: ["Shop", "About", "Contact", "Journal", "Stockists"],
};
