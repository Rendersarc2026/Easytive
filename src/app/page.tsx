import { BagProvider } from "@/components/Bag";
import { Header } from "@/components/Header";
import { Board } from "@/components/sections/Board";
import { Creators } from "@/components/sections/Creators";
import { DailySystem } from "@/components/sections/DailySystem";
import { Faq } from "@/components/sections/Faq";
import { Footer, WhatsAppFloat } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { PressBar, Statement } from "@/components/sections/Intro";
import { Journal } from "@/components/sections/Journal";
import { Products } from "@/components/sections/Products";
import { Reviews } from "@/components/sections/Reviews";
import { Band, Moments, Note } from "@/components/sections/Story";

// Section order follows the "Easytive Website" reference page.
export default function Home() {
  return (
    <BagProvider>
      <Header />
      <main id="top">
        <Hero />
        <PressBar />
        <Statement />
        <Products />
        <DailySystem />
        <Board />
        <Creators />
        <Reviews />
        <Moments />
        <Note />
        <Journal />
        <Band />
        <Faq />
      </main>
      <Footer />
      <WhatsAppFloat />
    </BagProvider>
  );
}
