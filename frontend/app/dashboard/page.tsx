"use client";

import Link from "next/link";

const quickActions = [
  {
    icon: "🔍",
    title: "Find a ride",
    description: "Find someone going your way",
    href: "/rides/search",
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
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#172033]">

      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-7 py-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#172033] text-xl shadow-lg">
            🚗
          </div>

          <div>
            <p className="text-xl font-black tracking-tight">Commuto</p>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Smart Mobility
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="mt-5 flex-1 px-4">

          <p className="px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Main menu
          </p>

          <SidebarItem icon="⌂" label="Overview" active />
          <SidebarItem icon="⌕" label="Find a Ride" />
          <SidebarItem icon="🚗" label="Offer a Ride" />
          <SidebarItem icon="▣" label="My Rides" />

          <p className="mt-8 px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Personal
          </p>

          <SidebarItem icon="💳" label="Wallet" />
          <SidebarItem icon="🛡️" label="Safety Center" />
          <SidebarItem icon="★" label="Ratings" />
          <SidebarItem icon="⚙" label="Settings" />
        </nav>

        {/* Safety card */}
        <div className="m-4 rounded-3xl bg-[#172033] p-5 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            🛡️
          </div>

          <p className="mt-4 text-sm font-bold">Stay safe</p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Your safety tools are always available during a ride.
          </p>

          <Link
            href="/safety"
            className="mt-4 block text-xs font-bold text-indigo-300"
          >
            Open Safety Center →
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="lg:ml-64">

        {/* TOP BAR */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl lg:px-8">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold text-slate-400">
                Dashboard
              </p>

              <p className="mt-1 text-sm font-bold text-slate-700">
                Wednesday, 9 September 2026
              </p>
            </div>

            <div className="flex items-center gap-3">

              {/* Notification */}
              <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-lg transition hover:bg-slate-50">
                🔔

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#5b5ce2] ring-2 ring-white" />
              </button>

              {/* Profile */}
              <button className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-2 pr-4 transition hover:bg-slate-50">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-bold text-[#5b5ce2]">
                  A
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-xs font-extrabold">Ananya Jain</p>
                  <p className="text-[10px] text-slate-400">
                    Passenger
                  </p>
                </div>

                <span className="text-xs text-slate-400">⌄</span>
              </button>
            </div>
          </div>
        </header>

        <div className="px-6 py-8 lg:px-8">

          {/* WELCOME */}
          <section className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5b5ce2]">
                Good evening
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
                Where are you going?
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Find a compatible ride, share your journey and travel smarter
                with Commuto.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <span className="text-xs font-bold text-emerald-700">
                Account verified
              </span>
            </div>
          </section>

          {/* SEARCH CARD */}
          <section className="mt-8 rounded-[30px] bg-[#172033] p-5 shadow-[0_25px_60px_rgba(23,32,51,0.15)] sm:p-7">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">
                  Smart ride search
                </p>

                <h2 className="mt-2 text-xl font-black text-white">
                  Find your next ride
                </h2>
              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl sm:flex">
                🧠
              </div>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_1fr_160px]">

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  From
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <span>📍</span>

                  <input
                    type="text"
                    placeholder="Pickup location"
                    className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  To
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <span>🎯</span>

                  <input
                    type="text"
                    placeholder="Destination"
                    className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <button className="rounded-2xl bg-[#5b5ce2] px-5 py-4 text-sm font-extrabold text-white transition hover:bg-[#4d4ecf]">
                Find rides →
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">

              <div className="rounded-xl bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300">
                📅 Today
              </div>

              <div className="rounded-xl bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300">
                👤 1 passenger
              </div>

              <div className="rounded-xl bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300">
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

                <h2 className="mt-2 text-2xl font-black">
                  Everything you need
                </h2>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-[24px] border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl transition group-hover:bg-indigo-50">
                      {action.icon}
                    </div>

                    <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#5b5ce2]">
                      →
                    </span>
                  </div>

                  <h3 className="mt-5 text-sm font-extrabold">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* UPCOMING + STATS */}
          <section className="mt-10 grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">

            {/* Upcoming ride */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-6">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Your next journey
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Upcoming ride
                  </h2>
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-extrabold text-[#5b5ce2]">
                  UPCOMING
                </span>
              </div>

              <div className="mt-6 rounded-3xl bg-[#f7f9fc] p-5">

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                      🚗
                    </div>

                    <div>
                      <p className="text-lg font-black">
                        Jaipur → Ajmer
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        Tomorrow · 8:30 AM
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400">
                      Your share
                    </p>

                    <p className="text-2xl font-black">
                      ₹280
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">

                  <span className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                    🛡️ Verified driver
                  </span>

                  <span className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                    ⭐ 4.8 rating
                  </span>

                  <span className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-500">
                    🧠 94% match
                  </span>
                </div>

                <button className="mt-5 w-full rounded-2xl bg-[#172033] py-3.5 text-xs font-extrabold text-white transition hover:bg-slate-800">
                  View ride details →
                </button>
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
          <section className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Activity
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Recent rides
                </h2>
              </div>

              <button className="text-xs font-extrabold text-[#5b5ce2]">
                View all →
              </button>
            </div>

            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[650px]">

                {recentRides.map((ride, index) => (
                  <div
                    key={`${ride.route}-${index}`}
                    className="flex items-center justify-between border-t border-slate-100 py-5"
                  >
                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                        🚗
                      </div>

                      <div>
                        <p className="text-sm font-extrabold">
                          {ride.route}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {ride.date} · {ride.time}
                        </p>
                      </div>
                    </div>

                    <div className="hidden text-center sm:block">
                      <p className="text-xs font-semibold text-slate-400">
                        Driver
                      </p>

                      <p className="mt-1 text-xs font-bold">
                        {ride.driver}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
                        ride.status === "Upcoming"
                          ? "bg-indigo-50 text-[#5b5ce2]"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {ride.status}
                    </span>

                    <p className="text-sm font-black">
                      {ride.fare}
                    </p>
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
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
        active
          ? "bg-indigo-50 text-[#5b5ce2]"
          : "text-slate-500 hover:bg-slate-50 hover:text-[#172033]"
      }`}
    >
      <span className="flex h-6 w-6 items-center justify-center text-base">
        {icon}
      </span>

      {label}
    </button>
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
    <div className="rounded-[24px] border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
          {icon}
        </div>

        <span className="text-emerald-500">↗</span>
      </div>

      <p className="mt-5 text-2xl font-black">{value}</p>

      <p className="mt-1 text-xs font-semibold text-slate-400">
        {label}
      </p>
    </div>
  );
}