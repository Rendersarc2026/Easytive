import { products } from "@/data/site";
import { Bottle } from "../Illustrations";
import { Container, formatPrice, Title } from "../ui";

export function Products() {
  return (
    <section id="shop" className="scroll-mt-24 bg-stone-50 py-20 sm:py-28">
      <Container>
        <div className="grid items-end gap-6 lg:grid-cols-[1.2fr_1fr_auto] lg:gap-12">
          <Title>
            Shop the <em>range</em>
          </Title>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Four products. Most people start with Daily and add the others only if they need them.
          </p>
          <a
            href="#"
            className="inline-flex min-h-11 items-center gap-2.5 text-[11px] uppercase tracking-[0.24em] transition-opacity hover:opacity-60"
          >
            Shop all <span aria-hidden="true" className="size-1.5 rounded-full bg-ink" />
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {products.map((p) => (
            <li key={p.slug}>
              <a
                href="#"
                className="group flex h-full flex-col rounded-2xl bg-paper p-3 transition-shadow hover:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)] sm:p-4"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-50">
                  {p.badge && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-stone px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] sm:text-[10px]">
                      {p.badge}
                    </span>
                  )}
                  <Bottle
                    tone={p.tone}
                    name={p.name}
                    className="absolute inset-x-0 bottom-[6%] mx-auto w-[52%] transition-transform duration-500 group-hover:-translate-y-2"
                  />
                </div>
                <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
                  <h3 className="font-display text-lg leading-snug sm:text-xl">{p.name}</h3>
                  <p className="mt-1 flex-1 text-[13px] leading-snug text-muted">{p.tagline}</p>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="sr-only">Sale price </span>
                    <span className="whitespace-nowrap">{formatPrice(p.price)}</span>
                    {p.compareAt && (
                      <>
                        <span className="sr-only"> Regular price </span>
                        <s className="whitespace-nowrap text-muted">{formatPrice(p.compareAt)}</s>
                      </>
                    )}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
