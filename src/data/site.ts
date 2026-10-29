// All homepage content lives here.
// PLACEHOLDER: products, prices, press names, stats, doctors, testimonials and
// articles and Instagram reels are sample copy. Replace with verified Easytive content before launch —
// health claims, credentials and press mentions must be real.

import balconyReading from "@/assets/brand/balcony-reading.jpg";
import beachLaugh from "@/assets/brand/beach-laugh.jpg";
import bottleHand from "@/assets/brand/bottle-hand.jpg";
import friendsCar from "@/assets/brand/friends-car.jpg";
import hotelMorning from "@/assets/brand/hotel-morning.jpg";
import sunsetRocks from "@/assets/brand/sunset-rocks.jpg";
import windowBlur from "@/assets/brand/window-blur.jpg";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  price: number;
  compareAt?: number;
  tone: "sage" | "ink" | "rose" | "lilac" | "aqua" | "sand";
  badge?: string;
};

export const announcement = {
  full: "Free shipping on orders above Rs. 999 · Discreet packaging on every order",
  short: "Free shipping above Rs. 999 · Discreet packaging",
};

export const nav = [
  { label: "Shop", href: "#shop" },
  { label: "Science", href: "#science" },
  { label: "Experts", href: "#experts" },
  { label: "Reviews", href: "#reviews" },
  { label: "Journal", href: "#journal" },
];

export const press = [
  "Wellness Weekly",
  "The Health Desk",
  "Urban Living",
  "Daily Ledger",
  "Mint Lifestyle",
  "Startup Chronicle",
];

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
    slug: "flow-for-men",
    name: "Easytive Flow",
    tagline: "Pumpkin seed + saw palmetto for men",
    price: 1349,
    compareAt: 1599,
    tone: "ink",
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
  },
  {
    slug: "hydrate-plus",
    name: "Easytive Hydrate+",
    tagline: "Electrolyte drink mix, no added sugar",
    price: 749,
    compareAt: 899,
    tone: "aqua",
  },
  {
    slug: "starter-bundle",
    name: "The Easy Start Bundle",
    tagline: "Daily + Comfort + Hydrate+",
    price: 2499,
    compareAt: 3097,
    tone: "sand",
  },
];

export const ingredients = [
  { name: "Cranberry PACs", note: "Standardised proanthocyanidins" },
  { name: "D-Mannose", note: "A naturally occurring simple sugar" },
  { name: "Pumpkin seed", note: "Traditional bladder support" },
  { name: "Punarnava", note: "Rooted in Ayurveda" },
  { name: "Vitamin C", note: "Antioxidant support" },
  { name: "Lactobacillus strains", note: "Friendly flora" },
];

export const stats = [
  { value: "100%", label: "of batches third-party tested for purity and potency" },
  { value: "40+", label: "ingredients evaluated before we chose our formulas" },
  { value: "2+", label: "years of research and development" },
];

export const doctors = [
  {
    name: "Dr. Ananya Rao",
    degrees: "MBBS, MS, MCh (Urology)",
    title: "Head of Clinical Advisory",
    tone: "sage" as const,
  },
  {
    name: "Dr. Kabir Mehta",
    degrees: "MBBS, MD (Internal Medicine)",
    title: "Medical Advisor",
    tone: "aqua" as const,
  },
  {
    name: "Dr. Meera Nair",
    degrees: "MBBS, DGO, MS (Obstetrics & Gynaecology)",
    title: "Women's Health Advisor",
    tone: "rose" as const,
  },
  {
    name: "Dr. Arjun Iyer",
    degrees: "PhD (Pharmacognosy)",
    title: "Head of Formulation",
    tone: "sand" as const,
  },
];

// Dummy Instagram reels: brand photos stand in for video posters.
export const reels = [
  { image: beachLaugh, handle: "@priya.outdoors", caption: "Beach day, zero washroom math", views: "128K" },
  { image: friendsCar, handle: "@roadtrip.duo", caption: "6-hour drive. Two stops. Both for snacks.", views: "94.2K" },
  { image: hotelMorning, handle: "@slowmornings", caption: "My 7am routine, now with Easytive Daily", views: "61.8K" },
  { image: bottleHand, handle: "@easytive", caption: "What's actually inside one capsule", views: "203K" },
  { image: sunsetRocks, handle: "@neha.k", caption: "Finally staying for the whole sunset", views: "47.5K" },
  { image: balconyReading, handle: "@dr.ananya.rao", caption: "3 myths about UTIs, busted in 30 seconds", views: "156K" },
];

export const testimonials = [
  {
    quote:
      "I used to plan every outing around the nearest washroom. A few months on Easytive Daily and I finally stopped thinking about it.",
    name: "Priya S.",
    role: "Teacher, 41",
    tone: "sage" as const,
  },
  {
    quote:
      "Discreet packaging, no fuss, and the sachets actually taste good. It's become part of my morning routine.",
    name: "Neha K.",
    role: "Product designer, 29",
    tone: "rose" as const,
  },
  {
    quote:
      "My doctor suggested pumpkin seed and saw palmetto. Easytive Flow had both in one capsule, which made it easy to stay consistent.",
    name: "Rajesh M.",
    role: "Retired banker, 63",
    tone: "ink" as const,
  },
  {
    quote:
      "I liked that they publish test reports. For something this personal, that transparency matters.",
    name: "Farah A.",
    role: "Pharmacist, 35",
    tone: "aqua" as const,
  },
  {
    quote:
      "Bought it for my mother, ended up ordering for myself too. Customer support on WhatsApp was quick and kind.",
    name: "Sneha R.",
    role: "Marketing lead, 33",
    tone: "lilac" as const,
  },
];

export const learn = [
  {
    kicker: "Newsletter",
    title: "The Easy Letter",
    body: "One short, myth-busting email a fortnight on bladder health, hydration and habits.",
    cta: "Subscribe",
    tone: "sage" as const,
  },
  {
    kicker: "Academy",
    title: "Easytive Academy",
    body: "Plain-language guides, reviewed by our doctors, on everything from UTIs to pelvic floor care.",
    cta: "Start learning",
    tone: "aqua" as const,
  },
  {
    kicker: "Ingredient lookup",
    title: "What's in it?",
    body: "Search any ingredient to see why it's there, how much we use, and the research behind it.",
    cta: "Search ingredients",
    tone: "sand" as const,
  },
  {
    kicker: "Test reports",
    title: "Batch reports",
    body: "Enter the batch number on your pack to download its third-party lab report.",
    cta: "Find your batch",
    tone: "rose" as const,
  },
];

export const articles = [
  {
    title: "Cranberry vs D-Mannose: what the research says",
    author: "Dr. Ananya Rao",
    date: "Oct 12, 2026",
    tag: "Ingredients",
    tone: "rose" as const,
    image: balconyReading,
  },
  {
    title: "How much water do you need? A realistic guide",
    author: "Easytive Team",
    date: "Sep 28, 2026",
    tag: "Habits",
    tone: "aqua" as const,
    image: windowBlur,
  },
  {
    title: "Five pelvic floor exercises you can do at your desk",
    author: "Dr. Meera Nair",
    date: "Sep 09, 2026",
    tag: "Movement",
    tone: "sage" as const,
    image: friendsCar,
  },
];

export const footerLinks = {
  shop: ["All products", "Bundles", "For women", "For men", "Subscribe & save"],
  learn: ["Journal", "Academy", "Ingredient lookup", "Batch reports", "FAQ"],
  help: ["Contact us", "Shipping", "Returns", "Terms & Conditions", "Privacy Policy"],
};
