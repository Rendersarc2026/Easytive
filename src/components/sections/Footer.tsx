import { footerLinks } from "@/data/site";
import { Logo } from "../Logo";
import { Container } from "../ui";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <Container className="pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="h-14 w-auto sm:h-20" />
            <p className="mt-4 text-[15px] text-paper/80">Easy does it. Made in India.</p>
          </div>

          <ul className="text-[13px] uppercase tracking-[0.06em]">
            {footerLinks.policies.map((l) => (
              <li key={l}>
                <a href="#" className="inline-block py-2 text-paper/90 hover:text-paper hover:underline">
                  {l}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex justify-between gap-8 lg:justify-start lg:gap-16">
            <ul className="text-[13px] uppercase tracking-[0.06em]">
              {footerLinks.site.map((l) => (
                <li key={l}>
                  <a href="#" className="inline-block py-2 text-paper/90 hover:text-paper hover:underline">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-1">
              <li>
                <a href="#" aria-label="Easytive on Instagram" className="grid size-10 place-items-center hover:opacity-70">
                  <InstagramIcon className="size-5" />
                </a>
              </li>
              <li>
                <a href="#" aria-label="Chat with Easytive on WhatsApp" className="grid size-10 place-items-center hover:opacity-70">
                  <WhatsAppIcon className="size-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid items-end gap-x-12 gap-y-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <a
            href="#"
            className="order-last inline-flex w-fit items-center gap-3 rounded-full bg-sage px-5 py-3 text-sm transition-colors hover:bg-sage-dark lg:order-first"
          >
            <GiftIcon className="size-5" />
            Easytive Rewards
          </a>
          <form action="#" className="flex max-w-md rounded-full border border-paper/70 lg:col-span-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              placeholder="Enter email to sign up for our newsletter"
              className="min-w-0 flex-1 rounded-l-full bg-transparent py-3 pl-5 text-base placeholder:text-paper/60 focus:outline-none lg:text-sm"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="-m-px grid w-24 shrink-0 place-items-center rounded-full border border-paper/70 transition-colors hover:bg-paper hover:text-ink"
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4" aria-hidden="true">
                <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </form>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-paper/15 pt-8 text-xs text-paper/50 md:flex-row md:justify-between">
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

// Floating WhatsApp chat button, bottom-right on every screen.
export function WhatsAppFloat() {
  return (
    <a
      href="#"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-4 right-4 z-30 grid size-14 place-items-center rounded-full bg-whatsapp text-paper shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)] transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.2l-4.5 1.3Z" strokeLinejoin="round" />
      <path
        d="M9 8.2c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.4 2.3.2.1.4.1.5-.1l.6-.6c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.4.6v.4c0 .4-.2.8-.6 1-.6.3-1.4.4-2.2.1-2.2-.8-4-2.6-4.8-4.8-.3-.9-.2-1.7.1-2.3Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function GiftIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <rect x="3.5" y="8" width="17" height="4" rx="1" />
      <path d="M5 12v8.5h14V12M12 8v12.5M12 8C10.5 4 6.5 4.5 7.5 7c.4 1 2.5 1 4.5 1Zm0 0c1.5-4 5.5-3.5 4.5-1-.4 1-2.5 1-4.5 1Z" />
    </svg>
  );
}
