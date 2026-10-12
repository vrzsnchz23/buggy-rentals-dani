import { getReviews } from "@/lib/reviews";
import { ReviewsCarousel } from "./ReviewsCarousel";

/**
 * Server component: the review text is in the initial HTML, so there is no
 * loading flash, no layout shift, and search engines can read the testimonials.
 */
export async function Reviews() {
  const { reviews, rating, total } = await getReviews();

  return <ReviewsCarousel reviews={reviews} rating={rating} total={total} />;
}
