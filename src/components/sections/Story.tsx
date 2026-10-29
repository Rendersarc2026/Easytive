import { ingredients } from "@/data/site";
import { Bottle } from "../Illustrations";
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

export function Formula() {
  return (
    <section id="science" className="scroll-mt-20 py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-last aspect-square overflow-hidden rounded-3xl bg-sand-50 lg:order-first">
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper/70" />
          <Bottle tone="sage" name="Easytive Daily" className="absolute inset-x-0 bottom-[12%] mx-auto w-[46%]" />
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
