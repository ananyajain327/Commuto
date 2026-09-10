"use client";

import { useState } from "react";

export default function RideRequestPage() {
  const [requested, setRequested] = useState(false);
  const [seats, setSeats] = useState(1);
  const [note, setNote] = useState("");

  const farePerSeat = 280;
  const totalFare = farePerSeat * seats;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Request Ride</h1>
            <p className="mt-1 text-sm text-slate-500">
              Review the ride details before sending your request.
            </p>
          </div>

          <a
            href="/rides/search"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            ← Find Rides
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {requested ? (
          /* Request Sent */
          <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
              ✓
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Ride Request Sent!
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              Your request has been sent to Rahul Sharma. You will receive a
              notification when the driver accepts or rejects your request.
            </p>

            <div className="mt-7 rounded-2xl bg-slate-50 p-5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Route</span>
                <span className="text-sm font-semibold">
                  Jaipur → Ajmer
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">Departure</span>
                <span className="text-sm font-semibold">
                  Today • 6:30 PM
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">Your Fare</span>
                <span className="text-sm font-bold text-indigo-700">
                  ₹{totalFare}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="/rides"
                className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                View My Rides
              </a>

              <a
                href="/dashboard"
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Dashboard
              </a>
            </div>

            <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-left">
              <p className="text-sm font-semibold text-indigo-900">
                🔔 What happens next?
              </p>
              <p className="mt-1 text-xs leading-5 text-indigo-700">
                The driver will review your request. Once accepted, your
                booking will be confirmed automatically.
              </p>
            </div>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Details */}
            <section className="lg:col-span-2 space-y-6">
              {/* Route */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Ride Route
                    </p>
                    <h2 className="mt-2 text-xl font-bold">
                      Jaipur → Ajmer
                    </h2>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    94% Route Match
                  </span>
                </div>

                <div className="mt-7">
                  <RoutePoint
                    color="bg-indigo-600"
                    title="Pickup"
                    location="Jaipur Railway Station"
                    time="6:30 PM"
                  />

                  <div className="ml-1.5 h-12 border-l border-dashed border-slate-300" />

                  <RoutePoint
                    color="bg-emerald-500"
                    title="Destination"
                    location="Ajmer Bus Stand"
                    time="8:40 PM"
                  />
                </div>
              </div>

              {/* Driver */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Your Driver
                </p>

                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
                    RS
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold">Rahul Sharma</h3>

                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        ✓ Verified
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>★ 4.9 Rating</span>
                      <span>186 Rides</span>
                      <span>3 Years on Commuto</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
                    <p className="text-xs text-slate-400">Vehicle</p>
                    <p className="mt-1 text-sm font-semibold">
                      Hyundai Creta
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      RJ14 AB 1234
                    </p>
                  </div>
                </div>
              </div>

              {/* Passenger Details */}
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold">
                  Passenger Details
                </h2>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">
                      Number of Seats
                    </label>

                    <select
                      value={seats}
                      onChange={(e) => setSeats(Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value={1}>1 Seat</option>
                      <option value={2}>2 Seats</option>
                      <option value={3}>3 Seats</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Pickup Preference
                    </label>

                    <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                      <option>Jaipur Railway Station</option>
                      <option>Nearby Pickup Point</option>
                      <option>Flexible Pickup</option>
                    </select>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-sm font-medium">
                    Note to Driver
                  </label>

                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    placeholder="Example: I'll have one small bag with me."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Avoid sharing sensitive personal information.
                  </p>
                </div>
              </div>

              {/* Safety */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                <div className="flex gap-4">
                  <div className="text-2xl">🛡️</div>

                  <div>
                    <h3 className="font-semibold text-emerald-900">
                      Commuto Safety Protection
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-emerald-700">
                      Your ride is covered by driver verification, trip
                      sharing, emergency assistance and our safety reporting
                      system.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Fare Summary */}
            <aside>
              <div className="sticky top-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold">
                  Fare Summary
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Fare per seat
                    </span>
                    <span className="font-medium">₹280</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Seats
                    </span>
                    <span className="font-medium">× {seats}</span>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        Total Fare
                      </span>

                      <span className="text-xl font-bold text-indigo-700">
                        ₹{totalFare}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-indigo-50 p-4">
                  <p className="text-xs font-semibold text-indigo-900">
                    💡 Smart Fare Split
                  </p>

                  <p className="mt-1 text-xs leading-5 text-indigo-700">
                    Your fare is calculated based on the shared route and
                    number of passengers.
                  </p>
                </div>

                <button
                  onClick={() => setRequested(true)}
                  className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Request This Ride
                </button>

                <p className="mt-3 text-center text-xs text-slate-400">
                  You won't be charged until the ride is confirmed.
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}


/* ---------- Route Point ---------- */

function RoutePoint({
  color,
  title,
  location,
  time,
}: {
  color: string;
  title: string;
  location: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full ${color}`}
      />

      <div className="flex flex-1 justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400">{title}</p>
          <p className="mt-1 text-sm font-semibold">{location}</p>
        </div>

        <span className="text-sm font-semibold">{time}</span>
      </div>
    </div>
  );
}