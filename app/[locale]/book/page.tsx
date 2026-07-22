import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getTranslations } from "next-intl/server";

interface Props {
  searchParams: Promise<{ date?: string; type?: string; [key: string]: string | undefined }>;
}

export default async function BookPage({ searchParams }: Props) {
  const t = await getTranslations("booking");
  const { date, type } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0EB] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-[#1B4F72] mb-2">{t("title")}</h1>
            <p className="text-gray-500">{t("subtitle")}</p>
          </div>
          <Suspense>
            <BookingWizard initialDate={date} initialType={type} />
          </Suspense>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
