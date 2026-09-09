"use client";

import { useState } from "react";

export default function FindRidePage() {
  const [womenOnly, setWomenOnly] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              Commuto<span className="text-blue-600">.</span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Find a ride that fits your journey
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <section className="mb-8">
          <div className="rounded-3xl bg-slate-900 px-8 py-9 text-white shadow-xl">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
                Smart Ride Matching
              </p>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Find your perfect ride.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
                Tell us where you are going and Commuto will help you discover
                rides that match your route, timing and preferences.
              </p>
            </div>
          </div>
        </section>

        {/* Search Box */}
        <section className="-mt-2 mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Search for a ride</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your journey details below.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* From */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                From
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500 focus-within:bg-white">
                <span className="mr-3 text-lg">📍</span>
                <input
                  type="text"
                  placeholder="Pickup location"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* To */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                To
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500 focus-within:bg-white">
                <span className="mr-3 text-lg">🎯</span>
                <input
                  type="text"
                  placeholder="Destination"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Date
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500 focus-within:bg-white">
                <span className="mr-3 text-lg">📅</span>
                <input
                  type="date"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Preferred Time
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500 focus-within:bg-white">
                <span className="mr-3 text-lg">🕐</span>
                <input
                  type="time"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-5 border-t border-slate-100 pt-6 md:flex-row md:items-end md:justify-between">
            {/* Passengers */}
            <div className="w-full md:max-w-xs">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Passengers
              </label>

              <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500">
                <option>1 Passenger</option>
                <option>2 Passengers</option>
                <option>3 Passengers</option>
                <option>4 Passengers</option>
              </select>
            </div>

            {/* Women only */}
            <button
              type="button"
              onClick={() => setWomenOnly(!womenOnly)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                womenOnly
                  ? "border-pink-300 bg-pink-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  womenOnly ? "bg-pink-100" : "bg-slate-100"
                }`}
              >
                👩
              </div>

              <div>
                <p className="text-sm font-bold">Women-only rides</p>
                <p className="text-xs text-slate-500">
                  {womenOnly ? "Preference enabled" : "Show women-only rides"}
                </p>
              </div>

              <div
                className={`ml-3 h-6 w-11 rounded-full p-1 transition ${
                  womenOnly ? "bg-pink-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white transition ${
                    womenOnly ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </button>

            {/* Search */}
            <button className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
              🔎 Find Rides
            </button>
          </div>
        </section>

        {/* Results heading */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              MATCHED RIDES
            </p>
            <h2 className="mt-1 text-2xl font-bold">Available rides</h2>
          </div>

          <p className="text-sm text-slate-500">4 rides found</p>
        </div>

        {/* Ride Cards */}
        <div className="space-y-5">
          {/* Ride 1 */}
          <RideCard
            name="Rahul Sharma"
            rating="4.9"
            initials="RS"
            time="08:30 AM"
            route="Jaipur → Ajmer"
            seats="2 seats left"
            fare="₹320"
            match="96%"
            detour="3 min detour"
            womenOnly={false}
          />

          {/* Ride 2 */}
          <RideCard
            name="Priya Mehta"
            rating="4.8"
            initials="PM"
            time="09:15 AM"
            route="Jaipur → Ajmer"
            seats="1 seat left"
            fare="₹350"
            match="92%"
            detour="5 min detour"
            womenOnly={true}
          />

          {/* Ride 3 */}
          <RideCard
            name="Arjun Verma"
            rating="4.7"
            initials="AV"
            time="10:00 AM"
            route="Jaipur → Kishangarh → Ajmer"
            seats="3 seats left"
            fare="₹290"
            match="87%"
            detour="8 min detour"
            womenOnly={false}
          />

          {/* Ride 4 */}
          <RideCard
            name="Sneha Kapoor"
            rating="4.9"
            initials="SK"
            time="11:30 AM"
            route="Jaipur → Ajmer"
            seats="2 seats left"
            fare="₹340"
            match="84%"
            detour="10 min detour"
            womenOnly={true}
          />
        </div>
      </div>
    </main>
  );
}

function RideCard({
  name,
  rating,
  initials,
  time,
  route,
  seats,
  fare,
  match,
  detour,
  womenOnly,
}: {
  name: string;
  rating: string;
  initials: string;
  time: string;
  route: string;
  seats: string;
  fare: string;
  match: string;
  detour: string;
  womenOnly: boolean;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Driver */}
        <div className="flex min-w-[220px] items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
            {initials}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{name}</h3>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                ✓ VERIFIED
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold">{rating}</span>
              <span className="text-slate-400">Driver rating</span>
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="h-3 w-3 rounded-full border-2 border-blue-600" />
              <span className="h-7 border-l border-dashed border-slate-300" />
              <span className="h-3 w-3 rounded-full bg-blue-600" />
            </div>

            <div>
              <p className="text-sm font-bold">{route}</p>
              <p className="mt-1 text-xs text-slate-500">{detour}</p>
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="min-w-[110px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Departure
          </p>
          <p className="mt-1 text-lg font-bold">{time}</p>
        </div>

        {/* Match */}
        <div className="min-w-[100px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Route Match
          </p>
          <p className="mt-1 text-lg font-bold text-green-600">{match}</p>
        </div>

        {/* Fare */}
        <div className="min-w-[90px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Est. Fare
          </p>
          <p className="mt-1 text-xl font-bold">{fare}</p>
          <p className="text-xs text-slate-400">{seats}</p>
        </div>

        {/* Action */}
        <div className="flex flex-col gap-2">
          {womenOnly && (
            <span className="rounded-lg bg-pink-50 px-3 py-1.5 text-center text-xs font-bold text-pink-600">
              👩 Women Only
            </span>
          )}

          <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600">
            Request Ride
          </button>
        </div>
      </div>
    </div>
  );
}