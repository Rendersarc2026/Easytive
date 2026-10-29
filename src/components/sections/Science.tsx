import { doctors, stats } from "@/data/site";
import { LabPattern, Portrait } from "../Illustrations";
import { ArrowRight, buttonStyles, Container, Eyebrow, toneBg } from "../ui";

// Slide 5 (Arrae): "The rigor behind every formula" stat cards over a lab image.
export function Rigor() {
  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-3xl bg-sage-dark text-paper">
        <LabPattern className="absolute inset-0 size-full" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-paper/70">Quality</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
            The rigor behind every formula
          </h2>
          <ul className="mt-12 grid gap-4 sm:mt-20 md:grid-cols-3 lg:gap-6">
            {stats.map((s) => (
              <li key={s.value} className="rounded-2xl border border-paper/15 bg-paper/10 p-6 backdrop-blur-md sm:p-8">
                <p className="font-display text-5xl font-medium sm:text-6xl">{s.value}</p>
                <p className="mt-4 max-w-[26ch] text-paper/80">{s.label}</p>
              </li>
            ))}
          </ul>
          <a href="#" className={`${buttonStyles.light} mt-10`}>
            View batch reports <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}

// Slide 7 (Ritual): "Scientific leadership" portrait cards.
export function Doctors() {
  return (
    <section id="experts" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <Eyebrow>Our experts</Eyebrow>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Scientific leadership</h2>
          </div>
          <p className="max-w-xl text-lg leading-relaxed text-ink-soft lg:justify-self-end">
            Urologists, gynaecologists and formulation scientists review every product and every article before it
            reaches you.
          </p>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {doctors.map((d) => (
            <li key={d.name}>
              <div className={`aspect-[4/5] overflow-hidden rounded-2xl ${toneBg[d.tone]}`}>
                <Portrait tone={d.tone} className="size-full" />
              </div>
              <h3 className="mt-4 font-display text-lg font-medium">{d.name}</h3>
              <p className="mt-1 text-sm text-muted">{d.degrees}</p>
              <p className="mt-1 text-sm">{d.title}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
