import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getTranslations } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ date?: string; type?: string; [key: string]: string | undefined }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const m = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata({ locale, path: "/book", title: m("bookTitle"), description: m("bookDescription") });
}

export default async function BookPage({ searchParams }: Props) {
  const t = await getTranslations("booking");
  const { date, type } = await searchParams;

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen bg-[#F5F0EB] pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-[#1B4F72] mb-2">{t("title")}</h1>
            <p className="text-[#5A616B]">{t("subtitle")}</p>
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
