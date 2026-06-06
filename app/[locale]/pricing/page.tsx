import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/sections/Pricing";
import { getLocale } from "next-intl/server";

export const metadata = {
  title: "Pricing | Buggy Rentals with Dani – Cozumel",
  description: "Simple, transparent pricing for buggy and compact car rentals in Cozumel. Open-air buggies from $75/day, A/C compact cars from $65/day.",
};

export default async function PricingPage() {
  await getLocale();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0EB]">
        {/* Page header */}
        <div className="bg-[#1B4F72] pt-28 pb-16 text-center">
          <p className="text-[#7FB5B5] font-semibold text-sm uppercase tracking-widest mb-3">
            Transparent &amp; Simple
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Pricing
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-lg">
            No hidden fees, no surprises — just great vehicles at fair prices.
          </p>
        </div>

        {/* Pricing section reused */}
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
