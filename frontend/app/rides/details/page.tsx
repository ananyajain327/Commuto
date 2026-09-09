"use client";

import { useState } from "react";

export default function RideDetailsPage() {
  const [requested, setRequested] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-2xl font-bold tracking-tight">
              Commuto<span className="text-blue-600">.</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Ride details
            </p>
          </div>

          <a
            href="/rides"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ← My Rides
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            RIDE CM-0001
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Jaipur → Ajmer
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Thursday, 18 September 2026 · 08:30 AM
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-6">
            {/* Route */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-bold">Journey</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Complete route information
                </p>
              </div>

              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="h-4 w-4 rounded-full border-4 border-blue-600 bg-white" />
                  <span className="h-20 border-l-2 border-dashed border-slate-300" />
                  <span className="h-4 w-4 rounded-full bg-blue-600" />
                </div>

                <div className="flex-1 space-y-10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Pickup
                    </p>
                    <h3 className="mt-1 text-lg font-bold">
                      Jaipur Railway Station
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Platform Road, Jaipur
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Destination
                    </p>
                    <h3 className="mt-1 text-lg font-bold">
                      Ajmer Bus Stand
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Ajmer, Rajasthan
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                <DetailBox
                  label="Distance"
                  value="135 km"
                  icon="🛣️"
                />

                <DetailBox
                  label="Duration"
                  value="2h 45m"
                  icon="⏱️"
                />

                <DetailBox
                  label="Route Match"
                  value="96%"
                  icon="🎯"
                />
              </div>
            </section>

            {/* Driver */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Driver</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your ride partner
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                  ✓ VERIFIED
                </span>
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white">
                  RS
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    Rahul Sharma
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-3 text-sm">
                    <span className="font-semibold">
                      ⭐ 4.9
                    </span>

                    <span className="text-slate-400">
                      128 rides
                    </span>

                    <span className="text-slate-400">
                      Member since 2025
                    </span>
                  </div>
                </div>

                <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold hover:bg-slate-50">
                  View Profile
                </button>
              </div>

              <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
                <InfoRow
                  icon="🚗"
                  label="Vehicle"
                  value="Hyundai Creta"
                />

                <InfoRow
                  icon="🔢"
                  label="Registration"
                  value="RJ14 AB 1234"
                />
              </div>
            </section>

            {/* Safety */}
            <section className="rounded-3xl border border-blue-100 bg-blue-50 p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl">
                  🛡️
                </div>

                <div>
                  <h2 className="font-bold">Commuto Safety</h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Your safety matters. Driver verification, ratings,
                    emergency contacts and SOS support are available
                    throughout your journey.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <SafetyItem text="Verified driver" />
                <SafetyItem text="SOS available" />
                <SafetyItem text="Trip tracking" />
              </div>
            </section>
          </div>

          {/* Right */}
          <aside className="space-y-5">
            {/* Fare */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold">
                Fare summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Estimated ride fare
                  </span>
                  <span className="font-semibold">
                    ₹320
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Commuto service fee
                  </span>
                  <span className="font-semibold">
                    ₹20
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between">
                    <span className="font-bold">
                      Estimated total
                    </span>
                    <span className="text-xl font-bold">
                      ₹340
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Final fare may vary depending on the actual route
                and ride details.
              </p>
            </section>

            {/* Ride Info */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-xl font-bold">
                Ride information
              </h2>

              <div className="mt-5 space-y-4">
                <InfoRow
                  icon="📅"
                  label="Date"
                  value="18 Sep 2026"
                />

                <InfoRow
                  icon="🕐"
                  label="Departure"
                  value="08:30 AM"
                />

                <InfoRow
                  icon="💺"
                  label="Available seats"
                  value="2 seats"
                />

                <InfoRow
                  icon="👩"
                  label="Preference"
                  value="Women-only: No"
                />
              </div>
            </section>

            {/* Request */}
            <section className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl">
              <p className="text-sm text-slate-400">
                READY TO TRAVEL?
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Reserve your seat
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Send a ride request to the driver. You'll be
                notified once they accept.
              </p>

              <button
                onClick={() => setRequested(true)}
                disabled={requested}
                className={`mt-6 w-full rounded-xl px-5 py-4 text-sm font-bold transition ${
                  requested
                    ? "cursor-default bg-green-500 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-500"
                }`}
              >
                {requested
                  ? "✓ Request Sent"
                  : "Request Ride"}
              </button>

              {requested && (
                <p className="mt-4 text-center text-xs text-green-300">
                  Your request is waiting for driver approval.
                </p>
              )}
            </section>

            {/* Emergency */}
            <button className="w-full rounded-2xl border border-red-200 bg-white px-5 py-4 text-sm font-bold text-red-600 transition hover:bg-red-50">
              🚨 Emergency / SOS
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function DetailBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-lg">{icon}</div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function SafetyItem({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 text-xs font-semibold text-slate-600">
      ✓ {text}
    </div>
  );
}
