import Image, { type StaticImageData } from "next/image";
import beachLaugh from "@/assets/brand/beach-laugh.jpg";
import bedJump from "@/assets/brand/bed-jump.jpg";
import bottleHand from "@/assets/brand/bottle-hand.jpg";
import hotelMorning from "@/assets/brand/hotel-morning.jpg";
import sunsetRocks from "@/assets/brand/sunset-rocks.jpg";
import { ingredients } from "@/data/site";
import { ArrowRight, Container, Eyebrow } from "../ui";

// Gunam-style large statement line, followed by a text + image split.
export function Intro() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <Container>
        <p className="mx-auto max-w-4xl text-center font-display text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
          Urinary health is personal. We make it simple: clean formulas, honest labels, and doctors you can
          actually hear from.
        </p>
      </Container>
    </section>
  );
}

// Brand photography from the guidelines deck, under the "Easy does it" tagline.
const moments: { src: StaticImageData; alt: string; className: string; sizes: string }[] = [
  {
    src: bedJump,
    alt: "A woman in a white robe leaping onto a hotel bed",
    className: "col-span-2 lg:col-span-2",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
  {
    src: sunsetRocks,
    alt: "Two friends sitting on rocks by the sea at sunset",
    className: "row-span-2",
    sizes: "(min-width: 1024px) 25vw, 50vw",
  },
  {
    src: beachLaugh,
    alt: "A woman laughing on a sunny beach",
    className: "row-span-2",
    sizes: "(min-width: 1024px) 25vw, 50vw",
  },
  {
    src: hotelMorning,
    alt: "A woman sipping coffee on the edge of a bed in a calm hotel room",
    className: "col-span-2 lg:col-span-2",
    sizes: "(min-width: 1024px) 50vw, 100vw",
  },
];

export function Lifestyle() {
  return (
    <section aria-labelledby="easy-does-it" className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="easy-does-it" className="font-display text-4xl font-medium tracking-tight sm:text-6xl">
            Easy does it.
          </h2>
          <p className="max-w-sm text-lg leading-relaxed text-ink-soft">
            Fewer detours, longer evenings, uninterrupted sleep. That&apos;s the whole idea.
          </p>
        </div>
        <ul className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[260px] sm:gap-4 lg:auto-rows-[300px] lg:grid-cols-4 lg:gap-6">
          {moments.map((m) => (
            <li key={m.alt} className={`relative overflow-hidden rounded-2xl bg-sand-50 ${m.className}`}>
              <Image src={m.src} alt={m.alt} fill placeholder="blur" sizes={m.sizes} className="object-cover" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function Formula() {
  return (
    <section id="science" className="scroll-mt-20 py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-last aspect-square overflow-hidden rounded-3xl bg-sand-50 lg:order-first">
          <Image
            src={bottleHand}
            alt="A hand holding a clear Easytive bottle against a warm backdrop"
            fill
            placeholder="blur"
            sizes="(min-width: 1320px) 580px, (min-width: 1024px) 45vw, 100vw"
            className="object-cover object-[48%_50%]"
          />
          <span className="absolute left-[6%] top-[8%] rounded-full bg-paper px-3 py-1.5 text-xs shadow-sm sm:left-[8%] sm:top-[14%] sm:px-4 sm:py-2 sm:text-sm">36 mg PACs</span>
          <span className="absolute right-[6%] top-[20%] rounded-full bg-paper px-3 py-1.5 text-xs shadow-sm sm:right-[8%] sm:top-[34%] sm:px-4 sm:py-2 sm:text-sm">2 g D-Mannose</span>
          <span className="absolute bottom-[6%] left-[6%] rounded-full bg-paper px-3 py-1.5 text-xs shadow-sm sm:bottom-[10%] sm:left-[10%] sm:px-4 sm:py-2 sm:text-sm">No added sugar</span>
        </div>

        <div>
          <Eyebrow>The formula</Eyebrow>
          <h2 className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            Formulated for
            <br />
            comfort &amp; confidence
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Studied key ingredients at meaningful doses, paired with botanicals with roots in Ayurveda. Nothing you
            don&apos;t need.
          </p>
          <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
            {ingredients.map((i) => (
              <li key={i.name} className="border-t border-line py-4">
                <p className="font-display font-medium">{i.name}</p>
                <p className="mt-0.5 text-sm text-muted">{i.note}</p>
              </li>
            ))}
          </ul>
          <a href="#" className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-medium hover:text-sage">
            Explore every ingredient <ArrowRight />
          </a>
        </div>
      </Container>
    </section>
  );
}
