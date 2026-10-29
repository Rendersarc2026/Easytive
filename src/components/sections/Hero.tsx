import { Bottle } from "../Illustrations";
import { ArrowRight, buttonStyles, Container } from "../ui";

export function Hero() {
  return (
    <section id="top" className="relative -mt-16 overflow-hidden bg-sage-50 pt-16 sm:-mt-20 sm:pt-20">
      <div aria-hidden="true" className="absolute -right-40 -top-40 size-[640px] rounded-full bg-aqua-50 opacity-80 blur-3xl" />
      <Container className="relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
        <div>
          <p className="mb-6 flex flex-wrap gap-x-2 text-sm text-sage-dark">
            <span>Urinary wellness ·</span>
            <span>Doctor-guided ·</span>
            <span className="whitespace-nowrap">Third-party tested</span>
          </p>
          <h1 className="font-display text-[44px] font-medium leading-[1.02] tracking-tight sm:text-6xl lg:text-[84px]">
            Feel easy,
            <br />
            every day.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Gentle, science-backed supplements for bladder and urinary tract comfort, so you can stop planning your day
            around the nearest washroom.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#shop" className={buttonStyles.primary}>
              Shop products <ArrowRight />
            </a>
            <a href="#science" className={buttonStyles.outline}>
              See the science
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[520px] items-end justify-center">
          <div aria-hidden="true" className="absolute inset-x-6 bottom-6 top-10 rounded-[48%] bg-paper/70" />
          <Bottle tone="rose" name="Easytive Comfort" className="relative -mr-10 w-[38%] translate-y-4" />
          <Bottle tone="sage" name="Easytive Daily" className="relative z-10 w-[48%]" />
          <Bottle tone="ink" name="Easytive Flow" className="relative -ml-10 w-[38%] translate-y-4" />
        </div>
      </Container>
    </section>
  );
}
