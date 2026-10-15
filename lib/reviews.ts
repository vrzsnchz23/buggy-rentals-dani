export type Review = {
  author_name: string;
  author_photo: string | null;
  rating: number;
  relative_time: string;
  text: string;
  /**
   * The language the review was written in, when it is known.
   *
   * Reviews are kept in their original language rather than machine
   * translated — Google's Spanish rendering of one of these had invented a
   * detail, which is reason enough. The language is recorded so the section
   * can lead with the ones a visitor can actually read, without hiding the
   * rest. Reviews from the Places API have no value here: Google returns them
   * in whatever language was asked for.
   */
  lang?: "en" | "es";
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
    lang: "en",
  },
  {
    author_name: "Crockett's",
    author_photo: null,
    rating: 5,
    relative_time: "15 weeks ago",
    text: "Dude was super friendly and got a nice van to take the family out for the day. Super helpful and if we ever come back definitely will use again.",
    lang: "en",
  },
  {
    author_name: "Brian Byers",
    author_photo: null,
    rating: 5,
    relative_time: "Apr 25, 2025",
    text: "I could not be happier with the service here. I contacted them on Facebook the evening before we arrived on our cruise. They happily accommodated my request for a scooter day rental. The prices are fair, they didn't push me to buy extras, and the scooter was in great condition. They are real pros. 10 out of 10!",
    lang: "en",
  },
  {
    author_name: "Natalie Moore-Hoffer",
    author_photo: null,
    rating: 5,
    relative_time: "a month ago",
    text: "Buggy Rentals with Dani will be our go-to every time we visit Cozumel! From the moment we arrived, Dani was amazing. He met us right outside the port with our cars, explained everything, and gave us great tips and recommendations on where to go and what to see. I even texted him throughout the day asking his opinion on the best places to shop, eat, and visit, and he was always so helpful and responsive. He truly rolled out the red carpet for us and made everything so easy, from pickup to drop-off! Dani was an absolute pleasure to deal with, and I honestly can't say enough great things about our experience. If you're visiting Cozumel and need a buggy rental, I highly recommend Buggy Rentals with Dani!",
    lang: "en",
  },
  {
    /* The only review written in Spanish, which is the one the Spanish side of
       the site badly needed — everything else here is in English. */
    author_name: "Alejandro Rodriguez",
    author_photo: null,
    rating: 5,
    relative_time: "2 months ago",
    text: "Excelente servicio! Entrega y recepcion super puntual a la puerta de mi hotel. El vehículo en perfectas condiciones, pudimos visitar toda la isla sin ninguna eventualidad. Nada de cobros ocultos o extras, todo claro y honesto. Sin duda volveré a rentar con Dani.",
    lang: "es",
  },
  {
    author_name: "Juan La Corte",
    author_photo: null,
    rating: 5,
    relative_time: "2 months ago",
    text: "Amazing experience! We got there and everything was ready. The paperwork was simple and we had prepaid so very smooth. We got the buggy and drove around the island. They gave us great tips and added a quiet place to relax by the beach at an amazing price. When we got back it's so easy as it's in the gas station, just pull up to fill the tank and leave it right there! No hassle, no worries. Highly recommended if you want to explore the island!",
    lang: "en",
  },
  {
    author_name: "Sara Alicia Throop",
    author_photo: null,
    rating: 5,
    relative_time: "3 months ago",
    text: "The buggy was delivered to our hotel. Dani was nice, accommodating, and informative. The process was simple, rental was straightforward. No hidden fees or up-charges. Would recommend.",
    lang: "en",
  },
  {
    /* Verbatim, typos and all — "maragrita" and "queen couch" are the
       reviewer's own and are not ours to tidy up. A first draft of this entry
       quietly dropped two clauses and evened out the punctuation, which is a
       quote someone did not write being published under their name. */
    author_name: "NANI&PAPI97",
    author_photo: null,
    rating: 5,
    relative_time: "3 months ago",
    text: "We loved Buggybydani! Great family run business! Close to port ,easy online pre rental ! Buggy was fun to drive and Banana beach was fun ! Got food beer and free maragrita! Got to snorkel and see plenty of fish and baby queen couch and a big starfish !! Returning Buggy was easy !! 10 Star Service!! Will use again !!!",
    lang: "en",
  },
  {
    author_name: "Heather Ginck",
    author_photo: null,
    rating: 5,
    relative_time: "Dec 3, 2024",
    text: "I stumbled across this business on Facebook by accident and I am so glad I did. The experience from my first message to the time we returned our buggy was EXCELLENT! He went out of his way to send us videos and pictures to make sure we knew where we were going once off the ship. HIGHLY RECOMMEND!",
    lang: "en",
  },
];

const FALLBACK: ReviewsPayload = {
  reviews: FALLBACK_REVIEWS,
  rating: 5,
  /* The real count on Google, not the length of the list above — the homepage
     publishes this as schema.org aggregateRating.reviewCount, and falling back
     to the array length reported four when there were ten. It will drift as
     reviews come in; setting GOOGLE_MAPS_API_KEY and GOOGLE_PLACE_ID makes the
     whole payload live and this line irrelevant. */
  total: 10,
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
