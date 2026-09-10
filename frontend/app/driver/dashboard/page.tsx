"use client";

import { useState } from "react";

export default function DriverDashboard() {
  const [online, setOnline] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold">Driver Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your rides, earnings and driver activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Ananya Jain</p>
              <p className="text-xs text-slate-500">Verified Driver</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              AJ
            </div>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Online Status */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  online ? "bg-emerald-100" : "bg-slate-100"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full ${
                    online ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
              </div>

              <div>
                <p className="text-lg font-semibold">
                  {online ? "You are Online" : "You are Offline"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {online
                    ? "You can now receive ride requests."
                    : "Go online when you're ready to accept rides."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setOnline(!online)}
              className={`rounded-xl px-6 py-3 text-sm font-semibold text-white transition ${
                online
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {online ? "Go Offline" : "Go Online"}
            </button>

          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Today's Earnings"
            value="₹1,240"
            subtitle="+18% from yesterday"
            icon="₹"
          />

          <StatCard
            title="Today's Rides"
            value="6"
            subtitle="4 completed"
            icon="🚗"
          />

          <StatCard
            title="Total Rating"
            value="4.9"
            subtitle="Based on 186 rides"
            icon="★"
          />

          <StatCard
            title="Total Distance"
            value="142 km"
            subtitle="This week"
            icon="📍"
          />

        </section>

        {/* Quick Actions */}
        <section className="mt-8">

          <h2 className="text-xl font-semibold">Quick Actions</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <QuickAction
              icon="➕"
              title="Offer a Ride"
              description="Create a new ride"
              href="/rides/create"
            />

            <QuickAction
              icon="📋"
              title="My Rides"
              description="Manage your rides"
              href="/rides"
            />

            <QuickAction
              icon="💰"
              title="Earnings"
              description="View your earnings"
              href="#earnings"
            />

            <QuickAction
              icon="🛡️"
              title="Safety"
              description="Safety center"
              href="/safety"
            />

          </div>

        </section>

        {/* Ride Requests + Upcoming */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* Ride Requests */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Ride Requests</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Passengers interested in your route.
                </p>
              </div>

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                3 New
              </span>
            </div>

            <div className="mt-5 space-y-4">

              <RequestCard
                initials="RK"
                name="Riya Kapoor"
                rating="4.9"
                route="Jaipur → Ajmer"
                time="Today • 6:30 PM"
                fare="₹280"
              />

              <RequestCard
                initials="MS"
                name="Mohit Sharma"
                rating="4.7"
                route="Jaipur → Kishangarh"
                time="Today • 7:00 PM"
                fare="₹220"
              />

              <RequestCard
                initials="NS"
                name="Neha Singh"
                rating="5.0"
                route="Jaipur → Ajmer"
                time="Tomorrow • 8:00 AM"
                fare="₹300"
              />

            </div>

          </div>

          {/* Upcoming Ride */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">

            <h2 className="text-lg font-semibold">Upcoming Ride</h2>

            <div className="mt-5 rounded-xl bg-indigo-50 p-5">

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Tomorrow
                </span>

                <span className="text-sm font-bold text-indigo-700">
                  8:00 AM
                </span>
              </div>

              <div className="mt-5 space-y-4">

                <div className="flex gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-indigo-600" />

                  <div>
                    <p className="text-xs text-slate-500">Pickup</p>
                    <p className="text-sm font-semibold">
                      Jaipur Railway Station
                    </p>
                  </div>
                </div>

                <div className="ml-1.5 h-5 border-l border-dashed border-indigo-300" />

                <div className="flex gap-3">
                  <div className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />

                  <div>
                    <p className="text-xs text-slate-500">Destination</p>
                    <p className="text-sm font-semibold">Ajmer</p>
                  </div>
                </div>

              </div>

              <div className="mt-5 flex items-center justify-between border-t border-indigo-100 pt-4">
                <div>
                  <p className="text-xs text-slate-500">Passengers</p>
                  <p className="text-sm font-semibold">2 / 3</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Expected Fare</p>
                  <p className="text-sm font-bold text-indigo-700">
                    ₹560
                  </p>
                </div>
              </div>

            </div>

            <button className="mt-4 w-full rounded-xl border border-indigo-200 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">
              View Ride Details
            </button>

          </div>

        </section>

        {/* Earnings */}
        <section
          id="earnings"
          className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Earnings Overview</h2>
              <p className="mt-1 text-sm text-slate-500">
                Your performance for this week.
              </p>
            </div>

            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
              View Full History
            </button>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">This Week</p>
              <p className="mt-2 text-2xl font-bold">₹6,840</p>
              <p className="mt-1 text-xs text-emerald-600">
                +12.4%
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">This Month</p>
              <p className="mt-2 text-2xl font-bold">₹24,680</p>
              <p className="mt-1 text-xs text-slate-500">
                47 completed rides
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Average / Ride</p>
              <p className="mt-2 text-2xl font-bold">₹525</p>
              <p className="mt-1 text-xs text-slate-500">
                After fare splitting
              </p>
            </div>

          </div>

        </section>

        {/* Driver Verification */}
        <section className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">

          <div className="flex gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl">
              ✓
            </div>

            <div>
              <h2 className="font-semibold text-emerald-900">
                Driver Verification Complete
              </h2>

              <p className="mt-1 text-sm leading-6 text-emerald-700">
                Your identity and vehicle documents have been verified.
                Verified drivers receive higher trust from passengers.
              </p>

              <button className="mt-4 text-sm font-semibold text-emerald-800 underline">
                View Verification Details
              </button>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}


/* ---------- Components ---------- */

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm text-indigo-700">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}


function QuickAction({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </a>
  );
}


function RequestCard({
  initials,
  name,
  rating,
  route,
  time,
  fare,
}: {
  initials: string;
  name: string;
  rating: string;
  route: string;
  time: string;
  fare: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            {initials}
          </div>

          <div>
            <p className="font-semibold">{name}</p>

            <p className="text-xs text-slate-500">
              ★ {rating} • Verified Passenger
            </p>
          </div>

        </div>

        <div className="sm:text-right">
          <p className="text-sm font-semibold">{route}</p>
          <p className="mt-1 text-xs text-slate-500">{time}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-indigo-700">{fare}</span>

          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
            Review
          </button>
        </div>

      </div>

    </div>
  );
}