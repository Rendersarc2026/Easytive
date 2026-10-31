import Image, { type StaticImageData } from "next/image";
import { moments, statementImages } from "@/data/site";
import { Carousel } from "../Carousel";
import { buttonStyles, Container, Eyebrow, TextLink, Title } from "../ui";

function Dot({ src }: { src: StaticImageData }) {
  return (
    <span
      aria-hidden="true"
      className="relative mx-[0.12em] inline-block size-[0.82em] overflow-hidden rounded-full align-[-0.08em]"
    >
      <Image src={src} alt="" fill sizes="64px" className="object-cover" />
    </span>
  );
}

// Centred statement line with small round photos set into the text.
export function Statement() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="text-center">
        <Eyebrow>Easy does it</Eyebrow>
        <p className="mx-auto mt-6 max-w-4xl text-balance font-display text-3xl leading-[1.25] tracking-tight sm:text-5xl sm:leading-[1.2]">
          One capsule <Dot src={statementImages.a} /> with breakfast. Then <Dot src={statementImages.b} /> you get on{" "}
          <Dot src={statementImages.c} /> <em>with your day.</em>
        </p>
      </Container>
    </section>
  );
}

// Everyday moments: square-cornered photos running off the edge.
export function Moments() {
  return (
    <section id="moments" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <Carousel
          label="Easy moments"
          controls={false}
          aside={<TextLink href="#">More stories</TextLink>}
          heading={
            <>
              <Eyebrow>Easy moments</Eyebrow>
              <Title className="mt-4">
                Long drives, <em>late nights</em>
              </Title>
            </>
          }
        >
          {moments.map((m) => (
            <figure key={m.label} className="w-[72%] shrink-0 snap-start sm:w-[40%] lg:w-[calc((100%-48px)/3.6)] 2xl:w-[calc((100%-64px)/4.3)]">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone">
                <Image
                  src={m.image}
                  alt={m.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1536px) 350px, (min-width: 1024px) 26vw, (min-width: 640px) 40vw, 72vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <span className="block text-[10px] uppercase tracking-[0.24em] text-muted">{m.label}</span>
                <span className="mt-1.5 block font-display text-lg">{m.line}</span>
              </figcaption>
            </figure>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}

// Two-column sourcing note: large lead on the left, detail and a button on the right.
export function Sourcing() {
  return (
    <section className="border-y border-line py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-2 lg:gap-24">
        <p className="text-2xl leading-snug text-ink sm:text-[32px] sm:leading-[1.35]">
          We only use ingredients that have been studied, at the doses the studies used. Each extract is
          standardised, so every capsule has the same amount in it.
        </p>
        <div className="lg:pt-2">
          <p className="text-[15px] leading-loose text-ink-soft">
            Our suppliers send test data for every ingredient we buy. Then an independent lab checks each finished
            batch for purity and strength, and we put the reports on our site.
          </p>
          <a href="#" className={`${buttonStyles.outline} mt-8 px-10`}>
            Read the lab reports
          </a>
        </div>
      </Container>
    </section>
  );
}
