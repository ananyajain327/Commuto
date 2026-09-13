"use client";

import { useEffect, useState } from "react";

type RideStatus =
  | "Upcoming"
  | "Active"
  | "Completed"
  | "Cancelled";

type BackendRide = {
  id: number;
  driverId: number;
  driverName: string;
  startLocation: string;
  destination: string;
  rideDate: string;
  departureTime: string;
  availableSeats: number;
  expectedFare: number;
  vehicleModel: string;
  vehicleNumber: string;
  womenOnly: boolean;
  notes?: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
};

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
  womenOnly: boolean;
};

export default function MyRidesPage() {
  const [activeTab, setActiveTab] =
    useState<"All" | RideStatus>("All");

  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH DRIVER RIDES
  // =========================

  useEffect(() => {
    const fetchMyRides = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login as a driver to view your rides.");
          return;
        }

        const response = await fetch(
          "http://localhost:8080/api/rides/my-rides",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Your session has expired. Please login again.");
          }

          if (response.status === 403) {
            throw new Error(
              "You do not have permission to view driver rides."
            );
          }

          throw new Error("Failed to fetch your rides.");
        }

        const data: BackendRide[] = await response.json();

        const mappedRides: Ride[] = data.map((ride) => ({
          id: ride.id,
          status: mapStatus(ride.status),
          role: "Driver",
          from: ride.startLocation,
          to: ride.destination,
          date: formatDate(ride.rideDate),
          time: formatTime(ride.departureTime),
          person: `${ride.availableSeats} ${
            ride.availableSeats === 1 ? "Seat" : "Seats"
          }`,
          rating: "—",
          fare: `₹${ride.expectedFare}`,
          seats:
            ride.availableSeats > 0
              ? `${ride.availableSeats} ${
                  ride.availableSeats === 1 ? "seat" : "seats"
                } available`
              : "Full",
          vehicle: ride.vehicleModel,
          womenOnly: ride.womenOnly,
        }));

        setRides(mappedRides);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading rides."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyRides();
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredRides =
    activeTab === "All"
      ? rides
      : rides.filter((ride) => ride.status === activeTab);

  // =========================
  // STATS
  // =========================

  const totalRides = rides.length;

  const upcomingRides = rides.filter(
    (ride) => ride.status === "Upcoming"
  ).length;

  const completedRides = rides.filter(
    (ride) => ride.status === "Completed"
  ).length;

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

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Rides"
            value={loading ? "..." : String(totalRides)}
            icon="🚗"
          />

          <StatCard
            label="Upcoming"
            value={loading ? "..." : String(upcomingRides)}
            icon="📅"
          />

          <StatCard
            label="Completed"
            value={loading ? "..." : String(completedRides)}
            icon="✓"
          />

          <StatCard
            label="Money Earned"
            value={
              loading
                ? "..."
                : `₹${rides
                    .filter((ride) => ride.status === "Completed")
                    .reduce(
                      (total, ride) =>
                        total + Number(ride.fare.replace("₹", "")),
                      0
                    )}`
            }
            icon="💰"
          />

        </section>

        {/* Tabs */}
        <section className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">

          <div className="flex min-w-max gap-1">

            {(
              [
                "All",
                "Upcoming",
                "Active",
                "Completed",
                "Cancelled",
              ] as const
            ).map((tab) => (

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

            ))}

          </div>

        </section>

        {/* Results */}
        <section>

          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold">
                {activeTab === "All"
                  ? "All rides"
                  : `${activeTab} rides`}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading rides..."
                  : `${filteredRides.length} ride${
                      filteredRides.length !== 1 ? "s" : ""
                    } found`}
              </p>

            </div>

            <div className="hidden sm:block">

              <a
                href="/rides/create"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                + Offer a Ride
              </a>

            </div>

          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white py-20 text-center shadow-sm">

              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-5 text-sm font-semibold text-slate-500">
                Loading your rides...
              </p>

            </div>
          )}

          {/* Results */}
          {!loading && filteredRides.length > 0 && (
            <div className="space-y-5">

              {filteredRides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                />
              ))}

            </div>
          )}

          {/* Empty */}
          {!loading && filteredRides.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">

              <div className="text-5xl">🚗</div>

              <h3 className="mt-4 text-lg font-bold">
                No rides found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {rides.length === 0
                  ? "You haven't published any rides yet."
                  : "There are no rides in this category yet."}
              </p>

              {rides.length === 0 && (
                <a
                  href="/rides/create"
                  className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  🚗 Offer Your First Ride
                </a>
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

/* =====================================================
   RIDE CARD
===================================================== */

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

          {ride.womenOnly && (
            <span className="rounded-lg bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-600">
              👩 Women Only
            </span>
          )}

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
                <p className="text-xs text-slate-400">
                  FROM
                </p>

                <p className="font-bold">
                  {ride.from}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  TO
                </p>

                <p className="font-bold">
                  {ride.to}
                </p>
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

            <InfoRow
              icon="📅"
              label="Date"
              value={ride.date}
            />

            <InfoRow
              icon="🕐"
              label="Departure"
              value={ride.time}
            />

          </div>

        </div>

        {/* Driver */}
        <div>

          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            Ride Information
          </p>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              🚗
            </div>

            <div>

              <p className="text-sm font-bold">
                You
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Driver
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

          <p className="text-xs text-slate-400">
            EXPECTED FARE
          </p>

          <p className="mt-1 text-xl font-bold">
            {ride.fare}
          </p>

        </div>

        <div className="flex gap-3">

          <a
            href={`/rides/details?id=${ride.id}`}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            View Details
          </a>

          {ride.status === "Upcoming" && (
            <button
              type="button"
              onClick={() =>
                alert(
                  "Ride cancellation will be connected to the backend soon."
                )
              }
              className="rounded-xl border border-red-200 px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              Cancel Ride
            </button>
          )}

          {ride.status === "Completed" && (
            <a
              href="/ratings"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              Rate Ride
            </a>
          )}

          {ride.status === "Active" && (
            <a
              href="/rides/tracking"
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Track Ride
            </a>
          )}

        </div>

      </div>

    </article>
  );
}

/* =====================================================
   STATUS BADGE
===================================================== */

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

/* =====================================================
   STAT CARD
===================================================== */

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

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>

        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg">
          {icon}
        </div>

      </div>

    </div>
  );
}

/* =====================================================
   INFO ROW
===================================================== */

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

        <p className="mt-0.5 text-sm font-semibold">
          {value}
        </p>

      </div>

    </div>
  );
}

/* =====================================================
   HELPERS
===================================================== */

function mapStatus(
  status: BackendRide["status"]
): RideStatus {

  switch (status) {
    case "UPCOMING":
      return "Upcoming";

    case "ACTIVE":
      return "Active";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return "Upcoming";
  }
}

function formatDate(date: string): string {

  if (!date) {
    return "—";
  }

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string): string {

  if (!time) {
    return "—";
  }

  const [hours, minutes] = time.split(":");

  const hour = Number(hours);

  if (Number.isNaN(hour)) {
    return time;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minutes} ${suffix}`;
}