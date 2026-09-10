"use client";

import { useState } from "react";

export default function BookingConfirmationPage() {
  const [cancelled, setCancelled] = useState(false);
  const [shared, setShared] = useState(false);

  if (cancelled) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <div>
              <h1 className="text-2xl font-bold">Booking Cancelled</h1>
              <p className="mt-1 text-sm text-slate-500">
                Your ride booking has been cancelled.
              </p>
            </div>

            <a
              href="/dashboard"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              ← Dashboard
            </a>
          </div>
        </header>

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
              ✓
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Ride Cancelled
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your booking for Jaipur → Ajmer has been cancelled
              successfully.
            </p>

            <a
              href="/rides"
              className="mt-7 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              View My Rides
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Booking Confirmed</h1>
            <p className="mt-1 text-sm text-slate-500">
              Your Commuto ride has been successfully booked.
            </p>
          </div>

          <a
            href="/rides"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            My Rides
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Success Banner */}
        <section className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">
            ✓
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            You're all set! 🎉
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your ride from Jaipur to Ajmer is confirmed.
          </p>

          <div className="mx-auto mt-5 w-fit rounded-full bg-indigo-50 px-4 py-2">
            <span className="text-xs font-semibold text-indigo-700">
              Booking ID: CMD-2026-0912-4821
            </span>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-6 lg:col-span-2">
            {/* Journey */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Your Journey
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    Jaipur → Ajmer
                  </h2>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Confirmed
                </span>
              </div>

              <div className="mt-7">
                <JourneyPoint
                  color="bg-indigo-600"
                  title="Pickup"
                  location="Jaipur Railway Station"
                  time="6:30 PM"
                />

                <div className="ml-1.5 h-14 border-l border-dashed border-slate-300" />

                <JourneyPoint
                  color="bg-emerald-500"
                  title="Destination"
                  location="Ajmer Bus Stand"
                  time="8:40 PM"
                />
              </div>

              <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                <InfoItem label="Date" value="12 Sep 2026" />
                <InfoItem label="Duration" value="2h 10m" />
                <InfoItem label="Distance" value="135 km" />
              </div>
            </section>

            {/* Driver */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Your Driver
                </h2>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ✓ Verified
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
                  RS
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold">
                    Rahul Sharma
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span>★ 4.9 Rating</span>
                    <span>186 Rides</span>
                    <span>3 Years</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 px-5 py-4">
                  <p className="text-xs text-slate-400">
                    Vehicle
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    Hyundai Creta
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    RJ14 AB 1234
                  </p>
                </div>
              </div>
            </section>

            {/* Safety */}
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <div className="flex gap-4">
                <div className="text-2xl">🛡️</div>

                <div>
                  <h2 className="font-semibold text-emerald-900">
                    Your ride is protected
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-emerald-700">
                    Driver verification, trip sharing, emergency assistance
                    and safety reporting are available throughout your ride.
                  </p>

                  <a
                    href="/safety"
                    className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline"
                  >
                    Open Safety Center
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Fare */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">
                Fare Summary
              </h2>

              <div className="mt-5 space-y-4">
                <FareRow
                  label="Fare per seat"
                  value="₹280"
                />

                <FareRow
                  label="Seats"
                  value="× 1"
                />

                <FareRow
                  label="Service fee"
                  value="₹0"
                />

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      Total Paid
                    </span>

                    <span className="text-xl font-bold text-indigo-700">
                      ₹280
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-indigo-50 p-4">
                <p className="text-xs font-semibold text-indigo-900">
                  💡 Smart Fare Split
                </p>

                <p className="mt-1 text-xs leading-5 text-indigo-700">
                  Your fare is calculated from the shared route and
                  passenger contribution.
                </p>
              </div>
            </section>

            {/* Actions */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">
                Ride Actions
              </h2>

              <div className="mt-5 space-y-3">
                <a
                  href="/rides/details"
                  className="block w-full rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  View Ride Details
                </a>

                <a
                  href="/rides/tracking"
                  className="block w-full rounded-xl border border-indigo-200 px-5 py-3 text-center text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  📍 Track Ride
                </a>

                <button
                  onClick={() => setShared(!shared)}
                  className={`w-full rounded-xl border px-5 py-3 text-sm font-semibold ${
                    shared
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {shared
                    ? "✓ Trip Shared"
                    : "📤 Share Trip"}
                </button>

                <button
                  onClick={() => setCancelled(true)}
                  className="w-full rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Cancel Booking
                </button>
              </div>
            </section>

            {/* Reminder */}
            <section className="rounded-2xl bg-slate-900 p-6 text-white">
              <div className="flex gap-3">
                <span className="text-xl">⏰</span>

                <div>
                  <h3 className="font-semibold">
                    Be ready for pickup
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-300">
                    Please arrive at the pickup point a few minutes before
                    departure.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* Bottom */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold">
                Need help with your booking?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Contact Commuto support if you face any issue with this ride.
              </p>
            </div>

            <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">
              Contact Support
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}


/* ---------- Components ---------- */

function JourneyPoint({
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
      <div className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full ${color}`} />

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


function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}


function FareRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}