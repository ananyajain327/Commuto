"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiUrl } from "@/lib/api";

const rideData = {
  "7 Days": [42, 58, 51, 74, 68, 91, 84],
  "30 Days": [45, 62, 55, 71, 83, 76, 94, 88, 102, 97],
  "3 Months": [320, 410, 385, 470, 520, 490, 610, 575, 680, 720],
  "1 Year": [420, 510, 480, 620, 710, 680, 790, 850, 920, 980, 1100, 1240],
};

const labels = {
  "7 Days": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  "30 Days": ["1", "4", "7", "10", "13", "16", "19", "22", "25", "30"],
  "3 Months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  "1 Year": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const routeData = [
  { route: "Jaipur → Ajmer", rides: 842, revenue: "₹2,18,420", growth: "+18.4%" },
  { route: "Jaipur → Delhi", rides: 674, revenue: "₹3,42,100", growth: "+14.2%" },
  { route: "Jaipur → Kota", rides: 528, revenue: "₹1,46,780", growth: "+11.8%" },
  { route: "Ajmer → Jaipur", rides: 461, revenue: "₹1,22,350", growth: "+9.6%" },
  { route: "Jaipur → Udaipur", rides: 384, revenue: "₹1,84,620", growth: "+8.9%" },
];

const peakHours = [
  { time: "7 AM – 9 AM", rides: 482 },
  { time: "9 AM – 11 AM", rides: 318 },
  { time: "12 PM – 2 PM", rides: 226 },
  { time: "4 PM – 6 PM", rides: 391 },
  { time: "6 PM – 8 PM", rides: 564 },
  { time: "8 PM – 10 PM", rides: 312 },
];

interface AdminOverview {
  totalUsers: number;
  totalDrivers: number;
  verifiedDrivers: number;
  activeRides: number;
  completedRides: number;
  totalRides: number;
  platformGrossFare: number;
}

export default function AdminAnalyticsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [period, setPeriod] = useState<"7 Days" | "30 Days" | "3 Months" | "1 Year">("7 Days");
  const [overview, setOverview] = useState<AdminOverview | null>(null);

  useEffect(() => {
    let isCurrent = true;
    const fetchOverview = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(apiUrl("/api/admin/overview"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok && isCurrent) {
          const data = (await res.json()) as AdminOverview;
          setOverview(data);
        }
      } catch {
        // Fall back gracefully
      }
    };

    void fetchOverview();
    return () => {
      isCurrent = false;
    };
  }, []);

  const currentData = rideData[period];
  const currentLabels = labels[period];
  const maxVal = Math.max(...currentData);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <AdminHeader
          title="Platform Analytics & Intelligence"
          subtitle="Real-time ride demand patterns, route profitability and platform expansion trends"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Analytics" }]}
        />

        <div className="space-y-6 p-6">
          {/* Period Selector */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Growth & Revenue Overview</h2>

            <div className="flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
              {(["7 Days", "30 Days", "3 Months", "1 Year"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    period === item
                      ? "bg-slate-900 text-white shadow-xs dark:bg-emerald-600"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                {overview ? overview.totalUsers : "18,642"}
              </h3>
              <p className="mt-2 text-xs text-emerald-600">↑ +12.8% vs last month</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Captains / Drivers</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                {overview ? overview.totalDrivers : "4,286"}
              </h3>
              <p className="mt-2 text-xs text-emerald-600">↑ +8.4% verified</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Rides Booked</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                {overview ? overview.totalRides : "42,890"}
              </h3>
              <p className="mt-2 text-xs text-blue-600">{overview?.activeRides || 3} currently in transit</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Gross Volume</p>
              <h3 className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {overview ? `₹${overview.platformGrossFare.toFixed(0)}` : "₹32.4L"}
              </h3>
              <p className="mt-2 text-xs text-emerald-600">↑ +18.2% platform total</p>
            </div>
          </section>

          {/* Chart Section */}
          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Ride Volume Over Time</h3>
                  <p className="text-xs text-slate-400">Trends during selected period ({period})</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                  Peak: {maxVal} rides
                </span>
              </div>

              <div className="mt-8 flex h-64 items-end gap-3 px-2">
                {currentData.map((val, idx) => {
                  const pct = Math.round((val / maxVal) * 100);
                  return (
                    <div key={idx} className="group flex h-full flex-1 flex-col justify-end">
                      <div
                        style={{ height: `${pct}%` }}
                        className="relative rounded-t-xl bg-slate-900 transition group-hover:bg-emerald-600 dark:bg-emerald-600 dark:group-hover:bg-emerald-500"
                      >
                        <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-md bg-slate-900 px-1.5 py-0.5 text-[10px] text-white group-hover:block">
                          {val}
                        </span>
                      </div>
                      <span className="mt-3 text-center text-[10px] text-slate-400">
                        {currentLabels[idx] || ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Peak Hours */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-bold text-slate-900 dark:text-white">Peak Ride Hours</h3>
              <p className="text-xs text-slate-400">Daily peak travel demand</p>

              <div className="mt-6 space-y-4">
                {peakHours.map((slot) => {
                  const pct = Math.round((slot.rides / 600) * 100);
                  return (
                    <div key={slot.time}>
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-700 dark:text-slate-300">{slot.time}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{slot.rides} trips</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-2 rounded-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Popular Routes */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-6 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white">Top High-Traffic Corridors</h3>
              <p className="text-xs text-slate-400">Highest volume and most revenue-generating intercity routes</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="px-6 py-4">Corridor / Route</th>
                    <th className="px-6 py-4">Completed Rides</th>
                    <th className="px-6 py-4">Gross Revenue</th>
                    <th className="px-6 py-4">Growth</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {routeData.map((item) => (
                    <tr key={item.route} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{item.route}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{item.rides} rides</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">{item.revenue}</td>
                      <td className="px-6 py-4 text-xs font-bold text-emerald-600">{item.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}