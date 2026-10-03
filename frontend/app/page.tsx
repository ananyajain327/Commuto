"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8f5] text-stone-900 transition-colors duration-200 dark:bg-[#12100e] dark:text-stone-100">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#faf8f5]/85 backdrop-blur-md dark:border-stone-800/80 dark:bg-[#12100e]/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-700 font-black text-lg text-white shadow-md shadow-amber-900/20 dark:bg-amber-600">
              C
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-stone-900 dark:text-white">
                Commuto
              </span>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400">
                Smart Mobility
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-xs font-bold text-stone-600 dark:text-stone-300 md:flex">
            <a
              href="#how-it-works"
              className="transition hover:text-amber-700 dark:hover:text-amber-400"
            >
              How it works
            </a>
            <a
              href="#features"
              className="transition hover:text-amber-700 dark:hover:text-amber-400"
            >
              Why Commuto
            </a>
            <a
              href="#safety"
              className="transition hover:text-amber-700 dark:hover:text-amber-400"
            >
              Safety Standards
            </a>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl px-3.5 py-2 text-xs font-bold text-stone-700 transition hover:bg-stone-200/60 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-amber-900/20 transition hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100/60 px-4 py-1.5 text-xs font-bold text-amber-900 shadow-2xs dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Student & Workplace Carpooling
          </div>

          <h1 className="text-4xl font-black tracking-tight text-stone-900 dark:text-white sm:text-6xl sm:leading-[1.12]">
            Share the ride.
            <br />
            <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-emerald-600 bg-clip-text text-transparent dark:from-amber-400 dark:via-amber-300 dark:to-emerald-400">
              Split the fuel cost.
            </span>
            <br />
            Travel safer together.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-stone-600 dark:text-stone-300 sm:text-base">
            Commuto connects everyday commuters heading in the same direction.
            Cut daily travel expenses, reduce highway congestion, and ride with
            verified community members.
          </p>

          {/* SINGLE CLEAN CTA */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-2xl bg-amber-700 px-8 py-4 text-sm font-extrabold text-white shadow-lg shadow-amber-900/25 transition hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-500 active:scale-95 cursor-pointer"
            >
              <span>Get Started — Create Account</span>
              <span>→</span>
            </Link>

            <a
              href="#how-it-works"
              className="flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-6 py-4 text-sm font-bold text-stone-700 shadow-2xs transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800"
            >
              <span>How it works</span>
              <span>↓</span>
            </a>
          </div>

          {/* TRUST BADGES */}
          <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-2xl border border-stone-200/80 bg-white p-4.5 text-center dark:border-stone-800 dark:bg-stone-900/60 shadow-2xs">
              <p className="text-xl font-black text-amber-700 dark:text-amber-400">100%</p>
              <p className="mt-1 text-xs font-bold text-stone-600 dark:text-stone-400">Verified Profiles</p>
            </div>
            <div className="rounded-2xl border border-stone-200/80 bg-white p-4.5 text-center dark:border-stone-800 dark:bg-stone-900/60 shadow-2xs">
              <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">₹0</p>
              <p className="mt-1 text-xs font-bold text-stone-600 dark:text-stone-400">Commission Fee</p>
            </div>
            <div className="rounded-2xl border border-stone-200/80 bg-white p-4.5 text-center dark:border-stone-800 dark:bg-stone-900/60 shadow-2xs">
              <p className="text-xl font-black text-amber-700 dark:text-amber-400">Live</p>
              <p className="mt-1 text-xs font-bold text-stone-600 dark:text-stone-400">GPS & SOS Shield</p>
            </div>
            <div className="rounded-2xl border border-stone-200/80 bg-white p-4.5 text-center dark:border-stone-800 dark:bg-stone-900/60 shadow-2xs">
              <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">👩 Safe</p>
              <p className="mt-1 text-xs font-bold text-stone-600 dark:text-stone-400">Women-Only Option</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-stone-200/80 bg-white py-16 dark:border-stone-800/80 dark:bg-stone-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              Simple & Transparent
            </p>
            <h2 className="mt-2 text-3xl font-black text-stone-900 dark:text-white sm:text-4xl">
              How Commuto works
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Whether you are driving your daily route or looking for an affordable seat, getting started takes under two minutes.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="relative rounded-3xl border border-stone-200 bg-stone-50/60 p-6 dark:border-stone-800 dark:bg-stone-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-700 font-black text-xl text-white shadow-md shadow-amber-900/20 dark:bg-amber-600">
                1
              </div>
              <h3 className="mt-5 text-base font-extrabold text-stone-900 dark:text-white">
                Create Account or Log In
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                Sign up with your verified details. Choose whether you want to ride as a passenger or offer carpools as a driver.
              </p>
            </div>

            <div className="relative rounded-3xl border border-stone-200 bg-stone-50/60 p-6 dark:border-stone-800 dark:bg-stone-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-700 font-black text-xl text-white shadow-md shadow-amber-900/20 dark:bg-amber-600">
                2
              </div>
              <h3 className="mt-5 text-base font-extrabold text-stone-900 dark:text-white">
                Match & Request Instantly
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                Search available rides or publish your seats. Requests are confirmed instantly with verified ratings and vehicle details.
              </p>
            </div>

            <div className="relative rounded-3xl border border-stone-200 bg-stone-50/60 p-6 dark:border-stone-800 dark:bg-stone-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 font-black text-xl text-white shadow-md shadow-emerald-900/20 dark:bg-emerald-600">
                3
              </div>
              <h3 className="mt-5 text-base font-extrabold text-stone-900 dark:text-white">
                Ride, Track & Split Fare
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
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
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
              Features
            </p>
            <h2 className="mt-2 text-3xl font-black text-stone-900 dark:text-white sm:text-4xl">
              Built for everyday dependability
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-2xs">
              <span className="text-2xl">⚡</span>
              <h3 className="mt-4 text-sm font-extrabold text-stone-900 dark:text-white">Real-Time GPS Tracking</h3>
              <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
                Passengers can monitor the driver’s location in real-time before and during the trip.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-2xs">
              <span className="text-2xl">👩</span>
              <h3 className="mt-4 text-sm font-extrabold text-stone-900 dark:text-white">Women-Only Pooling</h3>
              <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
                Filter rides by women-only to ensure comfortable, safe journeys for female riders and drivers.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-2xs">
              <span className="text-2xl">🛡️</span>
              <h3 className="mt-4 text-sm font-extrabold text-stone-900 dark:text-white">One-Touch Emergency SOS</h3>
              <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
                Instant safety alert dispatch with emergency contact notifications and location logs.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-slate-800 dark:bg-stone-900 shadow-2xs">
              <span className="text-2xl">💰</span>
              <h3 className="mt-4 text-sm font-extrabold text-stone-900 dark:text-white">Fair Cost Sharing</h3>
              <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
                Fixed, algorithm-assisted per-seat pricing that covers fuel without commercial surging.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-2xs">
              <span className="text-2xl">💬</span>
              <h3 className="mt-4 text-sm font-extrabold text-stone-900 dark:text-white">In-App Ride Chat</h3>
              <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
                Coordinate pickup spots directly within the platform without sharing private phone numbers.
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-2xs">
              <span className="text-2xl">⭐</span>
              <h3 className="mt-4 text-sm font-extrabold text-stone-900 dark:text-white">Mutual Community Ratings</h3>
              <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
                Two-way ratings ensure accountability, punctuality, and courteous behavior across all trips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY STANDARDS */}
      <section id="safety" className="border-t border-stone-200/80 bg-white py-16 dark:border-stone-800/80 dark:bg-stone-900/40">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
            Safety Standards
          </p>
          <h2 className="mt-2 text-3xl font-black text-stone-900 dark:text-white">
            Trust & Community Protection
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Every commuter undergoes profile & ID verification. With integrated SOS alerts and live ride tracking, your safety is guaranteed on every journey.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 bg-[#faf8f5] py-8 text-center text-xs text-stone-500 dark:border-stone-800 dark:bg-[#12100e] dark:text-stone-400">
        <p>© 2026 Commuto. Intelligent, Safe & Sustainable Mobility.</p>
      </footer>
    </main>
  );
}