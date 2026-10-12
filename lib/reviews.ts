export type Review = {
  author_name: string;
  author_photo: string | null;
  rating: number;
  relative_time: string;
  text: string;
};

export type ReviewsPayload = {
  reviews: Review[];
  rating: number;
  total: number | null;
  source: "google" | "fallback";
};

const FALLBACK_REVIEWS: Review[] = [
  {
    author_name: "Elena Tenchikova",
    author_photo: null,
    rating: 5,
    relative_time: "3 weeks ago",
    text: "I'd like to share that we've had a great experience with this buggy rental. I was doing a cruise and it is conveniently located in walking distance from the port. Daniel was super friendly and helpful on setting us up with a buggy rental. No hassle, terms as described and no hidden fees. Made our experience enjoying Cozumel that much more enjoyable. Thanks Daniel!",
  },
  {
    author_name: "Crockett's",
    author_photo: null,
    rating: 5,
    relative_time: "15 weeks ago",
    text: "Dude was super friendly and got a nice van to take the family out for the day. Super helpful and if we ever come back definitely will use again.",
  },
  {
    author_name: "Brian Byers",
    author_photo: null,
    rating: 5,
    relative_time: "Apr 25, 2025",
    text: "I could not be happier with the service here. I contacted them on Facebook the evening before we arrived on our cruise. They happily accommodated my request for a scooter day rental. The prices are fair, they didn't push me to buy extras, and the scooter was in great condition. They are real pros. 10 out of 10!",
  },
  {
    author_name: "Heather Ginck",
    author_photo: null,
    rating: 5,
    relative_time: "Dec 3, 2024",
    text: "I stumbled across this business on Facebook by accident and I am so glad I did. The experience from my first message to the time we returned our buggy was EXCELLENT! He went out of his way to send us videos and pictures to make sure we knew where we were going once off the ship. HIGHLY RECOMMEND!",
  },
];

const FALLBACK: ReviewsPayload = {
  reviews: FALLBACK_REVIEWS,
  rating: 5,
  total: null,
  source: "fallback",
};

type GoogleReview = {
  author_name: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
};

/**
 * Google reviews, cached for a day.
 *
 * Lives here rather than inside the route handler so the Reviews section can
 * render them on the server — they used to be fetched from the browser after
 * hydration, which meant a "Loading reviews…" flash, a layout shift, and none
 * of the review text in the HTML for search engines.
 */
export async function getReviews(): Promise<ReviewsPayload> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) return FALLBACK;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&reviews_sort=newest&key=${apiKey}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) throw new Error(`Places API responded ${res.status}`);

    const data = await res.json();
    if (data.status !== "OK" || !data.result?.reviews?.length) return FALLBACK;

    const reviews: Review[] = (data.result.reviews as GoogleReview[])
      .filter((r) => r.rating >= 4)
      .map((r) => ({
        author_name: r.author_name,
        author_photo: r.profile_photo_url ?? null,
        rating: r.rating,
        relative_time: r.relative_time_description,
        text: r.text,
      }));

    if (!reviews.length) return FALLBACK;

    return {
      reviews,
      rating: data.result.rating ?? 5,
      total: data.result.user_ratings_total ?? null,
      source: "google",
    };
  } catch (err) {
    console.error("Google Places API error:", err);
    return FALLBACK;
  }
}
