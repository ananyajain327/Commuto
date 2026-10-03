"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiUrl } from "@/lib/api";

type Ride = {
  id: string;
  rawId?: number;
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
    rawId: 5001,
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
    rawId: 5002,
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
    rawId: 5003,
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
    rawId: 5004,
    passenger: "Neha Sharma",
    passengerEmail: "neha.sharma@gmail.com",
    driver: "Rohit Meena",
    driverRating: 4.5,
    from: "Jaipur",
    to: "Delhi",
    date: "08 Sep 2026",
    time: "06:00 AM",
    fare: 550,
    distance: "280 km",
    passengers: 4,
    status: "Cancelled",
    safetyFlag: true,
  },
];

interface BackendRide {
  id: number;
  driverId: number;
  driverName: string;
  startLocation: string;
  destination: string;
  departureTime: string;
  availableSeats: number;
  expectedFare: number;
  status: "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
}

export default function AdminRidesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rides, setRides] = useState<Ride[]>(initialRides);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    const fetchRides = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(apiUrl("/api/admin/rides"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok && isCurrent) {
          const data = (await res.json()) as BackendRide[];
          if (data && data.length > 0) {
            const mapped: Ride[] = data.map((r) => {
              const depDate = r.departureTime ? new Date(r.departureTime) : new Date();
              const statusMapped: Ride["status"] =
                r.status === "ACTIVE"
                  ? "Active"
                  : r.status === "COMPLETED"
                  ? "Completed"
                  : r.status === "CANCELLED"
                  ? "Cancelled"
                  : "Upcoming";

              return {
                id: `RID-${r.id}`,
                rawId: r.id,
                passenger: "Commuto Pool",
                passengerEmail: "pool@commuto.com",
                driver: r.driverName || `Captain #${r.driverId}`,
                driverRating: 4.8,
                from: r.startLocation,
                to: r.destination,
                date: depDate.toLocaleDateString(),
                time: depDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                fare: r.expectedFare,
                distance: "Intercity",
                passengers: r.availableSeats,
                status: statusMapped,
                safetyFlag: false,
              };
            });
            setRides(mapped);
          }
        }
      } catch {
        // Fall back gracefully to mock initialRides
      }
    };

    void fetchRides();
    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      const matchesSearch =
        ride.id.toLowerCase().includes(search.toLowerCase()) ||
        ride.driver.toLowerCase().includes(search.toLowerCase()) ||
        ride.passenger.toLowerCase().includes(search.toLowerCase()) ||
        ride.from.toLowerCase().includes(search.toLowerCase()) ||
        ride.to.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || ride.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rides, search, statusFilter]);

  const handleOpenRide = (ride: Ride) => {
    setSelectedRide(ride);
    setIsModalOpen(true);
  };

  const totalRides = rides.length;
  const activeRides = rides.filter((r) => r.status === "Active").length;
  const completedRides = rides.filter((r) => r.status === "Completed").length;
  const cancelledRides = rides.filter((r) => r.status === "Cancelled").length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <AdminHeader
          title="Rides Management"
          subtitle="Real-time ride tracking, schedules, route logs and platform trips"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Rides" }]}
        />

        {/* Content */}
        <div className="space-y-8 px-6 py-8">
          {/* Top Summary Cards */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Rides</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{totalRides}</h3>
              <p className="mt-2 text-xs text-slate-400">All registered trips</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Live</p>
              <h3 className="mt-3 text-3xl font-bold text-blue-600 dark:text-blue-400">{activeRides}</h3>
              <p className="mt-2 text-xs text-blue-600">Currently in progress</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</p>
              <h3 className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{completedRides}</h3>
              <p className="mt-2 text-xs text-emerald-600">Successful journeys</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Cancelled</p>
              <h3 className="mt-3 text-3xl font-bold text-red-600 dark:text-red-400">{cancelledRides}</h3>
              <p className="mt-2 text-xs text-red-500">Unfulfilled trips</p>
            </div>
          </section>

          {/* Table Card */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            {/* Filter Bar */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
              <div className="flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ride ID, passenger, driver, or city..."
                  className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Rides Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="px-6 py-4">Ride ID</th>
                    <th className="px-6 py-4">Route</th>
                    <th className="px-6 py-4">Driver</th>
                    <th className="px-6 py-4">Schedule</th>
                    <th className="px-6 py-4">Fare</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredRides.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                        No rides found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredRides.map((ride) => (
                      <tr key={ride.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{ride.id}</td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {ride.from} → {ride.to}
                          </p>
                          <p className="text-xs text-slate-400">{ride.distance} • {ride.passengers} seats</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{ride.driver}</p>
                          <p className="text-xs text-slate-400">★ {ride.driverRating}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900 dark:text-white">{ride.date}</p>
                          <p className="text-xs text-slate-400">{ride.time}</p>
                        </td>

                        <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                          ₹{ride.fare}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              ride.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : ride.status === "Active"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                                : ride.status === "Upcoming"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                                : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                            }`}
                          >
                            {ride.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleOpenRide(ride)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Ride Details Modal */}
      {isModalOpen && selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ride Details • {selectedRide.id}</h3>
                <p className="text-xs text-slate-400">{selectedRide.date} at {selectedRide.time}</p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="col-span-2 rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Route</p>
                <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  {selectedRide.from} ➔ {selectedRide.to}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Captain / Driver</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selectedRide.driver}</p>
                <p className="text-xs text-slate-500">★ {selectedRide.driverRating}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Fare & Seats</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">₹{selectedRide.fare}</p>
                <p className="text-xs text-slate-500">{selectedRide.passengers} seats booked/available</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  selectedRide.status === "Completed"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                    : selectedRide.status === "Active"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                    : selectedRide.status === "Upcoming"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                    : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                }`}
              >
                Status: {selectedRide.status}
              </span>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}