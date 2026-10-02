"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

interface EligibleRating {
  requestId: number;
  rideId: number;
  targetName: string;
  startLocation: string;
  destination: string;
  rideDate: string;
}

interface ReceivedRating {
  id: number;
  raterName: string;
  score: number;
  comment: string;
  createdAt: string;
}

export default function RatingsPage() {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [eligibleRatings, setEligibleRatings] = useState<EligibleRating[]>([]);
  const [receivedRatings, setReceivedRatings] = useState<ReceivedRating[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;
    const loadRatings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        await Promise.resolve();
        if (isCurrent) {
          setErrorMessage("Please log in to view and submit ratings.");
          setLoading(false);
        }
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [eligibleResponse, receivedResponse] = await Promise.all([
          fetch(apiUrl("/api/ratings/eligible"), { headers }),
          fetch(apiUrl("/api/ratings/received"), { headers }),
        ]);
        if (!eligibleResponse.ok || !receivedResponse.ok) {
          throw new Error("Unable to load ratings.");
        }

        const eligible = (await eligibleResponse.json()) as EligibleRating[];
        const received = (await receivedResponse.json()) as ReceivedRating[];
        if (isCurrent) {
          setEligibleRatings(eligible);
          setReceivedRatings(received);
          setSelectedRequestId(eligible[0] ? String(eligible[0].requestId) : "");
        }
      } catch (error) {
        if (isCurrent) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load ratings.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    queueMicrotask(() => void loadRatings());
    return () => {
      isCurrent = false;
    };
  }, []);

  const handleSubmit = async () => {
    if (!selectedRequestId || selectedRating === 0 || !review.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Please log in before submitting a rating.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSubmitted(false);
    try {
      const response = await fetch(apiUrl("/api/ratings"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          requestId: Number(selectedRequestId),
          score: selectedRating,
          comment: review.trim(),
        }),
      });
      const responseData = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        throw new Error(responseData?.message || "Unable to submit this rating.");
      }

      const updatedEligible = eligibleRatings.filter(
        (item) => item.requestId !== Number(selectedRequestId)
      );
      setEligibleRatings(updatedEligible);
      setSelectedRequestId(updatedEligible[0] ? String(updatedEligible[0].requestId) : "");
      setReview("");
      setSelectedRating(0);
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to submit this rating.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRide = eligibleRatings.find(
    (item) => item.requestId === Number(selectedRequestId)
  );

  const averageRating = receivedRatings.length
    ? (receivedRatings.reduce((sum, item) => sum + item.score, 0) / receivedRatings.length).toFixed(1)
    : "--";

  const distribution = [5, 4, 3, 2, 1].map((score) => ({
    score,
    percentage: receivedRatings.length
      ? Math.round((receivedRatings.filter((item) => item.score === score).length / receivedRatings.length) * 100)
      : 0,
  }));

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

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {errorMessage && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-200">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Rating Overview */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Overall Rating */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">Commuto Rating</p>

            <div className="mt-4 flex items-end gap-3">
              <span className="text-5xl font-bold">{averageRating}</span>
              <span className="mb-2 text-sm text-slate-500">/ 5.0</span>
            </div>

            <div className="mt-3 flex gap-1 text-2xl text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s}>
                  {averageRating !== "--" && Number(averageRating) >= s ? "★" : "☆"}
                </span>
              ))}
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Based on {receivedRatings.length} verified ride {receivedRatings.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Distribution */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <h2 className="text-lg font-semibold">Rating Distribution</h2>

            <div className="mt-5 space-y-3">
              {distribution.map(({ score, percentage }) => (
                <div key={score} className="flex items-center gap-3">
                  <span className="w-10 text-sm font-medium">{score} ★</span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-300"
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
                Your feedback helps other travelers make safe and reliable decisions.
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              ✓ Verified Ride
            </span>
          </div>

          {loading ? (
            <div className="mt-6 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
              Loading eligible rides...
            </div>
          ) : eligibleRatings.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-2xl">🎉</p>
              <p className="mt-2 font-semibold text-slate-800">
                All eligible rides have been rated
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Complete a trip to leave ratings and reviews for your co-travelers.
              </p>
            </div>
          ) : (
            <>
              {eligibleRatings.length > 1 && (
                <div className="mt-5">
                  <label className="text-xs font-bold uppercase text-slate-500">
                    Select Completed Ride to Rate:
                  </label>
                  <select
                    value={selectedRequestId}
                    onChange={(e) => setSelectedRequestId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-indigo-600 focus:outline-none"
                  >
                    {eligibleRatings.map((item) => (
                      <option key={item.requestId} value={item.requestId}>
                        {item.targetName} ({item.startLocation} → {item.destination}) · {item.rideDate}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ride Details Card */}
              {selectedRide && (
                <div className="mt-6 rounded-xl bg-slate-50 p-5">
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Ride Co-Traveler
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                          {selectedRide.targetName.slice(0, 2).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold">{selectedRide.targetName}</p>
                          <p className="text-sm text-slate-500">
                            {selectedRide.startLocation} → {selectedRide.destination}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-sm font-medium">{selectedRide.rideDate}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Ride #{selectedRide.rideId} · Request #{selectedRide.requestId}
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                    ? "Select a star rating"
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
                  placeholder="What did you like about the ride? Was the traveler punctual, polite, and respectful?"
                  rows={4}
                  className="mt-3 w-full rounded-xl border border-slate-200 p-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <p className="text-xs text-slate-400">
                    Be respectful and avoid sharing sensitive personal details.
                  </p>

                  <button
                    onClick={handleSubmit}
                    disabled={selectedRating === 0 || !review.trim() || submitting}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>

                {submitted && (
                  <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                    ✓ Thank you! Your review has been submitted successfully.
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {/* Recent Reviews */}
        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Reviews</h2>
              <p className="mt-1 text-sm text-slate-500">
                What travelers are saying about their Commuto rides.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {receivedRatings.length} Reviews
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {receivedRatings.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                No reviews received yet. Reviews you receive from co-travelers will appear here.
              </div>
            ) : (
              receivedRatings.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                      {item.raterName ? item.raterName.slice(0, 2).toUpperCase() : "U"}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row">
                        <div>
                          <p className="font-semibold">{item.raterName}</p>

                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex text-sm text-amber-400">
                              {Array.from({ length: item.score }).map((_, index) => (
                                <span key={index}>★</span>
                              ))}
                            </div>

                            <span className="text-xs text-slate-400">
                              {new Date(item.createdAt).toLocaleDateString()}
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
              ))
            )}
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
              <p className="mt-1 text-sm text-indigo-700">
                Ratings are only permitted after a ride is marked as completed. They reflect actual shared journeys and contribute to each user&apos;s safety rating.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}