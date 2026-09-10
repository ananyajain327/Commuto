"use client";

import { useMemo, useState } from "react";

type RiskLevel = "Low" | "Medium" | "High" | "Critical";
type RiskStatus = "Flagged" | "Under Review" | "Cleared";

type RiskCase = {
  id: string;
  user: string;
  email: string;
  role: "Passenger" | "Driver";
  rideId: string;
  reason: string;
  riskScore: number;
  level: RiskLevel;
  status: RiskStatus;
  detected: string;
  signals: string[];
};

const initialCases: RiskCase[] = [
  {
    id: "RSK-4001",
    user: "Ananya Jain",
    email: "ananya.jain@gmail.com",
    role: "Passenger",
    rideId: "RID-5001",
    reason: "Unusual ride cancellation pattern",
    riskScore: 88,
    level: "Critical",
    status: "Flagged",
    detected: "10 Sep 2026, 09:12 AM",
    signals: [
      "4 cancellations within 24 hours",
      "Multiple pickup location changes",
      "Repeated booking attempts",
    ],
  },
  {
    id: "RSK-4002",
    user: "Aman Verma",
    email: "aman.verma@gmail.com",
    role: "Driver",
    rideId: "RID-5002",
    reason: "Multiple user complaints",
    riskScore: 74,
    level: "High",
    status: "Under Review",
    detected: "09 Sep 2026, 07:45 PM",
    signals: [
      "3 complaints in 7 days",
      "High cancellation rate",
      "Unexpected route deviation",
    ],
  },
  {
    id: "RSK-4003",
    user: "Rohit Meena",
    email: "rohit.meena@gmail.com",
    role: "Driver",
    rideId: "RID-5004",
    reason: "Suspicious payment activity",
    riskScore: 69,
    level: "High",
    status: "Flagged",
    detected: "09 Sep 2026, 04:30 PM",
    signals: [
      "Multiple failed payment attempts",
      "Repeated wallet transactions",
      "Unusual transaction timing",
    ],
  },
  {
    id: "RSK-4004",
    user: "Priya Mehta",
    email: "priya.mehta@gmail.com",
    role: "Passenger",
    rideId: "RID-5002",
    reason: "Possible duplicate account",
    riskScore: 48,
    level: "Medium",
    status: "Under Review",
    detected: "08 Sep 2026, 01:20 PM",
    signals: [
      "Similar account information",
      "Same device fingerprint",
      "Overlapping activity pattern",
    ],
  },
  {
    id: "RSK-4005",
    user: "Kavya Joshi",
    email: "kavya.joshi@gmail.com",
    role: "Passenger",
    rideId: "RID-5005",
    reason: "Unusual location activity",
    riskScore: 24,
    level: "Low",
    status: "Cleared",
    detected: "07 Sep 2026, 10:05 AM",
    signals: [
      "Temporary location mismatch",
      "No payment anomaly detected",
    ],
  },
];

export default function AdminFraudPage() {
  const [cases, setCases] = useState<RiskCase[]>(initialCases);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedCase, setSelectedCase] =
    useState<RiskCase | null>(null);

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(query) ||
        item.user.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.rideId.toLowerCase().includes(query) ||
        item.reason.toLowerCase().includes(query);

      const matchesLevel =
        levelFilter === "All" ||
        item.level === levelFilter;

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesLevel &&
        matchesStatus
      );
    });
  }, [cases, search, levelFilter, statusFilter]);

  const stats = {
    total: cases.length,
    critical: cases.filter(
      (item) => item.level === "Critical"
    ).length,
    high: cases.filter(
      (item) => item.level === "High"
    ).length,
    review: cases.filter(
      (item) => item.status === "Under Review"
    ).length,
    cleared: cases.filter(
      (item) => item.status === "Cleared"
    ).length,
  };

  const updateCase = (
    id: string,
    status: RiskStatus
  ) => {
    setCases((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      )
    );

    setSelectedCase((current) =>
      current?.id === id
        ? { ...current, status }
        : current
    );
  };

  const suspendAccount = () => {
    if (!selectedCase) return;

    alert(
      `${selectedCase.user}'s account has been marked for suspension review.`
    );
  };

  const riskStyle = (level: RiskLevel) => {
    switch (level) {
      case "Critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
  };

  const statusStyle = (status: RiskStatus) => {
    switch (status) {
      case "Flagged":
        return "bg-red-50 text-red-700 border-red-200";
      case "Under Review":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Cleared":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  const scoreBar = (score: number) => {
    if (score >= 80) return "bg-red-500";
    if (score >= 60) return "bg-orange-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-100 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
                C
              </div>

              <div>
                <h1 className="text-lg font-bold">
                  Commuto
                </h1>
                <p className="text-xs text-slate-500">
                  Admin Console
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5">
            <AdminLink
              href="/admin"
              icon="📊"
              text="Dashboard"
            />

            <AdminLink
              href="/admin/users"
              icon="👥"
              text="Users"
            />

            <AdminLink
              href="/admin/drivers"
              icon="🚗"
              text="Drivers"
            />

            <AdminLink
              href="/admin/verifications"
              icon="✓"
              text="Verifications"
            />

            <AdminLink
              href="/admin/rides"
              icon="🛣️"
              text="Rides"
            />

            <AdminLink
              href="/admin/complaints"
              icon="⚠️"
              text="Complaints"
            />

            <AdminLink
              href="/admin/fraud"
              icon="🚨"
              text="Fraud & Risk"
              active
            />

            <AdminLink
              href="/admin/analytics"
              icon="📈"
              text="Analytics"
            />
          </nav>

          <div className="border-t border-slate-100 p-4">
            <a
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              ← User Dashboard
            </a>
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="lg:ml-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Administration
              </p>

              <h2 className="text-xl font-bold sm:text-2xl">
                Fraud & Risk Management
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">
                  Ananya Jain
                </p>
                <p className="text-xs text-slate-500">
                  Administrator
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                AJ
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-5 sm:p-8">
          {/* Intro */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              Risk Monitoring
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Identify suspicious activity and protect the
              Commuto platform from fraud.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              title="Total Cases"
              value={stats.total}
              description="Detected risk events"
            />

            <StatCard
              title="Critical"
              value={stats.critical}
              description="Immediate attention"
              danger
            />

            <StatCard
              title="High Risk"
              value={stats.high}
              description="Requires investigation"
              orange
            />

            <StatCard
              title="Under Review"
              value={stats.review}
              description="Currently investigating"
            />

            <StatCard
              title="Cleared"
              value={stats.cleared}
              description="No fraud confirmed"
            />
          </div>

          {/* Critical Banner */}
          {stats.critical > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-xl">
                    🚨
                  </div>

                  <div>
                    <h4 className="font-bold text-red-800">
                      Critical risk detected
                    </h4>

                    <p className="mt-1 text-sm text-red-700">
                      {stats.critical} critical case
                      {stats.critical > 1 ? "s" : ""} require
                      immediate investigation.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setLevelFilter("Critical");
                    setStatusFilter("All");
                  }}
                  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700"
                >
                  Review Critical
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search risk cases..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <select
                value={levelFilter}
                onChange={(e) =>
                  setLevelFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="All">All Risk Levels</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="All">All Status</option>
                <option value="Flagged">Flagged</option>
                <option value="Under Review">
                  Under Review
                </option>
                <option value="Cleared">Cleared</option>
              </select>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setLevelFilter("All");
                setStatusFilter("All");
              }}
              className="mt-3 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50"
            >
              Clear Filters
            </button>
          </div>

          {/* Risk Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h4 className="font-bold">
                  Risk Cases
                </h4>

                <p className="text-xs text-slate-500">
                  Showing {filteredCases.length} cases
                </p>
              </div>

              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50">
                Export
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">
                      Risk Case
                    </th>

                    <th className="px-5 py-4">
                      User
                    </th>

                    <th className="px-5 py-4">
                      Reason
                    </th>

                    <th className="px-5 py-4">
                      Risk Score
                    </th>

                    <th className="px-5 py-4">
                      Level
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCases.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-5">
                        <p className="font-semibold">
                          {item.id}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.rideId}
                        </p>

                        {item.level === "Critical" && (
                          <span className="mt-2 inline-block rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700">
                            🚨 Critical
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-semibold">
                          {item.user}
                        </p>

                        <p className="text-xs text-slate-500">
                          {item.role}
                        </p>
                      </td>

                      <td className="max-w-[250px] px-5 py-5">
                        <p className="text-sm font-medium">
                          {item.reason}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {item.signals.length} detection
                          signals
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <div className="w-28">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold">
                              {item.riskScore}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              /100
                            </span>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${scoreBar(
                                item.riskScore
                              )}`}
                              style={{
                                width: `${item.riskScore}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-bold ${riskStyle(
                            item.level
                          )}`}
                        >
                          {item.level}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <button
                          onClick={() =>
                            setSelectedCase(item)
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                        >
                          Investigate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCases.length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-4xl">🛡️</div>

                  <p className="mt-3 font-semibold">
                    No risk cases found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Investigation Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Risk Investigation
                </p>

                <h3 className="text-xl font-bold">
                  {selectedCase.id}
                </h3>
              </div>

              <button
                onClick={() =>
                  setSelectedCase(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Risk Summary */}
              <div
                className={`rounded-2xl border p-5 ${
                  selectedCase.level === "Critical"
                    ? "border-red-200 bg-red-50"
                    : selectedCase.level === "High"
                    ? "border-orange-200 bg-orange-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Risk Score
                    </p>

                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-4xl font-black">
                        {selectedCase.riskScore}
                      </span>

                      <span className="pb-1 text-sm text-slate-500">
                        / 100
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-500">
                      Risk Level
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full border px-3 py-1.5 text-xs font-bold ${riskStyle(
                        selectedCase.level
                      )}`}
                    >
                      {selectedCase.level}
                    </span>
                  </div>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/70">
                  <div
                    className={`h-full rounded-full ${scoreBar(
                      selectedCase.riskScore
                    )}`}
                    style={{
                      width: `${selectedCase.riskScore}%`,
                    }}
                  />
                </div>
              </div>

              {/* User */}
              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Account
                </p>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 font-bold text-white">
                    {selectedCase.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div>
                    <p className="font-bold">
                      {selectedCase.user}
                    </p>

                    <p className="text-sm text-slate-500">
                      {selectedCase.email}
                    </p>

                    <p className="text-xs text-slate-500">
                      {selectedCase.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detection */}
              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Detection Details
                </p>

                <h4 className="mt-3 text-lg font-bold">
                  {selectedCase.reason}
                </h4>

                <p className="mt-1 text-xs text-slate-500">
                  Detected on {selectedCase.detected}
                </p>

                <div className="mt-5 space-y-3">
                  {selectedCase.signals.map(
                    (signal, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm">
                          {index + 1}
                        </div>

                        <p className="text-sm font-medium">
                          {signal}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Related Ride */}
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoBox
                  label="Related Ride"
                  value={selectedCase.rideId}
                />

                <InfoBox
                  label="Current Status"
                  value={selectedCase.status}
                />
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 pt-5">
                <p className="mb-3 text-sm font-bold">
                  Investigation Actions
                </p>

                <div className="flex flex-wrap gap-3">
                  {selectedCase.status !==
                    "Under Review" && (
                    <button
                      onClick={() =>
                        updateCase(
                          selectedCase.id,
                          "Under Review"
                        )
                      }
                      className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
                    >
                      🔎 Mark Under Review
                    </button>
                  )}

                  {selectedCase.status !== "Cleared" && (
                    <button
                      onClick={() =>
                        updateCase(
                          selectedCase.id,
                          "Cleared"
                        )
                      }
                      className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                    >
                      ✓ Clear Risk
                    </button>
                  )}

                  <button
                    onClick={suspendAccount}
                    className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
                  >
                    🔒 Suspend Account
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelectedCase(null)
                }
                className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold hover:bg-slate-50"
              >
                Close Investigation
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function AdminLink({
  href,
  icon,
  text,
  active = false,
}: {
  href: string;
  icon: string;
  text: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
        active
          ? "bg-slate-900 font-semibold text-white"
          : "font-medium text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span>{icon}</span>
      {text}
    </a>
  );
}

function StatCard({
  title,
  value,
  description,
  danger = false,
  orange = false,
}: {
  title: string;
  value: number;
  description: string;
  danger?: boolean;
  orange?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        danger
          ? "border-red-100"
          : orange
          ? "border-orange-100"
          : "border-slate-200"
      }`}
    >
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-bold ${
          danger
            ? "text-red-600"
            : orange
            ? "text-orange-600"
            : ""
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}