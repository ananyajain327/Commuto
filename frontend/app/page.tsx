"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const router = useRouter();

  const handleProtectedNavigation = (targetPath: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      router.push(targetPath);
    } else {
      router.push(`/login?redirect=${encodeURIComponent(targetPath)}`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-black text-lg text-white shadow-md shadow-indigo-500/20">
              C
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Commuto
              </span>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Smart Mobility
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300 md:flex">
            <a
              href="#how-it-works"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              How it works
            </a>
            <a
              href="#features"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Why Commuto
            </a>
            <a
              href="#safety"
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Safety Standards
            </a>
            <button
              type="button"
              onClick={() => handleProtectedNavigation("/rides/search")}
              className="transition hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              Browse Rides
            </button>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/70 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-xs dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Student & Workplace Carpooling
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl sm:leading-[1.1]">
            Share the ride.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-emerald-400">
              Split the fuel cost.
            </span>
            <br />
            Travel safer together.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            Commuto connects everyday commuters heading in the same direction.
            Cut daily travel expenses, reduce highway congestion, and ride with
            verified community members.
          </p>

          {/* PRIMARY AUTH & INTENT ACTIONS */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-95"
            >
              <span>🚀</span>
              <span>Get Started / Register</span>
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-extrabold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 active:scale-95"
            >
              <span>🔑</span>
              <span>Log In</span>
            </Link>
          </div>

          {/* RIDE OPTIONS (PROTECTED REDIRECTS) */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleProtectedNavigation("/rides/search")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
            >
              <span>🔍 Find a Ride</span>
            </button>

            <button
              type="button"
              onClick={() => handleProtectedNavigation("/rides/create")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
            >
              <span>🚗 Offer Seats</span>
            </button>

            <button
              type="button"
              onClick={() => handleProtectedNavigation("/rides/request")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
            >
              <span>📢 Post Custom Request</span>
            </button>
          </div>

          {/* QUICK TRUST BADGES */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900/60 shadow-xs">
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">100%</p>
              <p className="mt-0.5 text-xs font-bold text-slate-600 dark:text-slate-400">Verified Profiles</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900/60 shadow-xs">
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹0</p>
              <p className="mt-0.5 text-xs font-bold text-slate-600 dark:text-slate-400">Commission Fee</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900/60 shadow-xs">
              <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">Live</p>
              <p className="mt-0.5 text-xs font-bold text-slate-600 dark:text-slate-400">GPS & SOS Shield</p>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900/60 shadow-xs">
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">👩 Safe</p>
              <p className="mt-0.5 text-xs font-bold text-slate-600 dark:text-slate-400">Women-Only Option</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-slate-200/80 bg-white py-16 dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Simple & Transparent
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
              How Commuto works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Whether you are driving your daily route or looking for an affordable seat, getting started takes under two minutes.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="relative rounded-3xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl text-white font-black shadow-md shadow-indigo-500/20">
                1
              </div>
              <h3 className="mt-5 text-base font-extrabold text-slate-900 dark:text-white">
                Create Account or Log In
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Sign up with your verified details. Choose whether you want to ride as a passenger or offer carpools as a driver.
              </p>
            </div>

            <div className="relative rounded-3xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-xl text-white font-black shadow-md shadow-indigo-500/20">
                2
              </div>
              <h3 className="mt-5 text-base font-extrabold text-slate-900 dark:text-white">
                Match & Request Instantly
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Search available rides or publish your seats. Requests are confirmed instantly with verified ratings and vehicle details.
              </p>
            </div>

            <div className="relative rounded-3xl border border-slate-200 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-xl text-white font-black shadow-md shadow-emerald-500/20">
                3
              </div>
              <h3 className="mt-5 text-base font-extrabold text-slate-900 dark:text-white">
                Ride, Track & Split Fare
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Track driver location live with integrated safety shields. Pay transparently with zero hidden charges or commissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY COMMUTO */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              Features
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
              Built for everyday dependability
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-2xl">⚡</span>
              <h3 className="mt-4 text-sm font-extrabold text-slate-900 dark:text-white">Real-Time GPS Tracking</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Passengers can monitor the driver’s location in real-time before and during the trip.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-2xl">👩</span>
              <h3 className="mt-4 text-sm font-extrabold text-slate-900 dark:text-white">Women-Only Pooling</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Filter rides by women-only to ensure comfortable, safe journeys for female riders and drivers.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-2xl">🛡️</span>
              <h3 className="mt-4 text-sm font-extrabold text-slate-900 dark:text-white">One-Touch Emergency SOS</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Instant safety alert dispatch with emergency contact notifications and location logs.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-2xl">💰</span>
              <h3 className="mt-4 text-sm font-extrabold text-slate-900 dark:text-white">Fair Cost Sharing</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Fixed, algorithm-assisted per-seat pricing that covers fuel without commercial surging.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-2xl">💬</span>
              <h3 className="mt-4 text-sm font-extrabold text-slate-900 dark:text-white">In-App Ride Chat</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Coordinate pickup spots directly within the platform without sharing private phone numbers.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <span className="text-2xl">⭐</span>
              <h3 className="mt-4 text-sm font-extrabold text-slate-900 dark:text-white">Mutual Community Ratings</h3>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Two-way ratings ensure accountability, punctuality, and courteous behavior across all trips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER BANNER */}
      <section className="border-t border-slate-200/80 bg-white px-4 py-16 text-center dark:border-slate-800/80 dark:bg-slate-900">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Ready to start carpooling?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create your account today and connect with people commuting your way.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-700"
            >
              Get Started (Sign Up)
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        <p>© 2026 Commuto. Intelligent, Safe & Sustainable Mobility.</p>
      </footer>
    </main>
  );
}