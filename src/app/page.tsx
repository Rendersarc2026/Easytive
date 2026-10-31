import { Header } from "@/components/Header";
import { DailySystem } from "@/components/sections/DailySystem";
import { Footer, WhatsAppFloat } from "@/components/sections/Footer";
import { Hero, ReviewTicker } from "@/components/sections/Hero";
import { Journal } from "@/components/sections/Journal";
import { Products } from "@/components/sections/Products";
import { Reels, WallOfLove } from "@/components/sections/Reviews";
import { Moments, Sourcing, Statement } from "@/components/sections/Story";

// Section order follows the reference slide: left column top-to-bottom, then the right column.
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ReviewTicker />
        <DailySystem />
        <Statement />
        <Products />
        <Reels />
        <Moments />
        <Sourcing />
        <Journal />
        <WallOfLove />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
