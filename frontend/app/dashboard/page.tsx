"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const quickActions = [
  {
    icon: "📢",
    title: "Request a Ride",
    description: "Post a ride request or book seats",
    href: "/rides/request",
  },
  {
    icon: "🚗",
    title: "Offer a ride",
    description: "Share your journey with others",
    href: "/rides/create",
  },
  {
    icon: "📍",
    title: "Track a ride",
    description: "View your active journey",
    href: "/rides",
  },
  {
    icon: "🛡️",
    title: "Safety Center",
    description: "Your safety tools",
    href: "/safety",
  },
];

const recentRides = [
  {
    route: "Jaipur → Ajmer",
    date: "12 Sep 2026",
    time: "8:30 AM",
    status: "Upcoming",
    fare: "₹280",
    driver: "Verified Driver",
  },
  {
    route: "Jaipur → Kishangarh",
    date: "05 Sep 2026",
    time: "7:45 AM",
    status: "Completed",
    fare: "₹190",
    driver: "Rahul S.",
  },
  {
    route: "Vaishali Nagar → JECRC",
    date: "02 Sep 2026",
    time: "9:00 AM",
    status: "Completed",
    fare: "₹120",
    driver: "Priya M.",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ fullName?: string; email?: string; role?: string } | null>(null);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          // Redirect drivers and admins to their correct dashboards
          if (parsed?.role === "DRIVER") {
            router.replace("/driver/dashboard");
            return;
          }
          if (parsed?.role === "ADMIN") {
            router.replace("/admin");
            return;
          }
          setUser(parsed);
        }
      } catch {
        // Ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">

      {/* MOBILE NAV OVERLAY */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* SIDEBAR — desktop always visible, mobile slide-in */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col transition-transform duration-300 lg:w-64 lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-xl shadow-lg dark:bg-emerald-600 text-white">
            🚗
          </div>

          <div>
            <p className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Commuto</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Smart Mobility
            </p>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          className="absolute right-4 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Navigation */}
        <nav className="mt-2 flex-1 px-4 overflow-y-auto">

          <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Main menu
          </p>

          <SidebarItem icon="⌂" label="Overview" href="/dashboard" active />
          <SidebarItem icon="⌕" label="Find a Ride" href="/rides/search" />
          <SidebarItem icon="📢" label="Request a Ride" href="/rides/request" />
          <SidebarItem icon="🚗" label="Offer a Ride" href="/rides/create" />
          <SidebarItem icon="▣" label="My Rides" href="/rides" />

          <p className="mt-6 px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Personal
          </p>

          <SidebarItem icon="👤" label="My Profile" href="/profile" />
          <SidebarItem icon="💳" label="Wallet" href="/wallet" />
          <SidebarItem icon="🛡️" label="Safety Center" href="/safety" />
          <SidebarItem icon="★" label="Ratings" href="/ratings" />
          <SidebarItem icon="⚙" label="Settings" href="/settings" />
        </nav>

        {/* Safety card */}
        <div className="m-4 rounded-3xl bg-slate-900 dark:bg-slate-800/90 border border-slate-800 dark:border-slate-700 p-5 text-white shadow-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            🛡️
          </div>

          <p className="mt-4 text-sm font-bold text-white">Stay safe</p>

          <p className="mt-1 text-xs leading-5 text-slate-300 dark:text-slate-400">
            Your safety tools are always available during a ride.
          </p>

          <Link
            href="/safety"
            className="mt-4 block text-xs font-bold text-emerald-400 hover:underline"
          >
            Open Safety Center →
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:ml-64">

        {/* TOP BAR */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90 lg:px-8">
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              {/* Hamburger — mobile only */}
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 lg:hidden cursor-pointer"
                aria-label="Open menu"
              >
                <span className="h-0.5 w-5 rounded-full bg-slate-600 dark:bg-slate-300" />
                <span className="h-0.5 w-5 rounded-full bg-slate-600 dark:bg-slate-300" />
                <span className="h-0.5 w-3 self-start ml-1 rounded-full bg-slate-600 dark:bg-slate-300" />
              </button>

              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-400">Dashboard</p>
                <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-100">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>

              {/* Mobile brand */}
              <div className="flex items-center gap-2 sm:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sm dark:bg-emerald-600 text-white">🚗</div>
                <span className="text-base font-black text-slate-900 dark:text-white">Commuto</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Switcher */}
              <ThemeToggle />

              {/* Notification Link */}
              <Link
                href="/notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-base transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                🔔
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800" />
              </Link>

              {/* Profile – clickable */}
              <Link
                href="/profile"
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 transition hover:border-emerald-500/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-500/50 shadow-2xs"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs">
                  {initial}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{passengerName}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider leading-tight">
                    {roleDisplay}
                  </p>
                </div>
              </Link>

              {/* Sign Out */}
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="px-6 py-8 lg:px-8">

          {/* WELCOME */}
          <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Welcome back
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Where are you going, {passengerName.split(" ")[0]}?
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Find a compatible ride, share your journey and travel smarter with Commuto.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 dark:border-emerald-900/60 dark:bg-emerald-950/40 shadow-2xs">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />

              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Account Active
              </span>
            </div>
          </section>

          {/* SEARCH CARD */}
          <section className="mt-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl dark:bg-slate-900 dark:border-slate-800">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                  Smart ride search
                </p>

                <h2 className="mt-1.5 text-xl font-black text-white">
                  Find your next ride
                </h2>
              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl sm:flex">
                🧠
              </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-6 grid gap-3 lg:grid-cols-[1fr_1fr_160px]">

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xs border border-white/5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    From
                  </p>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={detectingLocation}
                    className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-bold text-emerald-300 hover:bg-white/25 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {detectingLocation ? (
                      <span>Detecting...</span>
                    ) : (
                      <>
                        <span>📍</span>
                        <span>Current Location</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <span>📍</span>

                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Pickup location"
                    className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xs border border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  To
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <span>🎯</span>

                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Destination"
                    className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-extrabold text-white transition hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                Find rides →
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <div className="rounded-xl bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 border border-white/5">
                📅 Today
              </div>

              <div className="rounded-xl bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 border border-white/5">
                👤 1 passenger
              </div>

              <div className="rounded-xl bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 border border-white/5">
                👩 Women-only preference
              </div>
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="mt-10">

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Quick actions
                </p>

                <h2 className="mt-1.5 text-2xl font-black text-slate-900 dark:text-white">
                  Everything you need
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/50 shadow-xs"
                >
                  <div className="flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl transition group-hover:bg-emerald-50 dark:bg-slate-800 dark:group-hover:bg-emerald-950/60">
                      {action.icon}
                    </div>

                    <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600 dark:text-slate-600 dark:group-hover:text-emerald-400">
                      →
                    </span>
                  </div>

                  <h3 className="mt-5 text-sm font-extrabold text-slate-900 dark:text-white">
                    {action.title}
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* UPCOMING + STATS */}
          <section className="mt-10 grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">

            {/* Upcoming ride */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Your next journey
                  </p>

                  <h2 className="mt-1.5 text-2xl font-black text-slate-900 dark:text-white">
                    Upcoming ride
                  </h2>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                  UPCOMING
                </span>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200/70 p-5 dark:border-slate-800 dark:bg-slate-800/60">

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-slate-700 text-xl shadow-xs">
                      🚗
                    </div>

                    <div>
                      <Link
                        href="/rides/details"
                        className="text-lg font-black text-slate-900 dark:text-white transition hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        Jaipur → Ajmer
                      </Link>

                      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Tomorrow · 8:30 AM
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Your share
                    </p>

                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      ₹280
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">

                  <span className="rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    🛡️ Verified driver
                  </span>

                  <span className="rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    ⭐ 4.8 rating
                  </span>

                  <span className="rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    🧠 94% match
                  </span>
                </div>

                <Link
                  href="/rides/details"
                  className="mt-5 block text-center w-full rounded-2xl bg-slate-900 dark:bg-emerald-600 py-3.5 text-xs font-extrabold text-white transition hover:bg-slate-800 dark:hover:bg-emerald-500 shadow-md cursor-pointer"
                >
                  View ride details →
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">

              <StatCard
                icon="🚗"
                value="12"
                label="Rides completed"
              />

              <StatCard
                icon="⭐"
                value="4.9"
                label="Your rating"
              />

              <StatCard
                icon="💰"
                value="₹2,840"
                label="Total saved"
              />
            </div>
          </section>

          {/* RECENT RIDES */}
          <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Activity
                </p>

                <h2 className="mt-1.5 text-2xl font-black text-slate-900 dark:text-white">
                  Recent rides
                </h2>
              </div>

              <Link
                href="/rides"
                className="text-xs font-extrabold text-emerald-600 hover:underline dark:text-emerald-400"
              >
                View all →
              </Link>
            </div>

            <div className="mt-6 overflow-x-auto">
              <div className="min-w-160">

                {recentRides.map((ride, index) => (
                  <div
                    key={`${ride.route}-${index}`}
                    className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 py-4.5"
                  >
                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                        🚗
                      </div>

                      <div>
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {ride.route}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {ride.date} · {ride.time}
                        </p>
                      </div>
                    </div>

                    <div className="hidden text-center sm:block">
                      <p className="text-xs font-semibold text-slate-400">
                        Driver
                      </p>

                      <p className="mt-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                        {ride.driver}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                        ride.status === "Upcoming"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                      }`}
                    >
                      {ride.status}
                    </span>

                    <div className="flex items-center gap-3">
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        {ride.fare}
                      </p>

                      <Link
                        href={`/rides/details?route=${encodeURIComponent(ride.route)}&driver=${encodeURIComponent(ride.driver)}&fare=${encodeURIComponent(ride.fare)}&date=${encodeURIComponent(ride.date)}&status=${encodeURIComponent(ride.status)}`}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-100 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="py-10 text-center">
            <p className="text-xs font-medium text-slate-400">
              Commuto · Share the Ride. Split the Fare. Travel Smarter.
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

function SidebarItem({
  icon,
  label,
  href = "/dashboard",
  active = false,
  onClose,
}: {
  icon: string;
  label: string;
  href?: string;
  active?: boolean;
  onClose?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
        active
          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white"
      }`}
    >
      <span className="flex h-6 w-6 items-center justify-center text-base">
        {icon}
      </span>

      {label}
    </Link>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
          {icon}
        </div>

        <span className="text-emerald-500 font-bold">↗</span>
      </div>

      <p className="mt-4 text-2xl font-black text-slate-900 dark:text-white">{value}</p>

      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}