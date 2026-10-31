// All homepage content lives here.
// PLACEHOLDER: prices, reviews, creators, doctors, press mentions, batch reports and the
// dose/testing claims are sample copy. Replace with verified Easytive content before
// launch. Health claims, credentials, press and testimonials must be real.

import type { StaticImageData } from "next/image";
import balconyReading from "@/assets/brand/balcony-reading.jpg";
import beachLaugh from "@/assets/brand/beach-laugh.jpg";
import bedJump from "@/assets/brand/bed-jump.jpg";
import bottleHand from "@/assets/brand/bottle-hand.jpg";
import bottlesLight from "@/assets/brand/bottles-light.jpg";
import friendsCar from "@/assets/brand/friends-car.jpg";
import hotelMorning from "@/assets/brand/hotel-morning.jpg";
import iconEmboss from "@/assets/brand/icon-emboss.jpg";
import logoSketch from "@/assets/brand/logo-sketch.jpg";
import sunsetDance from "@/assets/brand/sunset-dance.jpg";
import sunsetRocks from "@/assets/brand/sunset-rocks.jpg";
import windowBlur from "@/assets/brand/window-blur.jpg";

type Photo = { src: StaticImageData; alt: string };

export const announcement = ["Free shipping above Rs. 999", "Discreet packaging", "Cash on delivery"];

export const nav = [
  { label: "Shop", href: "#shop" },
  { label: "How it works", href: "#system" },
  { label: "Doctors", href: "#experts" },
  { label: "Creators", href: "#creators" },
  { label: "Journal", href: "#journal" },
];
export const drawerNav = [
  ...nav.slice(0, 2),
  { label: "Creators", href: "#creators" },
  { label: "Doctors", href: "#experts" },
  { label: "Stories", href: "#moments" },
  { label: "Journal", href: "#journal" },
  { label: "FAQ", href: "#faq" },
];

// ---- Products -------------------------------------------------------------

export type Product = {
  name: string;
  desc: string;
  price: number;
  badge?: string;
  tint: string; // glow behind the pack
  l1: string; // pack gradient, top
  l2: string; // pack gradient, bottom
  sachet?: boolean;
};

export const products = {
  daily: { name: "Easytive Daily", desc: "Cranberry PACs + D-Mannose, for everyday comfort", price: 1199, badge: "Bestseller", tint: "#EAD6C0", l1: "#F7EEE3", l2: "#EAD6C0" },
  flow: { name: "Easytive Flow", desc: "Pumpkin seed + saw palmetto, for men", price: 1349, tint: "#DAD7D0", l1: "#F0EEEA", l2: "#D3CFC7" },
  comfort: { name: "Easytive Comfort", desc: "D-Mannose sachets, cranberry flavour", price: 899, badge: "New", tint: "#EBD3CA", l1: "#F6E9E4", l2: "#E8CFC5", sachet: true },
  proFlora: { name: "Easytive Pro-Flora", desc: "Probiotic for women's urinary flora", price: 1249, tint: "#E3DBCB", l1: "#F5F2EC", l2: "#E1D9CA" },
  hydrate: { name: "Easytive Hydrate+", desc: "Electrolyte drink mix", price: 749, tint: "#D5DFDC", l1: "#F1F4F3", l2: "#D5DFDC" },
} satisfies Record<string, Product>;

export type ProductKey = keyof typeof products;
export const shopGrid: ProductKey[] = ["daily", "flow", "comfort", "proFlora"];

// ---- Hero: photos change automatically --------------------------------------
// Lifestyle photos share the lifestyle copy; the last photo carries the numbers.
// `hold` is how long each photo stays up (ms). `pos` is the CSS object-position.

export type BannerPhoto = Photo & { pos?: string };

export const heroPhotos: (BannerPhoto & { slide: "lifestyle" | "proof"; hold: number })[] = [
  { src: bedJump, alt: "A woman in a white robe leaps onto a hotel bed in warm lamplight", slide: "lifestyle", hold: 3000 },
  { src: hotelMorning, alt: "A woman in a robe sipping from a mug on the edge of a hotel bed", slide: "lifestyle", hold: 3000 },
  { src: sunsetDance, alt: "A couple dancing on a lakeside deck at sunset", slide: "lifestyle", hold: 3000, pos: "50% 30%" },
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

// PLACEHOLDER: list only publications that have actually covered Easytive.
export const press = ["The Times of India", "Forbes India", "Vogue India", "Femina", "Women's Health", "Mint"];

export const statementImages = { a: bottleHand, b: iconEmboss, c: sunsetRocks };

// ---- How it works: the sideways rail ---------------------------------------

export const steps: { image: Photo; pill: string; title: string; body: string }[] = [
  {
    image: { src: hotelMorning, alt: "A woman in a robe sipping from a mug on the edge of a hotel bed" },
    pill: "Morning · Daily",
    title: "Two capsules with breakfast",
    body: "Easytive Daily: 36 mg cranberry PACs and 2 g D-Mannose to start the day.",
  },
  {
    image: { src: bottlesLight, alt: "Two clear Easytive bottles with brushed metal caps in warm light" },
    pill: "Through the day · Hydrate+",
    title: "One scoop in your bottle",
    body: "Electrolytes for steady hydration at work, at the gym or on a long drive.",
  },
  {
    image: { src: friendsCar, alt: "Two women laughing in an open-top car" },
    pill: "When you need it · Comfort",
    title: "A sachet in your bag",
    body: "D-Mannose sachets for travel days, late nights and after intimacy.",
  },
  {
    image: { src: balconyReading, alt: "Someone in a white robe reading on a sunny balcony" },
    pill: "Evening · Pro-Flora",
    title: "Friendly flora before bed",
    body: "Lactobacillus strains for women, taken with dinner.",
  },
  {
    image: { src: iconEmboss, alt: "The Easytive mark embossed on a dark surface" },
    pill: "Every batch · Tested",
    title: "Checked before it ships",
    body: "Every batch goes to an independent lab. Enter your batch number to see the report.",
  },
];

// ---- Medical advisory board ------------------------------------------------
// PLACEHOLDER: names, roles and photos. Silhouettes until real headshots arrive.

export const doctors = [
  { name: "Dr. Ananya Rao", role: "Urology", reviews: "every formula and dose, and the claims on every pack." },
  { name: "Dr. Kabir Mehta", role: "Internal medicine", reviews: "interactions with common medicines and who should check with a doctor first." },
  { name: "Dr. Meera Nair", role: "Women's health", reviews: "Pro-Flora, Comfort and all advice for pregnancy and menopause." },
  { name: "Dr. Arjun Iyer", role: "Formulation", reviews: "ingredient sourcing, botanicals and every batch report." },
];

// ---- Creator reels ---------------------------------------------------------

export type ReelType =
  | { kind: "mix"; line: string; em: string }
  | { kind: "pill"; text: string }
  | { kind: "stack"; small: string; main: string; end: string };

export type Reel = {
  image: Photo;
  pos: "top" | "mid" | "low";
  type: ReelType;
  creator: string;
  product: ProductKey;
  /** Optional creator video; the photo is used as its poster. */
  video?: string;
};

export const reels: Reel[] = [
  {
    image: { src: hotelMorning, alt: "A woman in a robe sipping from a mug on the edge of a hotel bed" },
    pos: "low",
    type: { kind: "mix", line: "Morning", em: "Ritual" },
    creator: "Wellness creator",
    product: "daily",
  },
  {
    image: { src: friendsCar, alt: "Two women laughing in an open-top car" },
    pos: "top",
    type: { kind: "pill", text: "Road-trip ready" },
    creator: "Travel creator",
    product: "comfort",
  },
  {
    image: { src: bottleHand, alt: "A hand holding a clear Easytive bottle in warm light" },
    pos: "top",
    type: { kind: "stack", small: "what's inside:", main: "36 mg", end: "cranberry PACs." },
    creator: "Unboxing",
    product: "daily",
  },
  {
    image: { src: sunsetDance, alt: "A couple dancing on a lakeside deck at sunset" },
    pos: "low",
    type: { kind: "mix", line: "Stay for the", em: "last song" },
    creator: "Wedding season",
    product: "comfort",
  },
  {
    image: { src: beachLaugh, alt: "A woman laughing on the beach, framed by a straw hat brim" },
    pos: "top",
    type: { kind: "pill", text: "Beach day, all day" },
    creator: "Fitness creator",
    product: "hydrate",
  },
  {
    image: { src: bedJump, alt: "A woman leaping onto a hotel bed in warm lamplight" },
    pos: "mid",
    type: { kind: "stack", small: "and", main: "sleep through", end: "the night." },
    creator: "Over-40 wellness",
    product: "proFlora",
  },
];

// ---- Big reviews (rotate automatically) ------------------------------------

export const reviewCount = "12,400+";

export const reviews: { quote: string; name: string; about: string; product: ProductKey }[] = [
  {
    quote: "I used to map every outing around the nearest washroom. Three weeks on Daily, I sat through a full movie without getting up once.",
    name: "Priya S.",
    about: "Teacher, 41 · Kochi",
    product: "daily",
  },
  {
    quote: "My husband noticed before I did. I stopped asking him to pull over on the Bengaluru highway.",
    name: "Anjali R.",
    about: "Architect, 36 · Bengaluru",
    product: "comfort",
  },
  {
    quote: "At 63 I had made peace with broken sleep. Most nights now I sleep straight through to morning chai.",
    name: "Rajesh M.",
    about: "Retired banker, 63 · Thrissur",
    product: "flow",
  },
  {
    quote: "The box came in plain brown cardboard. Nobody at home asked. That mattered more than I expected.",
    name: "Farah A.",
    about: "Pharmacist, 35 · Hyderabad",
    product: "comfort",
  },
  {
    quote: "I read labels for a living. 36 mg PACs, 2 g D-Mannose, and a batch report I could actually look up. Sold.",
    name: "Neha K.",
    about: "Product designer, 29 · Pune",
    product: "daily",
  },
  {
    quote: "I bought it for my mother. Two weeks later she had taken over the box and I had to order my own.",
    name: "Sneha R.",
    about: "Marketing lead, 33 · Chennai",
    product: "proFlora",
  },
];

// ---- Moments -----------------------------------------------------------------

export const moments: { image: Photo; label: string; line: string }[] = [
  { image: { src: friendsCar, alt: "Two women laughing in an open-top car on a country road" }, label: "The road trip", line: "No pit-stop maths." },
  { image: { src: sunsetDance, alt: "A couple dancing on a lakeside deck at sunset" }, label: "The party", line: "Stay for the last song." },
  { image: { src: balconyReading, alt: "Someone reading on a sunny balcony over the water" }, label: "The morning", line: "A slow one, uninterrupted." },
  { image: { src: beachLaugh, alt: "A woman laughing on the beach under a straw hat brim" }, label: "The beach day", line: "All day, all yours." },
  { image: { src: windowBlur, alt: "A woman by a window overlooking the sea, softly out of focus" }, label: "The pause", line: "Nowhere you need to be." },
];

// ---- Journal -----------------------------------------------------------------

export const articles: { image: Photo; tag: string; title: string; author: string; date: string }[] = [
  {
    image: { src: bottleHand, alt: "A hand holding a clear Easytive bottle in warm light" },
    tag: "Ingredients",
    title: "Cranberry vs D-Mannose: what the research says",
    author: "Dr. Ananya Rao",
    date: "12 Oct 2026",
  },
  {
    image: { src: hotelMorning, alt: "A woman in a robe sipping from a mug on a hotel bed" },
    tag: "Habits",
    title: "How much water do you need? A realistic guide",
    author: "Easytive Team",
    date: "28 Sep 2026",
  },
  {
    image: { src: logoSketch, alt: "A pencil construction sketch of the Easytive mark" },
    tag: "Movement",
    title: "Five pelvic floor exercises you can do at your desk",
    author: "Dr. Meera Nair",
    date: "09 Sep 2026",
  },
];

// Bottom banner: photos cross-fade every BAND_MS.
export const BAND_MS = 4000;
export const bandPhotos: BannerPhoto[] = [
  { src: sunsetRocks, alt: "Two friends on sunlit rocks by the sea at golden hour", pos: "50% 55%" },
  { src: beachLaugh, alt: "A woman laughing on the beach, framed by a straw hat brim", pos: "50% 40%" },
  { src: sunsetDance, alt: "A couple dancing on a lakeside deck at sunset", pos: "50% 35%" },
  { src: balconyReading, alt: "Someone reading on a sunny balcony over the water", pos: "50% 55%" },
];

// ---- FAQ -----------------------------------------------------------------------
// Answers are plain strings; **word** is shown in bold.

export const faq: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Products",
    items: [
      {
        q: "Which Easytive is right for me?",
        a: "Start with **Easytive Daily** if you want everyday comfort; it suits both women and men. **Flow** is made for men, **Pro-Flora** for women's urinary flora, **Comfort** sachets are for travel days and late nights, and **Hydrate+** goes in your water bottle. Not sure? The Easy Start Bundle covers the three most popular.",
      },
      {
        q: "How long before I notice a difference?",
        a: "Supplements work gradually, not overnight. Take your product every day and give it at least eight weeks before you judge it. Consistency matters more than the dose on any single day.",
      },
      {
        q: "Is Easytive a treatment for UTIs?",
        a: "No. Easytive products are dietary supplements for everyday urinary comfort. They do not diagnose, treat, cure or prevent any disease. If you have burning, fever, blood in your urine or pain in your back or side, see a doctor.",
      },
      {
        q: "How is it different from cranberry juice?",
        a: "A glass of juice gives you an unknown amount of the active compounds along with a lot of sugar. Easytive Daily gives a measured **36 mg of cranberry PACs** and **2 g of D-Mannose** in every serving, and the label lists every ingredient and dose.",
      },
    ],
  },
  {
    group: "Safety",
    items: [
      {
        q: "Can I take it with my medicines?",
        a: "Most people can, but check with your doctor first if you take blood thinners such as warfarin, diabetes medicines, or anything prescribed for your kidneys or bladder.",
      },
      {
        q: "Can I take it if I'm pregnant or breastfeeding?",
        a: "Please speak to your doctor before taking any supplement while pregnant or breastfeeding.",
      },
      {
        q: "Who checks the quality?",
        a: "Every formula is reviewed by our medical advisory board, and every batch is tested by an independent lab for identity, potency, heavy metals and microbial limits. Enter the batch number from your pack to see its report.",
      },
    ],
  },
  {
    group: "Orders & delivery",
    items: [
      {
        q: "Will the box say what's inside?",
        a: "No. Every order ships in a plain outer box with a neutral sender name, and the bank statement shows a plain company name.",
      },
      { q: "Do you offer cash on delivery?", a: "Yes, across India. You can also pay online by UPI, card or net banking." },
      {
        q: "How much is shipping, and how long does it take?",
        a: "Shipping is free on orders above Rs. 999. The delivery estimate for your pin code is shown at checkout.",
      },
      {
        q: "Can I subscribe, pause or cancel?",
        a: "Yes. Subscribe and save on any product, and pause, skip or cancel any time from your account.",
      },
      {
        q: "What if something arrives damaged or wrong?",
        a: "Message us on WhatsApp with your order number and a photo, and we'll put it right. Full terms are on the Returns page.",
      },
    ],
  },
];

// ---- Footer ----------------------------------------------------------------------

export const footerCols = [
  { title: "Shop", links: [["All products", "#shop"], ["Bundles", "#shop"], ["For women", "#shop"], ["For men", "#shop"], ["Subscribe & save", "#shop"]] },
  { title: "Learn", links: [["Journal", "#journal"], ["How it works", "#system"], ["Ingredients", "#system"], ["Batch reports", "#system"], ["FAQ", "#faq"]] },
  { title: "Help", links: [["Contact us", "#top"], ["Shipping", "#top"], ["Returns", "#top"], ["Terms", "#top"], ["Privacy", "#top"]] },
] as const;

export function formatPrice(n: number) {
  return `Rs. ${n.toLocaleString("en-IN")}`;
}
