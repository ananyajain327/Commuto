"use client";

import { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"find" | "offer">("find");

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#172033]">
      {/* NAVBAR */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#172033] text-xl text-white shadow-lg">
            🚗
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Commuto</h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Smart Mobility
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#how-it-works" className="transition hover:text-[#172033]">
            How it works
          </a>
          <a href="#features" className="transition hover:text-[#172033]">
            Features
          </a>
          <a href="#safety" className="transition hover:text-[#172033]">
            Safety
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden px-4 py-2 text-sm font-semibold text-slate-700 sm:block">
            Log in
          </button>

          <button className="rounded-full bg-[#172033] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-xl">
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            The smarter way to share a ride
          </div>

          <h2 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Share the ride.
            <br />
            <span className="text-[#5b5ce2]">Split the fare.</span>
            <br />
            Travel smarter.
          </h2>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-500">
            Find people going your way, share the journey and pay only your
            fair share. Commuto makes everyday travel affordable, intelligent
            and safer.
          </p>

          {/* SEARCH CARD */}
          <div className="mt-9 rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_20px_60px_rgba(23,32,51,0.10)]">
            <div className="flex gap-2 rounded-2xl bg-slate-100 p-1">
              <button
                onClick={() => setActiveTab("find")}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  activeTab === "find"
                    ? "bg-white text-[#172033] shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Find a ride
              </button>

              <button
                onClick={() => setActiveTab("offer")}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  activeTab === "offer"
                    ? "bg-white text-[#172033] shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Offer a ride
              </button>
            </div>

            <div className="grid gap-3 p-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  From
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="text-lg">📍</span>
                  <input
                    type="text"
                    placeholder="Your pickup location"
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 md:flex">
                →
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  To
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4">
                  <span className="text-lg">🎯</span>
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-3 px-3 pb-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3.5">
                <span>📅</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Date
                  </p>
                  <p className="text-sm font-semibold">Today</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3.5">
                <span>👥</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Passengers
                  </p>
                  <p className="text-sm font-semibold">1 passenger</p>
                </div>
              </div>
            </div>

            <button className="w-full rounded-2xl bg-[#5b5ce2] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#4d4ecf] hover:shadow-xl">
              {activeTab === "find" ? "Find matching rides →" : "Create your ride →"}
            </button>
          </div>

          {/* TRUST */}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-400">
            <span>✓ Verified drivers</span>
            <span>✓ Fair fare splitting</span>
            <span>✓ SOS protection</span>
          </div>
        </div>

        {/* MAP VISUAL */}
        <div className="relative">
          <div className="relative h-[560px] overflow-hidden rounded-[40px] bg-[#e8edf3] shadow-[0_30px_80px_rgba(23,32,51,0.15)]">
            {/* Map grid */}
            <div className="absolute inset-0 opacity-50">
              <div className="absolute left-[12%] top-[-10%] h-[130%] w-16 rotate-[18deg] bg-white" />
              <div className="absolute left-[38%] top-[-10%] h-[130%] w-24 rotate-[-28deg] bg-white" />
              <div className="absolute right-[15%] top-[-10%] h-[130%] w-20 rotate-[22deg] bg-white" />
              <div className="absolute left-[-10%] top-[30%] h-20 w-[130%] rotate-[8deg] bg-white" />
              <div className="absolute left-[-10%] top-[67%] h-16 w-[130%] rotate-[-12deg] bg-white" />
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
                stroke="#5b5ce2"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="12 10"
              />
            </svg>

            {/* Pickup */}
            <div className="absolute bottom-[17%] left-[11%]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#5b5ce2] text-xl shadow-xl">
                📍
              </div>
            </div>

            {/* Destination */}
            <div className="absolute right-[12%] top-[20%]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#172033] text-xl shadow-xl">
                🎯
              </div>
            </div>

            {/* Driver marker */}
            <div className="absolute left-[45%] top-[49%]">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-white text-2xl shadow-xl">
                🚗
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
              </div>
            </div>

            {/* Floating route card */}
            <div className="absolute left-5 top-5 rounded-3xl border border-white/70 bg-white/90 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  🧠
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Smart Match
                  </p>
                  <p className="text-lg font-black">94% compatible</p>
                </div>
              </div>
            </div>

            {/* ETA card */}
            <div className="absolute bottom-5 right-5 rounded-3xl bg-[#172033] p-5 text-white shadow-2xl">
              <p className="text-xs font-semibold text-slate-400">
                Driver arriving in
              </p>
              <p className="mt-1 text-3xl font-black">8 min</p>
              <p className="mt-1 text-xs text-slate-400">1.8 km away</p>
            </div>

            {/* Map label */}
            <div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 px-4 py-3 text-xs font-bold text-slate-600 shadow-lg backdrop-blur">
              📍 Live route preview
            </div>
          </div>

          {/* Decorative circle */}
          <div className="absolute -bottom-8 -right-8 -z-10 h-40 w-40 rounded-full bg-indigo-100 blur-2xl" />
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 py-8 sm:grid-cols-4 lg:px-8">
          {[
            ["Smart", "Ride matching"],
            ["Fair", "Dynamic fares"],
            ["Live", "Location tracking"],
            ["Safe", "Verified community"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="border-slate-200 px-4 py-3 text-center first:border-0 sm:border-l"
            >
              <p className="text-2xl font-black">{number}</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5b5ce2]">
            Built differently
          </p>

          <h3 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            More than just a ride.
          </h3>

          <p className="mt-5 leading-7 text-slate-500">
            Commuto combines intelligent matching, fair pricing and safety
            features into one seamless mobility experience.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
              title: "Live Tracking",
              text: "Follow your driver's location and get continuously updated arrival estimates.",
            },
            {
              icon: "🛡️",
              title: "Verified Drivers",
              text: "Driver identity and vehicle documents can be verified before they offer rides.",
            },
            {
              icon: "👩",
              title: "Women-Only Preference",
              text: "Choose women-only rides for an additional layer of comfort and safety.",
            },
            {
              icon: "🚨",
              title: "SOS Protection",
              text: "Quickly access emergency contacts and trip information during an active ride.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-[28px] border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl transition group-hover:bg-indigo-50">
                {feature.icon}
              </div>

              <h4 className="mt-6 text-xl font-extrabold">{feature.title}</h4>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="bg-[#172033] px-6 py-24 text-white lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-300">
              Simple by design
            </p>

            <h3 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Your journey in four steps.
            </h3>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {[
              ["01", "Search", "Enter where you're going and when."],
              ["02", "Match", "Commuto finds compatible routes."],
              ["03", "Share", "Join the ride and split the cost."],
              ["04", "Save", "Travel smarter and spend less."],
            ].map(([number, title, text]) => (
              <div
                key={number}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <span className="text-sm font-bold text-indigo-300">
                  {number}
                </span>

                <h4 className="mt-8 text-xl font-bold">{title}</h4>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section id="safety" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#5b5ce2]">
              Safety first
            </p>

            <h3 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Designed for safer journeys.
            </h3>

            <p className="mt-6 max-w-xl leading-7 text-slate-500">
              From verified drivers to emergency support, Commuto puts safety
              directly into the ride experience.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Verified driver profiles",
                "Women-only ride preference",
                "Emergency contacts",
                "One-tap SOS during active rides",
                "Trip and location sharing",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-sm text-emerald-600">
                    ✓
                  </span>

                  <span className="text-sm font-semibold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[36px] bg-gradient-to-br from-indigo-500 to-purple-600 p-8 shadow-2xl">
            <div className="rounded-[28px] bg-white p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Safety Center
                  </p>
                  <h4 className="mt-2 text-2xl font-black">You're protected</h4>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-xl">
                  🛡️
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-bold text-slate-400">ACTIVE RIDE</p>
                <p className="mt-2 font-bold">Jaipur → Ajmer</p>
                <p className="mt-1 text-sm text-slate-500">
                  Trip sharing is active
                </p>
              </div>

              <button className="mt-5 w-full rounded-2xl bg-red-50 py-4 text-sm font-extrabold text-red-600 transition hover:bg-red-100">
                🚨 Emergency / SOS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[#5b5ce2] px-8 py-16 text-center text-white shadow-2xl sm:px-16">
          <h3 className="text-4xl font-black tracking-tight sm:text-5xl">
            Ready to commute smarter?
          </h3>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-indigo-100">
            Find your route, meet your match and make every journey count.
          </p>

          <button className="mt-8 rounded-full bg-white px-8 py-4 text-sm font-extrabold text-[#172033] shadow-xl transition hover:-translate-y-1">
            Start with Commuto →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#172033] text-sm">
              🚗
            </div>
            <span className="font-extrabold">Commuto</span>
          </div>

          <p className="text-xs font-medium text-slate-400">
            Share the Ride. Split the Fare. Travel Smarter.
          </p>

          <p className="text-xs text-slate-400">
            © 2026 Commuto
          </p>
        </div>
      </footer>
    </main>
  );
}