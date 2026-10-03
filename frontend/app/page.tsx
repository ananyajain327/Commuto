"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"find" | "offer">("find");
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* NAVBAR */}
      <nav className="border-b border-slate-200/80 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-lg shadow-md shadow-indigo-500/20">
              C
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Commuto</h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Smart Mobility
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-xs font-bold text-slate-600 dark:text-slate-300 md:flex">
            <a href="#how-it-works" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              How it works
            </a>
            <a href="#features" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              Features
            </a>
            <a href="#safety" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              Safety
            </a>
            <Link href="/rides/search" className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
              Find Rides
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-16">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            The smarter way to share a ride
          </div>

          <h2 className="max-w-3xl text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-slate-900 dark:text-white">
            Share the ride.
            <br />
            <span className="text-indigo-600 dark:text-indigo-400">Split the fare.</span>
            <br />
            Travel smarter.
          </h2>

          <p className="mt-4 max-w-xl text-xs sm:text-sm sm:leading-relaxed text-slate-500 dark:text-slate-400">
            Find people going your way, share the journey and pay only your
            fair share. Commuto makes everyday travel affordable, intelligent
            and safer with verified co-travelers.
          </p>

          {/* SEARCH CARD */}
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex gap-1.5 rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("find")}
                className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === "find"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Find a ride
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("offer")}
                className={`flex-1 rounded-xl px-3 py-2.5 text-xs font-bold transition cursor-pointer ${
                  activeTab === "offer"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Offer a ride
              </button>
            </div>

            <div className="grid gap-2.5 p-2.5 md:grid-cols-[1fr_auto_1fr] md:items-end">
              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  From (Pickup)
                </label>

                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                  <span className="text-base">📍</span>
                  <input
                    type="text"
                    value={fromLoc}
                    onChange={(e) => setFromLoc(e.target.value)}
                    placeholder="Your pickup point"
                    className="w-full bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                </div>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-800 md:flex">
                →
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  To (Destination)
                </label>

                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                  <span className="text-base">🎯</span>
                  <input
                    type="text"
                    value={toLoc}
                    onChange={(e) => setToLoc(e.target.value)}
                    placeholder="Where are you going?"
                    className="w-full bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="p-2.5 pt-0">
              {activeTab === "find" ? (
                <Link
                  href={`/rides/search?from=${encodeURIComponent(fromLoc)}&to=${encodeURIComponent(toLoc)}`}
                  className="block w-full rounded-xl bg-indigo-600 py-3 text-center text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700"
                >
                  Find matching rides →
                </Link>
              ) : (
                <Link
                  href="/driver/dashboard"
                  className="block w-full rounded-xl bg-indigo-600 py-3 text-center text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700"
                >
                  Publish & Offer a ride →
                </Link>
              )}
            </div>
          </div>

          {/* TRUST */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>✓ Verified drivers</span>
            <span>✓ Fair fare splitting</span>
            <span>✓ SOS emergency alert</span>
          </div>
        </div>

        {/* MAP VISUAL */}
        <div className="relative">
          <div className="relative h-96 sm:h-[480px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 shadow-xl">
            {/* Map grid */}
            <div className="absolute inset-0 opacity-40 dark:opacity-20">
              <div className="absolute left-[12%] top-[-10%] h-[130%] w-16 rotate-[18deg] bg-indigo-200 dark:bg-indigo-800" />
              <div className="absolute left-[38%] top-[-10%] h-[130%] w-24 rotate-[-28deg] bg-indigo-200 dark:bg-indigo-800" />
              <div className="absolute right-[15%] top-[-10%] h-[130%] w-20 rotate-[22deg] bg-indigo-200 dark:bg-indigo-800" />
            </div>

            {/* Route */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 500 600"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M70 470 C150 410, 150 330, 235 350 C315 370, 300 240, 425 150"
                stroke="#6366f1"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="10 8"
              />
            </svg>

            {/* Pickup */}
            <div className="absolute bottom-[17%] left-[11%]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-base shadow-xl">
                📍
              </div>
            </div>

            {/* Destination */}
            <div className="absolute right-[12%] top-[20%]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-base shadow-xl dark:bg-slate-800">
                🎯
              </div>
            </div>

            {/* Driver marker */}
            <div className="absolute left-[45%] top-[49%]">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white text-xl shadow-xl dark:bg-slate-800">
                🚗
                <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
              </div>
            </div>

            {/* Floating route card */}
            <div className="absolute left-4 top-4 rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  🧠
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Smart Match
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">94% compatible</p>
                </div>
              </div>
            </div>

            {/* ETA card */}
            <div className="absolute bottom-4 right-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-white shadow-2xl">
              <p className="text-[10px] font-semibold text-slate-400">
                Driver arriving in
              </p>
              <p className="text-2xl font-black">8 min</p>
              <p className="text-[10px] text-slate-400">1.8 km away · Live GPS</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 py-6 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            ["Smart", "Ride matching"],
            ["Fair", "Dynamic fares"],
            ["Live", "GPS tracking"],
            ["Safe", "Verified community"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="border-slate-200 px-3 py-2 text-center first:border-0 sm:border-l dark:border-slate-800"
            >
              <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{number}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Built differently
          </p>

          <h3 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            More than just a ride.
          </h3>

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Commuto combines intelligent matching, fair pricing and safety
            features into one seamless mobility experience.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "🧠",
              title: "Smart Ride Matching",
              text: "Find rides based on route similarity, pickup proximity, timing and preferences.",
            },
            {
              icon: "💰",
              title: "Fair Fare Splitting",
              text: "Pay according to the distance you actually travel instead of an arbitrary equal split.",
            },
            {
              icon: "📍",
              title: "Live GPS Tracking",
              text: "Follow your driver's real-time location and get continuously updated arrival estimates.",
            },
            {
              icon: "🛡️",
              title: "Verified Drivers",
              text: "Driver identity and vehicle documents are reviewed and verified before rides.",
            },
            {
              icon: "👩",
              title: "Women-Only Preference",
              text: "Choose women-only rides for an additional layer of comfort and safety.",
            },
            {
              icon: "🚨",
              title: "SOS Protection",
              text: "Quickly alert emergency contacts and share trip data during active rides.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-200 bg-white p-5 transition dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-xl dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {feature.icon}
              </div>

              <h4 className="mt-4 text-base font-bold text-slate-900 dark:text-white">{feature.title}</h4>

              <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="bg-slate-900 px-4 py-16 text-white sm:px-6 lg:px-8 border-y border-slate-800"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
              Simple by design
            </p>

            <h3 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight">
              Your journey in four steps.
            </h3>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              ["01", "Search", "Enter where you're going and when."],
              ["02", "Match", "Commuto finds compatible routes."],
              ["03", "Share", "Join the ride and split the cost."],
              ["04", "Save", "Travel smarter and spend less."],
            ].map(([number, title, text]) => (
              <div
                key={number}
                className="rounded-2xl border border-slate-800 bg-slate-800/60 p-5"
              >
                <span className="text-xs font-bold text-indigo-400">
                  {number}
                </span>

                <h4 className="mt-3 text-base font-bold">{title}</h4>

                <p className="mt-1 text-xs text-slate-400">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-4 py-8 dark:border-slate-800 dark:bg-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white text-xs">
              C
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">Commuto</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Share the Ride. Split the Fare. Travel Smarter.
          </p>

          <p className="text-xs text-slate-400">
            © 2026 Commuto · All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}