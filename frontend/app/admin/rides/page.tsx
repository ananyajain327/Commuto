"use client";

import { useMemo, useState } from "react";

type Ride = {
  id: string;
  passenger: string;
  passengerEmail: string;
  driver: string;
  driverRating: number;
  from: string;
  to: string;
  date: string;
  time: string;
  fare: number;
  distance: string;
  passengers: number;
  status: "Active" | "Upcoming" | "Completed" | "Cancelled";
  safetyFlag: boolean;
};

const initialRides: Ride[] = [
  {
    id: "RID-5001",
    passenger: "Ananya Jain",
    passengerEmail: "ananya.jain@gmail.com",
    driver: "Rahul Sharma",
    driverRating: 4.9,
    from: "Jaipur",
    to: "Ajmer",
    date: "10 Sep 2026",
    time: "08:30 AM",
    fare: 180,
    distance: "135 km",
    passengers: 3,
    status: "Active",
    safetyFlag: false,
  },
  {
    id: "RID-5002",
    passenger: "Priya Mehta",
    passengerEmail: "priya.mehta@gmail.com",
    driver: "Aman Verma",
    driverRating: 4.7,
    from: "Jaipur",
    to: "Kishangarh",
    date: "11 Sep 2026",
    time: "09:15 AM",
    fare: 150,
    distance: "105 km",
    passengers: 2,
    status: "Upcoming",
    safetyFlag: false,
  },
  {
    id: "RID-5003",
    passenger: "Riya Sharma",
    passengerEmail: "riya.sharma@gmail.com",
    driver: "Vikram Singh",
    driverRating: 4.6,
    from: "Ajmer",
    to: "Jaipur",
    date: "09 Sep 2026",
    time: "05:30 PM",
    fare: 175,
    distance: "135 km",
    passengers: 3,
    status: "Completed",
    safetyFlag: false,
  },
  {
    id: "RID-5004",
    passenger: "Neha Gupta",
    passengerEmail: "neha.gupta@gmail.com",
    driver: "Rohit Meena",
    driverRating: 4.3,
    from: "Jaipur",
    to: "Alwar",
    date: "08 Sep 2026",
    time: "07:00 AM",
    fare: 220,
    distance: "150 km",
    passengers: 2,
    status: "Cancelled",
    safetyFlag: true,
  },
  {
    id: "RID-5005",
    passenger: "Kavya Joshi",
    passengerEmail: "kavya.joshi@gmail.com",
    driver: "Arjun Gupta",
    driverRating: 4.8,
    from: "Jaipur",
    to: "Udaipur",
    date: "12 Sep 2026",
    time: "06:45 AM",
    fare: 420,
    distance: "395 km",
    passengers: 4,
    status: "Upcoming",
    safetyFlag: false,
  },
];

export default function AdminRidesPage() {
  const [rides, setRides] = useState(initialRides);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        ride.id.toLowerCase().includes(searchText) ||
        ride.passenger.toLowerCase().includes(searchText) ||
        ride.driver.toLowerCase().includes(searchText) ||
        ride.from.toLowerCase().includes(searchText) ||
        ride.to.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || ride.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rides, search, statusFilter]);

  const stats = {
    total: rides.length,
    active: rides.filter((r) => r.status === "Active").length,
    upcoming: rides.filter((r) => r.status === "Upcoming").length,
    completed: rides.filter((r) => r.status === "Completed").length,
    cancelled: rides.filter((r) => r.status === "Cancelled").length,
    safety: rides.filter((r) => r.safetyFlag).length,
  };

  const statusStyle = (status: Ride["status"]) => {
    switch (status) {
      case "Active":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Upcoming":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  const cancelRide = (id: string) => {
    setRides((current) =>
      current.map((ride) =>
        ride.id === id
          ? { ...ride, status: "Cancelled", safetyFlag: true }
          : ride
      )
    );

    setSelectedRide((current) =>
      current?.id === id
        ? {
            ...current,
            status: "Cancelled",
            safetyFlag: true,
          }
        : current
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-100 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
                C
              </div>

              <div>
                <h1 className="text-lg font-bold">Commuto</h1>
                <p className="text-xs text-slate-500">
                  Admin Console
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5">
            <a
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              📊 Dashboard
            </a>

            <a
              href="/admin/users"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              👥 Users
            </a>

            <a
              href="/admin/drivers"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              🚗 Drivers
            </a>

            <a
              href="/admin/verifications"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              ✓ Verifications
            </a>

            <a
              href="/admin/rides"
              className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              🛣️ Rides
            </a>

            <a
              href="/admin/complaints"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              ⚠️ Complaints
            </a>

            <a
              href="/admin/analytics"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              📈 Analytics
            </a>
          </nav>

          <div className="border-t border-slate-100 p-4">
            <a
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              ← User Dashboard
            </a>
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="lg:ml-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Administration
              </p>

              <h2 className="text-xl font-bold sm:text-2xl">
                Ride Management
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">
                  Ananya Jain
                </p>
                <p className="text-xs text-slate-500">
                  Administrator
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                AJ
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-5 sm:p-8">
          {/* Intro */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              Platform Rides
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Monitor rides, bookings, fares and safety activity
              across Commuto.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Rides"
              value={stats.total}
              description="All platform rides"
              icon="🛣️"
            />

            <StatCard
              title="Active"
              value={stats.active}
              description="Currently running"
              icon="🔵"
            />

            <StatCard
              title="Upcoming"
              value={stats.upcoming}
              description="Scheduled rides"
              icon="🕐"
            />

            <StatCard
              title="Completed"
              value={stats.completed}
              description="Successfully completed"
              icon="✓"
            />
          </div>

          {/* Safety Alert */}
          {stats.safety > 0 && (
            <div className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100">
                  ⚠️
                </div>

                <div>
                  <h4 className="font-bold text-red-800">
                    Safety attention required
                  </h4>

                  <p className="mt-1 text-sm text-red-700">
                    {stats.safety} ride
                    {stats.safety > 1 ? "s have" : " has"} been
                    flagged for admin review.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStatusFilter("Cancelled")}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
              >
                Review Flagged
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ride ID, passenger, driver or route..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Ride Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h4 className="font-bold">All Rides</h4>

                <p className="text-xs text-slate-500">
                  Showing {filteredRides.length} rides
                </p>
              </div>

              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50">
                Export
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Ride</th>
                    <th className="px-5 py-4">Passenger</th>
                    <th className="px-5 py-4">Driver</th>
                    <th className="px-5 py-4">Route</th>
                    <th className="px-5 py-4">Schedule</th>
                    <th className="px-5 py-4">Fare</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRides.map((ride) => (
                    <tr
                      key={ride.id}
                      className="hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-5">
                        <p className="font-semibold">{ride.id}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          {ride.distance} • {ride.passengers}{" "}
                          passengers
                        </p>

                        {ride.safetyFlag && (
                          <span className="mt-2 inline-block rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700">
                            ⚠ Safety Flag
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-semibold">
                          {ride.passenger}
                        </p>

                        <p className="text-xs text-slate-500">
                          {ride.passengerEmail}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-semibold">
                          {ride.driver}
                        </p>

                        <p className="text-xs text-slate-500">
                          ⭐ {ride.driverRating}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-medium">
                          {ride.from}
                        </p>

                        <p className="my-1 text-xs text-slate-400">
                          ↓
                        </p>

                        <p className="text-sm font-medium">
                          {ride.to}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-medium">
                          {ride.date}
                        </p>

                        <p className="text-xs text-slate-500">
                          {ride.time}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-bold">
                          ₹{ride.fare}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(
                            ride.status
                          )}`}
                        >
                          {ride.status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <button
                          onClick={() => setSelectedRide(ride)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRides.length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-4xl">🛣️</div>

                  <p className="mt-3 font-semibold">
                    No rides found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Ride Details Modal */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Ride Details
                </p>

                <h3 className="text-xl font-bold">
                  {selectedRide.id}
                </h3>
              </div>

              <button
                onClick={() => setSelectedRide(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Status */}
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">
                <div>
                  <p className="text-sm text-slate-500">
                    Current Status
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(
                      selectedRide.status
                    )}`}
                  >
                    {selectedRide.status}
                  </span>
                </div>

                {selectedRide.safetyFlag && (
                  <div className="rounded-xl bg-red-100 px-3 py-2 text-xs font-bold text-red-700">
                    ⚠ Safety Flag
                  </div>
                )}
              </div>

              {/* Route */}
              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Journey
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-slate-900" />

                    <div className="h-14 border-l border-dashed border-slate-300" />

                    <div className="h-3 w-3 rounded-full border-2 border-slate-900 bg-white" />
                  </div>

                  <div className="space-y-7">
                    <div>
                      <p className="text-xs text-slate-400">
                        Pickup
                      </p>

                      <p className="font-bold">
                        {selectedRide.from}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Destination
                      </p>

                      <p className="font-bold">
                        {selectedRide.to}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <InfoBox
                    label="Distance"
                    value={selectedRide.distance}
                  />

                  <InfoBox
                    label="Passengers"
                    value={String(selectedRide.passengers)}
                  />

                  <InfoBox
                    label="Fare"
                    value={`₹${selectedRide.fare}`}
                  />
                </div>
              </div>

              {/* Passenger + Driver */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Passenger
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-bold">
                      {selectedRide.passenger
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div>
                      <p className="font-bold">
                        {selectedRide.passenger}
                      </p>

                      <p className="text-xs text-slate-500">
                        {selectedRide.passengerEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Driver
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                      {selectedRide.driver
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div>
                      <p className="font-bold">
                        {selectedRide.driver}
                      </p>

                      <p className="text-xs text-slate-500">
                        ⭐ {selectedRide.driverRating} rating
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoBox
                  label="Date"
                  value={selectedRide.date}
                />

                <InfoBox
                  label="Departure Time"
                  value={selectedRide.time}
                />
              </div>

              {/* Safety */}
              <div
                className={`rounded-2xl border p-5 ${
                  selectedRide.safetyFlag
                    ? "border-red-200 bg-red-50"
                    : "border-emerald-200 bg-emerald-50"
                }`}
              >
                <div className="flex gap-3">
                  <div className="text-xl">
                    {selectedRide.safetyFlag ? "⚠️" : "🛡️"}
                  </div>

                  <div>
                    <h4
                      className={`font-bold ${
                        selectedRide.safetyFlag
                          ? "text-red-800"
                          : "text-emerald-800"
                      }`}
                    >
                      {selectedRide.safetyFlag
                        ? "Safety Review Required"
                        : "No Safety Issues"}
                    </h4>

                    <p
                      className={`mt-1 text-sm ${
                        selectedRide.safetyFlag
                          ? "text-red-700"
                          : "text-emerald-700"
                      }`}
                    >
                      {selectedRide.safetyFlag
                        ? "This ride has been flagged and may require admin intervention."
                        : "No active safety flags are associated with this ride."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                {selectedRide.status !== "Completed" &&
                  selectedRide.status !== "Cancelled" && (
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to cancel this ride?"
                          )
                        ) {
                          cancelRide(selectedRide.id);
                        }
                      }}
                      className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
                    >
                      Cancel / Intervene
                    </button>
                  )}

                <button
                  onClick={() => setSelectedRide(null)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          {icon}
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}