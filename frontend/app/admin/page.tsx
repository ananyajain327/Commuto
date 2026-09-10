"use client";

import { useState } from "react";

const stats = [
  {
    title: "Total Users",
    value: "12,480",
    change: "+8.4%",
    icon: "👥",
  },
  {
    title: "Active Drivers",
    value: "2,184",
    change: "+5.2%",
    icon: "🚗",
  },
  {
    title: "Total Rides",
    value: "38,642",
    change: "+12.8%",
    icon: "🛣️",
  },
  {
    title: "Revenue",
    value: "₹18.6L",
    change: "+14.6%",
    icon: "💰",
  },
];

const recentRides = [
  {
    id: "RID-28491",
    passenger: "Ananya Jain",
    driver: "Rahul Sharma",
    route: "Jaipur → Ajmer",
    fare: "₹180",
    status: "Completed",
  },
  {
    id: "RID-28490",
    passenger: "Priya Mehta",
    driver: "Aman Verma",
    route: "Vaishali Nagar → C-Scheme",
    fare: "₹120",
    status: "Active",
  },
  {
    id: "RID-28489",
    passenger: "Riya Gupta",
    driver: "Karan Singh",
    route: "Mansarovar → Jagatpura",
    fare: "₹95",
    status: "Completed",
  },
  {
    id: "RID-28488",
    passenger: "Neha Sharma",
    driver: "Vivek Jain",
    route: "Malviya Nagar → Airport",
    fare: "₹210",
    status: "Cancelled",
  },
];

const complaints = [
  {
    id: "CMP-1042",
    title: "Driver arrived at wrong pickup point",
    user: "Ananya Jain",
    category: "Ride Issue",
    priority: "Medium",
  },
  {
    id: "CMP-1041",
    title: "Fare amount was different",
    user: "Riya Gupta",
    category: "Payment",
    priority: "High",
  },
  {
    id: "CMP-1040",
    title: "Vehicle details did not match",
    user: "Neha Sharma",
    category: "Safety",
    priority: "High",
  },
];

const verificationRequests = [
  {
    name: "Arjun Meena",
    vehicle: "Maruti Suzuki Swift",
    submitted: "Today",
  },
  {
    name: "Mohit Sharma",
    vehicle: "Hyundai i20",
    submitted: "Yesterday",
  },
  {
    name: "Rohit Verma",
    vehicle: "Tata Nexon",
    submitted: "2 days ago",
  },
];

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Users", icon: "👥" },
    { name: "Drivers", icon: "🚗" },
    { name: "Rides", icon: "🛣️" },
    { name: "Complaints", icon: "📋" },
    { name: "Verifications", icon: "✅" },
    { name: "Analytics", icon: "📈" },
    { name: "Reports", icon: "🚨" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-slate-100 px-6 py-6">
            <a href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
                C
              </div>

              <div>
                <p className="text-lg font-bold">Commuto</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Admin Panel
                </p>
              </div>
            </a>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeMenu === item.name
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>

          {/* Admin Profile */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                A
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  Commuto Admin
                </p>
                <p className="truncate text-xs text-slate-400">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-sm text-slate-500">Admin Control Center</p>
              <h1 className="mt-1 text-2xl font-bold">
                Good evening, Admin 👋
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50">
                🔔
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>

              <a
                href="/dashboard"
                className="hidden rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 sm:block"
              >
                User Dashboard
              </a>
            </div>
          </div>
        </header>

        <div className="space-y-8 px-6 py-8">
          {/* Overview */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold">Platform Overview</h2>
              <p className="mt-1 text-sm text-slate-500">
                Monitor Commuto&apos;s overall performance.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.title}</p>
                      <h3 className="mt-3 text-3xl font-bold">
                        {stat.value}
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                      {stat.icon}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      ↑ {stat.change}
                    </span>

                    <span className="text-xs text-slate-400">
                      vs last month
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Analytics */}
          <section className="grid gap-6 xl:grid-cols-3">
            {/* Chart */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Ride Activity</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Ride volume over the past 7 days
                  </p>
                </div>

                <select className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium outline-none">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 6 months</option>
                </select>
              </div>

              <div className="mt-8 flex h-64 items-end gap-3 border-b border-l border-slate-100 px-4 pb-0">
                {[42, 58, 48, 75, 62, 88, 96].map((height, index) => (
                  <div
                    key={index}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >
                    <div
                      style={{ height: `${height}%` }}
                      className="relative rounded-t-xl bg-slate-900 transition group-hover:bg-slate-700"
                    >
                      <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block">
                        {Math.round(height * 12.5)}
                      </span>
                    </div>

                    <span className="mt-3 text-center text-[11px] text-slate-400">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Health */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Platform Health</h2>
              <p className="mt-1 text-sm text-slate-500">
                Current system status
              </p>

              <div className="mt-7 space-y-5">
                {[
                  ["API Services", "Operational"],
                  ["Database", "Operational"],
                  ["Maps Service", "Operational"],
                  ["Notifications", "Operational"],
                  ["Payment Gateway", "Operational"],
                ].map(([service, status]) => (
                  <div
                    key={service}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{service}</span>

                    <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl bg-emerald-50 p-4">
                <p className="text-sm font-bold text-emerald-700">
                  ✓ All systems operational
                </p>

                <p className="mt-1 text-xs text-emerald-600">
                  Last checked a few seconds ago
                </p>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="mb-5 text-xl font-bold">Quick Actions</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["👥", "Manage Users", "View and manage platform users"],
                ["🚗", "Verify Drivers", "Review pending verifications"],
                ["📋", "Review Complaints", "Handle reported issues"],
                ["📈", "View Analytics", "Explore platform insights"],
              ].map(([icon, title, text]) => (
                <button
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
                    {icon}
                  </div>

                  <h3 className="mt-4 font-bold">{title}</h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {text}
                  </p>

                  <p className="mt-4 text-xs font-bold">
                    Open →
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Rides */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-lg font-bold">Recent Rides</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Latest platform activity
                </p>
              </div>

              <button className="text-sm font-semibold hover:underline">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-4">Ride ID</th>
                    <th className="px-6 py-4">Passenger</th>
                    <th className="px-6 py-4">Driver</th>
                    <th className="px-6 py-4">Route</th>
                    <th className="px-6 py-4">Fare</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentRides.map((ride) => (
                    <tr
                      key={ride.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 text-sm font-semibold">
                        {ride.id}
                      </td>

                      <td className="px-6 py-5 text-sm">{ride.passenger}</td>

                      <td className="px-6 py-5 text-sm">{ride.driver}</td>

                      <td className="px-6 py-5 text-sm text-slate-500">
                        {ride.route}
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold">
                        {ride.fare}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            ride.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : ride.status === "Active"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {ride.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom Grid */}
          <section className="grid gap-6 xl:grid-cols-2">
            {/* Complaints */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div>
                  <h2 className="font-bold">Recent Complaints</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Issues requiring admin attention
                  </p>
                </div>

                <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                  8 Pending
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          {complaint.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {complaint.id} • {complaint.user}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          complaint.priority === "High"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {complaint.priority}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {complaint.category}
                      </span>

                      <button className="text-xs font-bold hover:underline">
                        Review →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div>
                  <h2 className="font-bold">Pending Driver Verification</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Drivers waiting for document review
                  </p>
                </div>

                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                  14 Pending
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {verificationRequests.map((driver) => (
                  <div
                    key={driver.name}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-bold">
                        {driver.name.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold">{driver.name}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {driver.vehicle} • {driver.submitted}
                        </p>
                      </div>
                    </div>

                    <button className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Safety Alert */}
          <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-xl">
                  🚨
                </div>

                <div>
                  <h2 className="font-bold">Safety Monitoring</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    2 safety reports require immediate review.
                  </p>
                </div>
              </div>

              <button className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700">
                Review Safety Reports
              </button>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-200 py-6 text-center">
            <p className="text-xs text-slate-400">
              Commuto Admin Panel • Smart Mobility Management System
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}