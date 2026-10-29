import { products } from "@/data/site";
import { Carousel } from "../Carousel";
import { Bottle } from "../Illustrations";
import { Container, Eyebrow, formatPrice, toneBg } from "../ui";

export function Products() {
  return (
    <section id="shop" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <Carousel
          label="Products"
          heading={
            <>
              <Eyebrow>Shop</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-5xl">Find your easy</h2>
            </>
          }
        >
          {products.map((p) => {
            const off = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
            return (
              <article key={p.slug} className="group w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-72px)/4)]">
                <a href="#" className="block">
                  <div className={`relative aspect-[4/5] overflow-hidden rounded-2xl ${toneBg[p.tone]}`}>
                    {p.badge && (
                      <span className="absolute left-4 top-4 z-10 rounded-full bg-paper px-3 py-1 text-xs font-medium">
                        {p.badge}
                      </span>
                    )}
                    <Bottle
                      tone={p.tone}
                      name={p.name}
                      className="absolute inset-x-0 bottom-[6%] mx-auto w-[62%] transition-transform duration-500 group-hover:-translate-y-2"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-medium">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted">{p.tagline}</p>
                </a>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className="sr-only">Sale price </span>
                    <span className="whitespace-nowrap font-medium">{formatPrice(p.price)}</span>
                    {p.compareAt && (
                      <>
                        <span className="sr-only"> Regular price </span>
                        <s className="whitespace-nowrap text-muted">{formatPrice(p.compareAt)}</s>
                        <span className="whitespace-nowrap text-sage">{off}% off</span>
                      </>
                    )}
                  </p>
                  <button
                    type="button"
                    aria-label={`Add ${p.name} to cart`}
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-ink text-lg leading-none transition hover:bg-ink hover:text-paper"
                  >
                    +
                  </button>
                </div>
              </article>
            );
          })}
        </Carousel>
      </Container>
    </section>
  );
}
