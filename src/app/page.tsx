import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Journal, LearnHub } from "@/components/sections/Learn";
import { PressStrip } from "@/components/sections/PressStrip";
import { Products } from "@/components/sections/Products";
import { Reviews } from "@/components/sections/Reviews";
import { Doctors, Rigor } from "@/components/sections/Science";
import { Formula, Intro } from "@/components/sections/Story";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PressStrip />
        <Intro />
        <Products />
        <Formula />
        <Rigor />
        <Doctors />
        <Reviews />
        <LearnHub />
        <Journal />
      </main>
      <Footer />
    </>
  );
}
