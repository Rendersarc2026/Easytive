import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { prelaunchNav } from "@/data/site";

// Pre-launch page: logo + blog header, hero and footer only. The full site lives on the
// `abin/future-update` branch; revert this commit to bring it back at launch.
export default function Home() {
  return (
    <>
      <Header slim items={prelaunchNav} />
      <main id="top">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
