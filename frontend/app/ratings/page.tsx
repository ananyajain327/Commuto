"use client";

import { useState } from "react";

const reviews = [
  {
    name: "Rahul Sharma",
    rating: 5,
    date: "2 days ago",
    comment:
      "Excellent ride experience. The driver was punctual, polite and the journey was very comfortable.",
    initials: "RS",
  },
  {
    name: "Priya Mehta",
    rating: 4,
    date: "1 week ago",
    comment:
      "Smooth journey and good communication. Pickup was exactly on time.",
    initials: "PM",
  },
  {
    name: "Arjun Verma",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Very safe and comfortable ride. Would definitely book again.",
    initials: "AV",
  },
];

export default function RatingsPage() {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedRating === 0 || review.trim() === "") return;

    setSubmitted(true);
    setReview("");
    setSelectedRating(0);

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Ratings & Reviews</h1>
            <p className="mt-1 text-sm text-slate-500">
              Share your experience and help make Commuto better.
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Rating Overview */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Overall Rating */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">
              Commuto Rating
            </p>

            <div className="mt-4 flex items-end gap-3">
              <span className="text-5xl font-bold">4.8</span>
              <span className="mb-2 text-sm text-slate-500">/ 5.0</span>
            </div>

            <div className="mt-3 flex gap-1 text-2xl">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Based on 1,284 verified ride reviews
            </p>
          </div>

          {/* Distribution */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <h2 className="text-lg font-semibold">Rating Distribution</h2>

            <div className="mt-5 space-y-3">
              {[
                ["5", 82],
                ["4", 12],
                ["3", 4],
                ["2", 1],
                ["1", 1],
              ].map(([rating, percentage]) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="w-10 text-sm font-medium">
                    {rating} ★
                  </span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-10 text-right text-sm text-slate-500">
                    {percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Write Review */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-semibold">Write a Review</h2>
              <p className="mt-1 text-sm text-slate-500">
                Your feedback helps other passengers make better decisions.
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              ✓ Verified Ride
            </span>
          </div>

          {/* Ride Details */}
          <div className="mt-6 rounded-xl bg-slate-50 p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Recent Ride
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                    RS
                  </div>

                  <div>
                    <p className="font-semibold">Rahul Sharma</p>
                    <p className="text-sm text-slate-500">
                      Jaipur → Ajmer
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm font-medium">12 September 2026</p>
                <p className="mt-1 text-sm text-slate-500">
                  ₹280 • 2h 10m
                </p>
              </div>
            </div>
          </div>

          {/* Stars */}
          <div className="mt-7">
            <p className="text-sm font-semibold">How was your experience?</p>

            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`text-4xl transition-transform hover:scale-110 ${
                    star <= (hoverRating || selectedRating)
                      ? "text-amber-400"
                      : "text-slate-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {selectedRating === 0
                ? "Select a rating"
                : `${selectedRating} out of 5 stars selected`}
            </p>
          </div>

          {/* Review Box */}
          <div className="mt-6">
            <label className="text-sm font-semibold">
              Tell us about your ride
            </label>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you like about the ride? Was the driver punctual and helpful?"
              rows={5}
              className="mt-3 w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

            <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-400">
                Be respectful and avoid sharing personal information.
              </p>

              <button
                onClick={handleSubmit}
                disabled={selectedRating === 0 || review.trim() === ""}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Submit Review
              </button>
            </div>

            {submitted && (
              <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                ✓ Thank you! Your review has been submitted successfully.
              </div>
            )}
          </div>
        </section>

        {/* Previous Reviews */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Reviews</h2>
              <p className="mt-1 text-sm text-slate-500">
                What passengers are saying about their Commuto experience.
              </p>
            </div>

            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:block">
              1,284 Reviews
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {reviews.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                    {item.initials}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row">
                      <div>
                        <p className="font-semibold">{item.name}</p>

                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex text-sm text-amber-400">
                            {Array.from({ length: item.rating }).map(
                              (_, index) => (
                                <span key={index}>★</span>
                              )
                            )}
                          </div>

                          <span className="text-xs text-slate-400">
                            {item.date}
                          </span>
                        </div>
                      </div>

                      <span className="h-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        ✓ Verified Ride
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {item.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Safety Note */}
        <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
          <div className="flex gap-3">
            <span className="text-xl">🛡️</span>

            <div>
              <p className="font-semibold text-indigo-900">
                Honest reviews build a safer Commuto
              </p>

              <p className="mt-1 text-sm leading-6 text-indigo-700">
                Only verified ride participants can submit reviews. Reviews
                help maintain trust, safety and transparency across the
                Commuto community.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}