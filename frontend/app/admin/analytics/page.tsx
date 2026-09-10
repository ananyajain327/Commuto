"use client";

import { useState } from "react";
import Link from "next/link";

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
  {
    route: "Jaipur → Ajmer",
    rides: 842,
    revenue: "₹2,18,420",
    growth: "+18.4%",
  },
  {
    route: "Jaipur → Delhi",
    rides: 674,
    revenue: "₹3,42,100",
    growth: "+14.2%",
  },
  {
    route: "Jaipur → Kota",
    rides: 528,
    revenue: "₹1,46,780",
    growth: "+11.8%",
  },
  {
    route: "Ajmer → Jaipur",
    rides: 461,
    revenue: "₹1,22,350",
    growth: "+9.6%",
  },
  {
    route: "Jaipur → Udaipur",
    rides: 384,
    revenue: "₹1,84,620",
    growth: "+8.9%",
  },
];

const peakHours = [
  { time: "7 AM – 9 AM", rides: 482 },
  { time: "9 AM – 11 AM", rides: 318 },
  { time: "12 PM – 2 PM", rides: 226 },
  { time: "4 PM – 6 PM", rides: 391 },
  { time: "6 PM – 8 PM", rides: 564 },
  { time: "8 PM – 10 PM", rides: 312 },
];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] =
    useState<keyof typeof rideData>("7 Days");

  const currentRideData = rideData[period];
  const currentLabels = labels[period];

  const maxRide = Math.max(...currentRideData);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              C
            </div>

            <div>
              <h1 className="text-lg font-bold">Commuto</h1>
              <p className="text-xs text-slate-500">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            <AdminLink href="/admin" icon="📊" text="Overview" />
            <AdminLink href="/admin/users" icon="👥" text="Users" />
            <AdminLink href="/admin/drivers" icon="🚗" text="Drivers" />
            <AdminLink
              href="/admin/verifications"
              icon="✓"
              text="Verifications"
            />
            <AdminLink href="/admin/rides" icon="🛣️" text="Rides" />
            <AdminLink
              href="/admin/complaints"
              icon="⚠️"
              text="Complaints"
            />
            <AdminLink
              href="/admin/fraud"
              icon="🛡️"
              text="Fraud & Risk"
            />

            <Link
              href="/admin/analytics"
              className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700"
            >
              <span>📈</span>
              Analytics
            </Link>

            <AdminLink href="/admin/settings" icon="⚙️" text="Settings" />
          </nav>

          {/* Admin */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                A
              </div>

              <div>
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-sm text-slate-500">Platform Intelligence</p>
            <h2 className="text-xl font-bold">Analytics Dashboard</h2>
          </div>

          {/* Period Filter */}
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(["7 Days", "30 Days", "3 Months", "1 Year"] as const).map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    period === item
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </header>

        <div className="space-y-6 p-6">
          {/* KPI Cards */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total Users"
              value="18,642"
              change="+12.8%"
              icon="👥"
              description="vs previous period"
            />

            <MetricCard
              title="Total Drivers"
              value="4,286"
              change="+8.4%"
              icon="🚗"
              description="verified drivers"
            />

            <MetricCard
              title="Total Rides"
              value="26,481"
              change="+18.6%"
              icon="🛣️"
              description="all platform rides"
            />

            <MetricCard
              title="Total Revenue"
              value="₹78.42L"
              change="+21.4%"
              icon="💰"
              description="platform revenue"
            />
          </section>

          {/* Ride Analytics + Completion */}
          <section className="grid gap-6 xl:grid-cols-3">
            {/* Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h3 className="font-bold">Ride Activity</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Number of rides during the selected period
                  </p>
                </div>

                <div className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
                  {period}
                </div>
              </div>

              {/* Bar Chart */}
              <div className="flex h-72 items-end gap-3 border-b border-l border-slate-200 px-4 pb-2">
                {currentRideData.map((value, index) => {
                  const height = (value / maxRide) * 90;

                  return (
                    <div
                      key={index}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-[10px] font-semibold text-slate-500">
                        {value}
                      </span>

                      <div
                        className="w-full max-w-10 rounded-t-lg bg-indigo-500 transition-all duration-500 hover:bg-indigo-600"
                        style={{
                          height: `${height}%`,
                        }}
                      />

                      <span className="text-[10px] text-slate-400">
                        {currentLabels[index]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Completion */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold">Ride Completion</h3>
              <p className="mt-1 text-sm text-slate-500">
                Platform ride status
              </p>

              <div className="mt-8 flex justify-center">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-[18px] border-emerald-100">
                  <div className="absolute inset-[-18px] rounded-full border-[18px] border-transparent border-t-emerald-500 border-r-emerald-500 border-b-emerald-500" />

                  <div className="text-center">
                    <p className="text-4xl font-bold">91%</p>
                    <p className="text-xs text-slate-500">Completion</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <StatusRow
                  label="Completed"
                  value="24,096"
                  percentage="91%"
                  type="success"
                />

                <StatusRow
                  label="Cancelled"
                  value="1,426"
                  percentage="5.4%"
                  type="danger"
                />

                <StatusRow
                  label="Active"
                  value="284"
                  percentage="1.1%"
                  type="warning"
                />

                <StatusRow
                  label="Upcoming"
                  value="675"
                  percentage="2.5%"
                  type="info"
                />
              </div>
            </div>
          </section>

          {/* Revenue Analytics */}
          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="mb-6">
                <h3 className="font-bold">Revenue Analytics</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Platform financial performance
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <RevenueCard
                  title="Gross Fare"
                  value="₹86.14L"
                  change="+19.8%"
                  icon="💵"
                />

                <RevenueCard
                  title="Platform Earnings"
                  value="₹7.72L"
                  change="+21.4%"
                  icon="📈"
                />

                <RevenueCard
                  title="Average Fare"
                  value="₹325"
                  change="+4.7%"
                  icon="₹"
                />
              </div>

              {/* Revenue visual */}
              <div className="mt-8">
                <div className="mb-3 flex justify-between text-xs text-slate-500">
                  <span>Revenue Growth</span>
                  <span className="font-semibold text-emerald-600">
                    +21.4%
                  </span>
                </div>

                <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: "78%" }}
                  />
                </div>

                <div className="mt-3 flex justify-between text-xs text-slate-400">
                  <span>Previous: ₹64.62L</span>
                  <span>Current: ₹78.42L</span>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold">Revenue Breakdown</h3>
              <p className="mt-1 text-sm text-slate-500">
                By ride type
              </p>

              <div className="mt-6 space-y-5">
                <ProgressRow
                  label="Shared Rides"
                  value="54%"
                  width="54%"
                />

                <ProgressRow
                  label="Standard Rides"
                  value="29%"
                  width="29%"
                />

                <ProgressRow
                  label="Women-only"
                  value="11%"
                  width="11%"
                />

                <ProgressRow
                  label="Other"
                  value="6%"
                  width="6%"
                />
              </div>
            </div>
          </section>

          {/* Growth */}
          <section className="grid gap-6 md:grid-cols-2">
            {/* User Growth */}
            <GrowthCard
              title="User Growth"
              subtitle="Passenger registrations"
              current="18,642"
              previous="16,526"
              percentage="+12.8%"
              icon="👥"
            />

            {/* Driver Growth */}
            <GrowthCard
              title="Driver Growth"
              subtitle="Verified driver registrations"
              current="4,286"
              previous="3,953"
              percentage="+8.4%"
              icon="🚗"
            />
          </section>

          {/* Popular Routes */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold">Popular Routes</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Most frequently used routes
                </p>
              </div>

              <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
                Top 5
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                    <th className="pb-4">Route</th>
                    <th className="pb-4">Rides</th>
                    <th className="pb-4">Revenue</th>
                    <th className="pb-4">Growth</th>
                  </tr>
                </thead>

                <tbody>
                  {routeData.map((item, index) => (
                    <tr
                      key={item.route}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                            {index + 1}
                          </div>
                          <span className="font-semibold">
                            {item.route}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 text-sm text-slate-600">
                        {item.rides}
                      </td>

                      <td className="py-4 text-sm font-semibold">
                        {item.revenue}
                      </td>

                      <td className="py-4">
                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                          {item.growth}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Peak Hours */}
          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="font-bold">Peak Hours</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Ride demand throughout the day
                </p>
              </div>

              <div className="space-y-5">
                {peakHours.map((item) => {
                  const width = (item.rides / 600) * 100;

                  return (
                    <div key={item.time}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium">{item.time}</span>
                        <span className="font-semibold text-slate-600">
                          {item.rides} rides
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Safety Analytics */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="font-bold">Safety & Risk Analytics</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Platform safety overview
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SafetyMetric
                  label="Complaints"
                  value="184"
                  icon="⚠️"
                  description="-8.2%"
                />

                <SafetyMetric
                  label="Safety Cases"
                  value="32"
                  icon="🚨"
                  description="-12.4%"
                />

                <SafetyMetric
                  label="Fraud Flags"
                  value="76"
                  icon="🛡️"
                  description="+4.8%"
                />

                <SafetyMetric
                  label="Resolution Rate"
                  value="94.6%"
                  icon="✓"
                  description="+3.2%"
                />
              </div>

              <div className="mt-6 rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    🛡️
                  </div>

                  <div>
                    <p className="text-sm font-bold text-emerald-800">
                      Platform Safety Score: 94/100
                    </p>
                    <p className="text-xs text-emerald-700">
                      Overall safety performance is healthy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Insights */}
          <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Smart Insights
              </p>
              <h3 className="mt-1 text-lg font-bold">
                Platform Performance Insights
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Insight
                icon="📈"
                title="Ride Demand Rising"
                text="Ride activity has increased significantly compared with the previous period."
              />

              <Insight
                icon="💰"
                title="Revenue Improving"
                text="Average fare and platform earnings are showing positive growth."
              />

              <Insight
                icon="🛡️"
                title="Safety Stable"
                text="Complaint resolution and overall platform safety remain strong."
              />
            </div>
          </section>

          <div className="pb-8 text-center text-xs text-slate-400">
            Commuto Analytics • Demo data will be replaced with live backend
            analytics
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Components ---------------- */

function AdminLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
    >
      <span>{icon}</span>
      {text}
    </Link>
  );
}

function MetricCard({
  title,
  value,
  change,
  icon,
  description,
}: {
  title: string;
  value: string;
  change: string;
  icon: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
          {icon}
        </div>

        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          {change}
        </span>
      </div>

      <p className="mt-5 text-sm text-slate-500">{title}</p>

      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>

      <p className="mt-1 text-xs text-slate-400">{description}</p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  percentage,
  type,
}: {
  label: string;
  value: string;
  percentage: string;
  type: "success" | "danger" | "warning" | "info";
}) {
  const styles = {
    success: "bg-emerald-500",
    danger: "bg-red-400",
    warning: "bg-amber-400",
    info: "bg-indigo-400",
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${styles[type]}`} />
        <span className="text-sm text-slate-600">{label}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">{value}</span>
        <span className="w-10 text-right text-xs text-slate-400">
          {percentage}
        </span>
      </div>
    </div>
  );
}

function RevenueCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xl">{icon}</span>

        <span className="text-xs font-semibold text-emerald-600">
          {change}
        </span>
      </div>

      <p className="mt-4 text-xs text-slate-500">{title}</p>

      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-semibold text-slate-500">{value}</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-500"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function GrowthCard({
  title,
  subtitle,
  current,
  previous,
  percentage,
  icon,
}: {
  title: string;
  subtitle: string;
  current: string;
  previous: string;
  percentage: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
          {icon}
        </div>
      </div>

      <div className="mt-7 flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold">{current}</p>
          <p className="mt-1 text-xs text-slate-400">
            Previous: {previous}
          </p>
        </div>

        <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-600">
          {percentage}
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-500"
          style={{ width: "72%" }}
        />
      </div>
    </div>
  );
}

function SafetyMetric({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: string;
  icon: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="flex items-center justify-between">
        <span className="text-lg">{icon}</span>

        <span
          className={`text-xs font-semibold ${
            description.startsWith("+")
              ? "text-emerald-600"
              : "text-emerald-600"
          }`}
        >
          {description}
        </span>
      </div>

      <p className="mt-3 text-xs text-slate-500">{label}</p>

      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function Insight({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-xl">{icon}</div>

      <p className="mt-3 font-semibold">{title}</p>

      <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}