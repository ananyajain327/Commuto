"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { apiUrl } from "@/lib/api";

interface PassengerRideRequest {
  id: number;
  seatsRequested: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  pickupPreference?: string;
  note?: string;
  createdAt: string;
  ride: {
    id: number;
    startLocation: string;
    destination: string;
    rideDate: string;
    departureTime: string;
    availableSeats: number;
    expectedFare: number;
    vehicleModel?: string;
    womenOnly?: boolean;
    status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
    driver?: {
      id: number;
      fullName: string;
      email: string;
      phone?: string;
    };
  };
}

const quickActions = [
  {
    icon: "🔍",
    title: "Find a Ride",
    description: "Search scheduled rides along your route",
    href: "/rides/search",
  },
  {
    icon: "📢",
    title: "Request a Ride",
    description: "Post a custom pickup & drop request",
    href: "/rides/request",
  },
  {
    icon: "🚗",
    title: "Offer a Ride",
    description: "Share your journey and empty seats",
    href: "/rides/create",
  },
  {
    icon: "🛡️",
    title: "Safety Center",
    description: "Emergency SOS and safety contacts",
    href: "/safety",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName?: string; email?: string; role?: string } | null>(null);
  const [requests, setRequests] = useState<PassengerRideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const fetchPassengerData = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(apiUrl("/api/ride-requests/my-requests"), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data: PassengerRideRequest[] = await res.json();
        setRequests(data || []);
      }
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role === "DRIVER") {
          router.replace("/driver/dashboard");
          return;
        }
        if (parsed?.role === "ADMIN") {
          router.replace("/admin");
          return;
        }
        setUser(parsed);
      } else {
        router.replace("/login");
        return;
      }
    } catch {
      router.replace("/login");
      return;
    }

    void fetchPassengerData();
  }, [router, fetchPassengerData]);

  const handleUseCurrentLocation = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const road = data.address?.road || "";
            const area =
              data.address?.suburb ||
              data.address?.neighbourhood ||
              data.address?.city ||
              data.address?.town ||
              "";
            const locationStr =
              road && area
                ? `${road}, ${area}`
                : data.display_name?.split(",").slice(0, 3).join(",") ||
                  `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
            setFromLocation(locationStr.trim());
          } else {
            setFromLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          }
        } catch {
          setFromLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        setDetectingLocation(false);
        alert(
          err.code === 1
            ? "Location permission was denied. Please enter your pickup point manually."
            : "Could not retrieve your location. Please enter your pickup point manually."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const passengerName = user?.fullName || "Passenger";
  const initial = passengerName[0]?.toUpperCase() || "P";
  const roleDisplay = user?.role || "Passenger";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fromLocation.trim()) params.set("from", fromLocation.trim());
    if (toLocation.trim()) params.set("to", toLocation.trim());
    router.push(`/rides/search?${params.toString()}`);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Real-time computed stats
  const completedRequests = requests.filter(
    (req) => req.status === "ACCEPTED" && req.ride?.status === "COMPLETED"
  );
  const ridesCompletedCount = completedRequests.length;

  const totalSpentAmount = completedRequests.reduce(
    (sum, req) => sum + (req.seatsRequested || 1) * (req.ride?.expectedFare || 0),
    0
  );

  const upcomingRequest = requests.find(
    (req) =>
      (req.status === "ACCEPTED" || req.status === "PENDING") &&
      (req.ride?.status === "UPCOMING" || req.ride?.status === "ACTIVE")
  );

  const recentRequests = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <main className="min-h-screen bg-[#faf8f5] text-stone-900 transition-colors dark:bg-[#12100e] dark:text-stone-100">
      {/* MOBILE NAV OVERLAY */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-stone-200 bg-white transition-transform duration-300 dark:border-stone-800 dark:bg-stone-900 lg:w-64 lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Link href="/" className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-700 text-lg font-black text-white shadow-md shadow-amber-900/20 dark:bg-amber-600">
            C
          </div>
          <div>
            <p className="text-xl font-black tracking-tight text-stone-900 dark:text-white">
              Commuto
            </p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
              Smart Mobility
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          className="absolute right-4 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800 lg:hidden cursor-pointer"
          aria-label="Close menu"
        >
          ✕
        </button>

        <nav className="mt-2 flex-1 overflow-y-auto px-4">
          <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
            Main menu
          </p>

          <SidebarItem icon="⌂" label="Overview" href="/dashboard" active />
          <SidebarItem icon="⌕" label="Find a Ride" href="/rides/search" />
          <SidebarItem icon="📢" label="Request a Ride" href="/rides/request" />
          <SidebarItem icon="🚗" label="Offer a Ride" href="/rides/create" />
          <SidebarItem icon="▣" label="My Bookings" href="/rides/my-requests" />

          <p className="mt-6 px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
            Account & Safety
          </p>

          <SidebarItem icon="👤" label="My Profile" href="/profile" />
          <SidebarItem icon="💳" label="Wallet" href="/wallet" />
          <SidebarItem icon="🛡️" label="Safety Center" href="/safety" />
          <SidebarItem icon="★" label="Ratings" href="/ratings" />
          <SidebarItem icon="⚙" label="Settings" href="/settings" />
        </nav>

        <div className="m-4 rounded-3xl border border-stone-800 bg-[#1c1917] p-5 text-white shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-base">
            🛡️
          </div>
          <p className="mt-3 text-sm font-bold text-white">Safety Center</p>
          <p className="mt-1 text-xs leading-relaxed text-stone-300 dark:text-stone-400">
            Live SOS and emergency contacts active during all rides.
          </p>
          <Link
            href="/safety"
            className="mt-3 block text-xs font-bold text-amber-400 hover:underline"
          >
            Safety Settings →
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:ml-64">
        {/* TOP BAR */}
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 px-4 py-4 backdrop-blur-xl dark:border-stone-800/80 dark:bg-stone-900/90 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 lg:hidden cursor-pointer"
                aria-label="Open menu"
              >
                <span className="h-0.5 w-5 rounded-full bg-stone-600 dark:bg-stone-300" />
                <span className="h-0.5 w-5 rounded-full bg-stone-600 dark:bg-stone-300" />
                <span className="h-0.5 w-3 self-start ml-1 rounded-full bg-stone-600 dark:bg-stone-300" />
              </button>

              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-stone-400">Passenger Dashboard</p>
                <p className="mt-0.5 text-sm font-bold text-stone-800 dark:text-stone-100">
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-700 text-sm font-bold text-white dark:bg-amber-600">
                  C
                </div>
                <span className="text-base font-black text-stone-900 dark:text-white">Commuto</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <ThemeToggle />

              <Link
                href="/notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-base transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 shadow-2xs"
              >
                🔔
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-stone-800" />
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-2.5 rounded-xl border border-stone-200 bg-white px-2.5 py-1.5 transition hover:border-amber-500/50 dark:border-stone-700 dark:bg-stone-800 shadow-2xs"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {initial}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold text-stone-900 dark:text-white leading-tight">
                    {passengerName}
                  </p>
                  <p className="text-[10px] text-stone-400 uppercase tracking-wider leading-tight">
                    {roleDisplay}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 cursor-pointer shadow-2xs"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* WELCOME */}
          <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
                Welcome back
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-stone-900 dark:text-white sm:text-3xl">
                Where are you heading, {passengerName.split(" ")[0]}?
              </h1>
              <p className="mt-1 max-w-xl text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                Search available carpools or request custom pickups along your commute.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-2xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 dark:border-emerald-900/60 dark:bg-emerald-950/40">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Account Active
              </span>
            </div>
          </section>

          {/* RIDE SEARCH FORM */}
          <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-5 shadow-2xs dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">
                  Quick Route Finder
                </p>
                <h2 className="mt-1 text-lg font-black text-stone-900 dark:text-white">
                  Find your next commute
                </h2>
              </div>
              <span className="text-2xl">🚗</span>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_160px]"
            >
              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-700 dark:bg-stone-800/60">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    From (Pickup)
                  </p>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={detectingLocation}
                    className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 transition cursor-pointer"
                  >
                    {detectingLocation ? "Detecting..." : "📍 Current Location"}
                  </button>
                </div>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <span className="text-sm">📍</span>
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Enter pickup point"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400 dark:text-white"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-700 dark:bg-stone-800/60">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  To (Destination)
                </p>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <span className="text-sm">🎯</span>
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-stone-900 outline-none placeholder:text-stone-400 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-amber-700 px-5 py-3.5 text-xs sm:text-sm font-extrabold text-white transition hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 shadow-md shadow-amber-900/20 active:scale-95 cursor-pointer"
              >
                <span>Search Rides →</span>
              </button>
            </form>
          </section>

          {/* QUICK ACTIONS */}
          <section className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
              Quick actions
            </p>
            <div className="mt-3 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-3xl border border-stone-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-amber-500/50 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-lg transition group-hover:bg-amber-50 dark:bg-stone-800 dark:group-hover:bg-amber-950/60">
                      {action.icon}
                    </div>
                    <span className="text-stone-300 transition group-hover:translate-x-1 group-hover:text-amber-700 dark:text-stone-600 dark:group-hover:text-amber-400">
                      →
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-extrabold text-stone-900 dark:text-white">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* REAL TIME STATS & UPCOMING RIDE */}
          <section className="mt-8 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
            {/* UPCOMING RIDE CARD */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                    Your Scheduled Journey
                  </p>
                  <h2 className="mt-1 text-xl font-black text-stone-900 dark:text-white">
                    Next Upcoming Ride
                  </h2>
                </div>
                {upcomingRequest && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                    {upcomingRequest.status === "ACCEPTED" ? "CONFIRMED" : "PENDING"}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="mt-6 flex items-center justify-center py-10">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-700 border-t-transparent dark:border-amber-500" />
                </div>
              ) : upcomingRequest ? (
                <div className="mt-5 rounded-2xl border border-stone-200/80 bg-stone-50/60 p-5 dark:border-stone-800 dark:bg-stone-800/50">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-xl text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        🚗
                      </div>
                      <div>
                        <p className="text-base font-black text-stone-900 dark:text-white">
                          {upcomingRequest.ride.startLocation} → {upcomingRequest.ride.destination}
                        </p>
                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                          {upcomingRequest.ride.rideDate} · {upcomingRequest.ride.departureTime}
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs text-stone-400">Your Share</p>
                      <p className="text-xl font-black text-stone-900 dark:text-white">
                        ₹{(upcomingRequest.seatsRequested || 1) * (upcomingRequest.ride.expectedFare || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/60 pt-4 dark:border-stone-700/60">
                    <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
                      <span>Driver:</span>
                      <span className="font-bold">
                        {upcomingRequest.ride.driver?.fullName || "Verified Driver"}
                      </span>
                    </div>

                    <Link
                      href={`/rides/tracking/${upcomingRequest.ride.id}`}
                      className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500"
                    >
                      Track Ride Live →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-stone-200 p-6 text-center dark:border-stone-800">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-xl dark:bg-stone-800">
                    📅
                  </div>
                  <h3 className="mt-3 text-sm font-extrabold text-stone-800 dark:text-stone-200">
                    No upcoming rides scheduled
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-xs text-stone-500 dark:text-stone-400">
                    You don&apos;t have any active bookings right now. Find an available commute or post your own custom request.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                    <Link
                      href="/rides/search"
                      className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500"
                    >
                      Find a Ride
                    </Link>
                    <Link
                      href="/rides/request"
                      className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                    >
                      Post Request
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* STATS */}
            <div className="grid gap-3.5 sm:grid-cols-3 xl:grid-cols-1">
              <StatCard
                icon="🚗"
                value={loading ? "..." : String(ridesCompletedCount)}
                label="Rides completed"
                description={ridesCompletedCount === 0 ? "Take your first ride" : "Successfully completed"}
              />

              <StatCard
                icon="💰"
                value={loading ? "..." : `₹${totalSpentAmount.toLocaleString("en-IN")}`}
                label="Total spent"
                description={totalSpentAmount === 0 ? "Zero bookings yet" : "On completed trips"}
              />

              <StatCard
                icon="🛡️"
                value={loading ? "..." : ridesCompletedCount === 0 ? "New Member" : "Active"}
                label="Safety Status"
                description="Verified Commuter"
              />
            </div>
          </section>

          {/* RECENT RIDES */}
          <section className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
                  Activity
                </p>
                <h2 className="mt-1 text-xl font-black text-stone-900 dark:text-white">
                  Recent Rides & Bookings
                </h2>
              </div>

              <Link
                href="/rides/my-requests"
                className="text-xs font-extrabold text-amber-700 hover:underline dark:text-amber-400"
              >
                View all bookings →
              </Link>
            </div>

            <div className="mt-5">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-700 border-t-transparent dark:border-amber-500" />
                </div>
              ) : recentRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 dark:border-stone-800">
                        <th className="pb-3 font-bold uppercase tracking-wider">Route</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Date & Time</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Seats</th>
                        <th className="pb-3 font-bold uppercase tracking-wider">Total Fare</th>
                        <th className="pb-3 text-right font-bold uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {recentRequests.map((req) => (
                        <tr key={req.id} className="text-stone-800 dark:text-stone-200">
                          <td className="py-3.5 font-bold">
                            {req.ride?.startLocation} → {req.ride?.destination}
                          </td>
                          <td className="py-3.5 text-stone-500 dark:text-stone-400">
                            {req.ride?.rideDate} · {req.ride?.departureTime}
                          </td>
                          <td className="py-3.5">{req.seatsRequested} Seat(s)</td>
                          <td className="py-3.5 font-bold">
                            ₹{(req.seatsRequested || 1) * (req.ride?.expectedFare || 0)}
                          </td>
                          <td className="py-3.5 text-right">
                            <span
                              className={`inline-block rounded-lg px-2.5 py-1 text-[10px] font-extrabold ${
                                req.status === "ACCEPTED"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : req.status === "PENDING"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                  : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-xs font-semibold text-stone-400">
                    No recent rides or booking requests yet.
                  </p>
                  <p className="mt-1 text-[11px] text-stone-500">
                    Once you request or complete a commute, your journey timeline will appear here in real time.
                  </p>
                  <Link
                    href="/rides/search"
                    className="mt-4 inline-block rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-2xs transition hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500"
                  >
                    Explore Available Rides
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SidebarItem({
  icon,
  label,
  href,
  active = false,
}: {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-extrabold transition ${
        active
          ? "bg-amber-700 text-white shadow-md shadow-amber-900/20 dark:bg-amber-600"
          : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800/60 dark:hover:text-white"
      }`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function StatCard({
  icon,
  value,
  label,
  description,
}: {
  icon: string;
  value: string;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900 shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100 text-base dark:bg-stone-800">
          {icon}
        </div>
        <div>
          <p className="text-xl font-black text-stone-900 dark:text-white">{value}</p>
          <p className="text-[11px] font-bold text-stone-500 dark:text-stone-400">{label}</p>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-stone-400 dark:text-stone-500">{description}</p>
    </div>
  );
}