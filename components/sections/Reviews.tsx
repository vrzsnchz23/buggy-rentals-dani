"use client";
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const reviews = [
  {
    name: "Elena Tenchikova",
    avatar: "ET",
    color: "#1B4F72",
    date: "3 weeks ago",
    stars: 5,
    text: "I'd like to share that we've had a great experience with this buggy rental. I was doing a cruise and it is conveniently located in walking distance from the port. Daniel was super friendly and helpful on setting us up with a buggy rental. No hassle, terms as described and no hidden fees. Made our experience enjoying Cozumel that much more enjoyable. Thanks Daniel!",
    tag: "Cruise Guest",
  },
  {
    name: "Crockett's",
    avatar: "CK",
    color: "#E8836A",
    date: "15 weeks ago",
    stars: 5,
    text: "Dude was super friendly and got a nice van to take the family out for the day. Super helpful and if we ever come back definitely will use again.",
    tag: "Local Guide",
  },
  {
    name: "Brian Byers",
    avatar: "BB",
    color: "#7FB5B5",
    date: "Apr 25, 2025",
    stars: 5,
    text: "I could not be happier with the service here. I contacted them on Facebook the evening before we arrived on our cruise. They happily accommodated my request for a scooter day rental. The prices are fair, they didn't push me to buy extras, and the scooter was in great condition. They are real pros. 10 out of 10! Definitely recommend them over other rental places in Cozumel.",
    tag: "Local Guide",
  },
  {
    name: "Heather Ginck",
    avatar: "HG",
    color: "#1B4F72",
    date: "Dec 3, 2024",
    stars: 5,
    text: "I stumbled across this business on Facebook by accident and I am so glad I did. The experience from my first message to the time we returned our buggy was EXCELLENT! He went out of his way to send us videos and pictures to make sure we knew where we were going once off the ship. I cannot recommend this place enough. We rented one of the buggys and drove around the entire island. Amazing time. Thank you for making our day in Cozumel that much better!!!!! HIGHLY RECOMMEND!",
    tag: "Local Guide",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}

export function Reviews() {
  const [current, setCurrent] = useState(0);

  function prev() { setCurrent(i => (i > 0 ? i - 1 : reviews.length - 1)); }
  function next() { setCurrent(i => (i < reviews.length - 1 ? i + 1 : 0)); }

  const review = reviews[current];

  return (
    <section className="py-24 bg-white relative overflow-hidden">

      {/* Decorative */}
      <div className="absolute top-10 left-0 w-72 h-72 rounded-full bg-[#7FB5B5]/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#E8836A]/8 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-yellow-50 text-yellow-600 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            ⭐ Google Reviews
          </span>
          <h2 className="section-title">What Our Guests Say</h2>
          <p className="section-subtitle">Real reviews from real adventurers</p>

          {/* Overall rating */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-3xl font-black text-[#1B4F72]">5.0</span>
            <span className="text-gray-400 text-sm">on Google · {reviews.length} reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Featured review — large */}
          <div className="lg:col-span-2 bg-[#1B4F72] rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-10 w-56 h-56 rounded-full bg-white/3" />

            <div className="relative">
              <Quote className="w-10 h-10 text-[#E8836A] mb-6 opacity-80" />
              <p className="text-white text-lg leading-relaxed font-medium">
                "{review.text}"
              </p>
            </div>

            <div className="relative flex items-center justify-between mt-8 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-sm"
                  style={{ background: review.color === "#1B4F72" ? "#E8836A" : review.color }}
                >
                  {review.avatar}
                </div>
                <div>
                  <div className="font-bold text-white">{review.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Stars count={review.stars} />
                    <span className="text-gray-400 text-xs">{review.date}</span>
                  </div>
                </div>
              </div>

              {/* Google logo */}
              <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-white/70 text-xs font-medium">Google Review</span>
              </div>
            </div>
          </div>

          {/* Right — thumbnail list */}
          <div className="flex flex-col gap-3">
            {reviews.map((r, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`text-left rounded-2xl p-4 flex items-start gap-3 transition-all border-2 ${
                  i === current
                    ? "border-[#1B4F72] bg-[#1B4F72]/5 shadow-md"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-xs shrink-0"
                  style={{ background: r.color }}
                >
                  {r.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm ${i === current ? "text-[#1B4F72]" : "text-gray-700"}`}>
                    {r.name}
                  </div>
                  <div className="flex gap-0.5 my-0.5">
                    {[...Array(r.stars)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{r.text}</p>
                </div>
              </button>
            ))}

            {/* See all on Google */}
            <a
              href="https://maps.app.goo.gl/QYZiN1rf1vXbhR8g8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-sm font-semibold text-[#1B4F72] hover:text-[#E8836A] transition-colors py-1"
            >
              See all reviews on Google →
            </a>

            {/* Leave a review CTA */}
            <a
              href="https://g.page/r/CfS3VjCYpjOMEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#1B4F72] hover:bg-[#154060] text-white font-bold text-sm py-3 px-4 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              ⭐ Leave us a Google Review
            </a>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={prev} className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-[#1B4F72] flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? "w-6 h-2.5 bg-[#1B4F72]" : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"}`}
            />
          ))}
          <button onClick={next} className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-[#1B4F72] flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
