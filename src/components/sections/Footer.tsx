import { footerLinks } from "@/data/site";
import { Container } from "../ui";

export function Footer() {
  const columns = [
    ["Shop", footerLinks.shop],
    ["Learn", footerLinks.learn],
    ["Help", footerLinks.help],
  ] as const;

  return (
    <footer className="bg-ink text-paper">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <p className="font-display text-5xl font-medium tracking-tight sm:text-6xl">easytive</p>
            <p className="mt-3 text-paper/60">Everyday urinary wellness. Made in India.</p>
            <form action="#" className="mt-8 flex max-w-sm border-b border-paper/40">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent py-3 text-base placeholder:text-paper/50 focus:outline-none lg:text-sm"
              />
              <button type="submit" aria-label="Subscribe" className="grid w-11 place-items-center hover:text-sage-50">
                <svg viewBox="0 0 17 15" className="w-4 rotate-180 fill-current" aria-hidden="true">
                  <path d="M1.275 7.981c2.319.742 7.187 3.915 8.869 5.169-.155.358-.405 1.125-.522 1.433A69.85 69.85 0 0 0 0 7.9V6.651A67 67 0 0 0 9.622 0c.116.306.369 1.074.522 1.433-1.681 1.228-6.55 4.4-8.869 5.143v.179c1.43-.049 4.965-.1 7.478-.1 2.454 0 5.969 0 8.1-.049v1.4c-2.126-.076-5.642-.1-8.1-.1-2.513 0-6.05-.045-7.478-.073Z" />
                </svg>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map(([title, links]) => (
              <div key={title}>
                <p className="text-xs uppercase tracking-[0.18em] text-paper/50">{title}</p>
                <ul className="mt-3 text-sm">
                  {links.map((l) => (
                    <li key={l}>
                      <a href="#" className="inline-block py-2 text-paper/85 hover:text-paper lg:py-1.5">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/15 pt-8 text-xs text-paper/50 md:flex-row md:justify-between">
          <p className="max-w-2xl">
            These statements have not been evaluated by any regulatory authority. Easytive products are dietary
            supplements and are not intended to diagnose, treat, cure or prevent any disease. Consult your doctor
            before use if you are pregnant, nursing or on medication.
          </p>
          <p className="shrink-0">© 2026 Easytive</p>
        </div>
      </Container>
    </footer>
  );
}
