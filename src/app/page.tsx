import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";

// Pre-launch page: hero + footer only. The full site lives on the
// `abin/future-update` branch; revert this commit to bring it back at launch.
export default function Home() {
  return (
    <>
      <main id="top">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
