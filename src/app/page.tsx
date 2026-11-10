import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { getSiteData } from "@/data/store";
import { prelaunchNav } from "@/data/site";

// Pre-launch page: logo + blog header, hero and footer only. The full site lives on the
// `abin/future-update` branch; revert this commit to bring it back at launch.
// Copy comes from the admin's merged content (data/store).
export default async function Home() {
  const { announcement, hero } = await getSiteData();
  return (
    <>
      <Header slim items={prelaunchNav} announcement={announcement} />
      <main id="top">
        <Hero copy={hero} />
      </main>
      <Footer />
    </>
  );
}
