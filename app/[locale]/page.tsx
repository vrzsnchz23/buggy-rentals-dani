import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Hero } from "@/components/sections/Hero";
import { CruiseBanner } from "@/components/sections/CruiseBanner";
import { WhyUs } from "@/components/sections/WhyUs";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Fleet } from "@/components/sections/Fleet";
import { Reviews } from "@/components/sections/Reviews";
import { Location } from "@/components/sections/Location";
import { FAQ } from "@/components/sections/FAQ";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CruiseBanner />
        <WhyUs />
        <Fleet />
        <HowItWorks />
        <Reviews />
        <Location />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
