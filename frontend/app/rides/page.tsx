"use client";

import { useState } from "react";

type RideStatus = "Upcoming" | "Active" | "Completed" | "Cancelled";

type Ride = {
  id: number;
  status: RideStatus;
  role: "Passenger" | "Driver";
  from: string;
  to: string;
  date: string;
  time: string;
  person: string;
  rating: string;
  fare: string;
  seats: string;
  vehicle: string;
};

const rides: Ride[] = [
  {
    id: 1,
    status: "Upcoming",
    role: "Passenger",
    from: "Jaipur",
    to: "Ajmer",
    date: "18 Sep 2026",
    time: "08:30 AM",
    person: "Rahul Sharma",
    rating: "4.9",
    fare: "₹320",
    seats: "2 seats",
    vehicle: "Hyundai Creta",
  },
  {
    id: 2,
    status: "Active",
    role: "Driver",
    from: "Jaipur",
    to: "Kishangarh",
    date: "10 Sep 2026",
    time: "09:15 AM",
    person: "2 Passengers",
    rating: "4.8",
    fare: "₹280",
    seats: "1 seat available",
    vehicle: "Maruti Brezza",
  },
  {
    id: 3,
    status: "Completed",
    role: "Passenger",
    from: "Jaipur",
    to: "Delhi",
    date: "05 Sep 2026",
    time: "06:00 AM",
    person: "Aman Verma",
    rating: "4.7",
    fare: "₹850",
    seats: "1 seat",
    vehicle: "Honda City",
  },
  {
    id: 4,
    status: "Completed",
    role: "Driver",
    from: "Jaipur",
    to: "Udaipur",
    date: "29 Aug 2026",
    time: "07:30 AM",
    person: "3 Passengers",
    rating: "4.9",
    fare: "₹1,050",
    seats: "Full",
    vehicle: "Tata Nexon",
  },
  {
    id: 5,
    status: "Cancelled",
    role: "Passenger",
    from: "Jaipur",
    to: "Alwar",
    date: "24 Aug 2026",
    time: "10:00 AM",
    person: "Priya Mehta",
    rating: "4.8",
    fare: "₹450",
    seats: "1 seat",
    vehicle: "Hyundai i20",
  },
];

export default function MyRidesPage() {
  const [activeTab, setActiveTab] = useState<"All" | RideStatus>("All");

  const filteredRides =
    activeTab === "All"
      ? rides
      : rides.filter((ride) => ride.status === activeTab);

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
              Manage all your shared journeys
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

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <section className="mb-8 rounded-3xl bg-slate-900 px-8 py-9 text-white shadow-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Your Journeys
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            My Rides
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
            Track your upcoming journeys, manage active rides and view your
            complete ride history in one place.
          </p>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Rides"
            value="24"
            icon="🚗"
          />

          <StatCard
            label="Upcoming"
            value="2"
            icon="📅"
          />

          <StatCard
            label="Completed"
            value="19"
            icon="✓"
          />

          <StatCard
            label="Money Saved"
            value="₹4,850"
            icon="💰"
          />
        </section>

        {/* Tabs */}
        <section className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex min-w-max gap-1">
            {(["All", "Upcoming", "Active", "Completed", "Cancelled"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </section>

        {/* Results */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {activeTab === "All" ? "All rides" : `${activeTab} rides`}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredRides.length} ride
                {filteredRides.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="hidden sm:block">
              <a
                href="/rides/search"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                + Find a Ride
              </a>
            </div>
          </div>

          {filteredRides.length > 0 ? (
            <div className="space-y-5">
              {filteredRides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <div className="text-5xl">🚗</div>

              <h3 className="mt-4 text-lg font-bold">
                No rides found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                There are no rides in this category yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function RideCard({ ride }: { ride: Ride }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
      {/* Top row */}
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge status={ride.status} />

          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {ride.role}
          </span>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Ride ID: CM-{String(ride.id).padStart(4, "0")}
        </span>
      </div>

      {/* Main content */}
      <div className="grid gap-7 lg:grid-cols-[1.4fr_1fr_1fr]">
        {/* Route */}
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Journey
          </p>

          <div className="flex gap-4">
            <div className="flex flex-col items-center pt-1">
              <span className="h-3 w-3 rounded-full border-2 border-blue-600" />

              <span className="h-12 border-l border-dashed border-slate-300" />

              <span className="h-3 w-3 rounded-full bg-blue-600" />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs text-slate-400">FROM</p>
                <p className="font-bold">{ride.from}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">TO</p>
                <p className="font-bold">{ride.to}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Schedule
          </p>

          <div className="space-y-4">
            <InfoRow icon="📅" label="Date" value={ride.date} />
            <InfoRow icon="🕐" label="Departure" value={ride.time} />
          </div>
        </div>

        {/* Person */}
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            {ride.role === "Passenger" ? "Driver" : "Passengers"}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              {ride.role === "Passenger" ? "RS" : "2P"}
            </div>

            <div>
              <p className="text-sm font-bold">{ride.person}</p>

              <p className="mt-1 text-xs text-slate-500">
                ★ {ride.rating} rating
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <p className="text-xs text-slate-500">
              🚗 {ride.vehicle}
            </p>

            <p className="text-xs text-slate-500">
              💺 {ride.seats}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-7 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-400">TOTAL FARE</p>
          <p className="mt-1 text-xl font-bold">{ride.fare}</p>
        </div>

        <div className="flex gap-3">
          <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
            View Details
          </button>

          {ride.status === "Upcoming" && (
            <button className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50">
              Cancel Ride
            </button>
          )}

          {ride.status === "Completed" && (
            <button className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600">
              Rate Ride
            </button>
          )}

          {ride.status === "Active" && (
            <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
              Track Ride
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: RideStatus }) {
  const styles = {
    Upcoming: "bg-blue-50 text-blue-600",
    Active: "bg-green-50 text-green-600",
    Completed: "bg-slate-100 text-slate-600",
    Cancelled: "bg-red-50 text-red-600",
  };

  const icons = {
    Upcoming: "📅",
    Active: "●",
    Completed: "✓",
    Cancelled: "×",
  };

  return (
    <span
      className={`rounded-lg px-3 py-1.5 text-xs font-bold ${styles[status]}`}
    >
      {icons[status]} {status}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg">
          {icon}
        </div>
      </div>
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
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-sm">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
