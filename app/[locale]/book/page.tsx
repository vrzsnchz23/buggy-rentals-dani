import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { useTranslations } from "next-intl";

export default function BookPage() {
  const t = useTranslations("booking");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0EB] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-[#1B4F72] mb-2">{t("title")}</h1>
            <p className="text-gray-500">{t("subtitle")}</p>
          </div>
          <BookingWizard />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
