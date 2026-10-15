import { getLocale } from "next-intl/server";
import { getReviews } from "@/lib/reviews";
import { ReviewsCarousel } from "./ReviewsCarousel";

/**
 * Server component: the review text is in the initial HTML, so there is no
 * loading flash, no layout shift, and search engines can read the testimonials.
 */
export async function Reviews() {
  const locale = await getLocale();
  const { reviews, rating, total } = await getReviews();

  /* Reviews stay in the language they were written in, so the carousel would
     otherwise open an English page on a Spanish testimonial. Sorting the
     matching ones first fixes which review is featured without dropping any —
     sort is stable, so everything else keeps its order. Reviews from the
     Places API carry no language and are left exactly as they came. */
  const ordered = reviews.some((review) => review.lang)
    ? [...reviews].sort((a, b) => Number(b.lang === locale) - Number(a.lang === locale))
    : reviews;

  return <ReviewsCarousel reviews={ordered} rating={rating} total={total} />;
}
