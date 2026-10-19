import type { Metadata } from "next";
import { BUSINESS } from "@/lib/business";
import { ReviewRedirect } from "@/components/ReviewRedirect";

/**
 * /review — the short URL that goes on the counter QR, the business cards and
 * the post-rental WhatsApp message.
 *
 * Locale-free on purpose: it has to be short enough to print and to say out
 * loud. It is not a landing page, so it stays out of the index.
 *
 * Every guest gets this link, not just the happy ones. Filtering who gets
 * asked ("review gating") is against Google's policies and risks the profile.
 */
export const metadata: Metadata = {
  title: "Leave a review",
  robots: { index: false, follow: false },
};

export default function ReviewPage() {
  return <ReviewRedirect href={BUSINESS.googleReviewUrl} platform="google" />;
}
