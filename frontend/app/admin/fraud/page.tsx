"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiUrl } from "@/lib/api";

type RiskLevel = "Low" | "Medium" | "High" | "Critical";
type RiskStatus = "Flagged" | "Under Review" | "Cleared";

type RiskCase = {
  id: string;
  rawId?: number;
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
    reason: "Emergency SOS Alert triggered during ride",
    riskScore: 92,
    level: "Critical",
    status: "Flagged",
    detected: "10 Sep 2026, 09:12 AM",
    signals: [
      "SOS Panic Button activated",
      "Live coordinates shared with emergency contacts",
      "Direct police dispatch beacon triggered",
    ],
  },
  {
    id: "RSK-4002",
    user: "Aman Verma",
    email: "aman.verma@gmail.com",
    role: "Driver",
    rideId: "RID-5002",
    reason: "Route Deviation & prolonged stationary stop",
    riskScore: 74,
    level: "High",
    status: "Under Review",
    detected: "09 Sep 2026, 07:45 PM",
    signals: [
      "Vehicle stopped for > 15 mins off route",
      "High cancellation rate",
      "Safety check prompt unanswered",
    ],
  },
  {
    id: "RSK-4003",
    user: "Rohit Meena",
    email: "rohit.meena@gmail.com",
    role: "Driver",
    rideId: "RID-5004",
    reason: "Suspicious payment & fare dispute",
    riskScore: 69,
    level: "High",
    status: "Flagged",
    detected: "09 Sep 2026, 04:30 PM",
    signals: [
      "Multiple failed payment attempts",
      "Repeated wallet disputes",
      "Unusual transaction timing",
    ],
  },
  {
    id: "RSK-4004",
    user: "Priya Mehta",
    email: "priya.mehta@gmail.com",
    role: "Passenger",
    rideId: "RID-5002",
    reason: "Possible duplicate account fingerprint",
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
];

interface BackendSosAlert {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  rideId: number | null;
  latitude: number | null;
  longitude: number | null;
  status: "ACTIVE" | "RESOLVED" | "CANCELLED";
  message: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export default function AdminFraudPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cases, setCases] = useState<RiskCase[]>(initialCases);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCase, setSelectedCase] = useState<RiskCase | null>(null);

  useEffect(() => {
    let isCurrent = true;
    const fetchSosReports = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(apiUrl("/api/admin/reports"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok && isCurrent) {
          const alerts = (await res.json()) as BackendSosAlert[];
          if (alerts && alerts.length > 0) {
            const mapped: RiskCase[] = alerts.map((a) => ({
              id: `SOS-${a.id}`,
              rawId: a.id,
              user: a.userFullName || `User #${a.userId}`,
              email: a.userEmail || "user@commuto.com",
              role: "Passenger",
              rideId: a.rideId ? `RID-${a.rideId}` : "Platform",
              reason: a.message || "Emergency SOS Alert triggered",
              riskScore: a.status === "ACTIVE" ? 95 : 20,
              level: a.status === "ACTIVE" ? "Critical" : "Low",
              status: a.status === "ACTIVE" ? "Flagged" : a.status === "RESOLVED" ? "Cleared" : "Under Review",
              detected: new Date(a.createdAt).toLocaleString(),
              signals: [
                `Latitude: ${a.latitude || "26.9124"}, Longitude: ${a.longitude || "75.7873"}`,
                `Status: ${a.status}`,
                a.message ? `Note: ${a.message}` : "Automated panic signal",
              ],
            }));
            setCases(mapped);
          }
        }
      } catch {
        // Fall back gracefully
      }
    };

    void fetchSosReports();
    return () => {
      isCurrent = false;
    };
  }, []);

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
        levelFilter === "All" || item.level === levelFilter;

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [cases, search, levelFilter, statusFilter]);

  const stats = {
    total: cases.length,
    critical: cases.filter((x) => x.level === "Critical").length,
    high: cases.filter((x) => x.level === "High").length,
    review: cases.filter((x) => x.status === "Under Review").length,
    cleared: cases.filter((x) => x.status === "Cleared").length,
  };

  const updateCase = async (id: string, status: RiskStatus, rawId?: number) => {
    setCases((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    setSelectedCase((current) =>
      current?.id === id ? { ...current, status } : current
    );

    const targetRawId = rawId || (id.startsWith("SOS-") ? Number(id.replace("SOS-", "")) : null);
    if (targetRawId && !isNaN(targetRawId) && status === "Cleared") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch(apiUrl(`/api/admin/reports/${targetRawId}/resolve`), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          // Keep optimistic
        }
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <AdminHeader
          title="Safety & SOS Monitoring"
          subtitle="Real-time panic signals, security cases, fraud detections and emergency escalations"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Reports & SOS" }]}
        />

        {/* Content */}
        <div className="space-y-8 px-6 py-8">
          {/* Summary Cards */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Safety Incidents</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</h3>
              <p className="mt-2 text-xs text-slate-400">Tracked safety cases</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Critical / Emergency</p>
              <h3 className="mt-3 text-3xl font-bold text-red-600 dark:text-red-400">{stats.critical}</h3>
              <p className="mt-2 text-xs text-red-500">Requires immediate dispatch</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">In Review</p>
              <h3 className="mt-3 text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.review}</h3>
              <p className="mt-2 text-xs text-amber-600">Investigation pending</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Cleared & Resolved</p>
              <h3 className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.cleared}</h3>
              <p className="mt-2 text-xs text-emerald-600">Safely resolved</p>
            </div>
          </section>

          {/* Table Card */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            {/* Filters */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
              <div className="flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search incident ID, user, reason or ride..."
                  className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All">All Risk Levels</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Flagged">Flagged</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Cleared">Cleared</option>
                </select>
              </div>
            </div>

            {/* Cases Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="px-6 py-4">Incident</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Reason</th>
                    <th className="px-6 py-4">Level</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                        No security incidents found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 dark:text-white">{item.id}</p>
                          <p className="text-xs text-slate-400">{item.detected}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.user}</p>
                          <p className="text-xs text-slate-400">{item.email} • {item.rideId}</p>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate">
                          {item.reason}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              item.level === "Critical"
                                ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                                : item.level === "High"
                                ? "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                            }`}
                          >
                            {item.level}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              item.status === "Cleared"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : item.status === "Under Review"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                                : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedCase(item)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                              Inspect
                            </button>

                            {item.status !== "Cleared" && (
                              <button
                                onClick={() => updateCase(item.id, "Cleared", item.rawId)}
                                className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Incident Investigation • {selectedCase.id}</h3>
                <p className="text-xs text-slate-400">{selectedCase.detected}</p>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Involved Account</p>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{selectedCase.user} ({selectedCase.email})</p>
                <p className="text-xs text-slate-500">Ride Reference: {selectedCase.rideId}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Trigger Reason</p>
                <p className="mt-1 text-sm font-semibold text-red-600 dark:text-red-400">{selectedCase.reason}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Security Signals</p>
                <ul className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {selectedCase.signals.map((sig, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      {sig}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500">
                Status: {selectedCase.status}
              </span>

              <div className="flex gap-2">
                {selectedCase.status !== "Cleared" && (
                  <button
                    onClick={() => {
                      updateCase(selectedCase.id, "Cleared", selectedCase.rawId);
                      setSelectedCase(null);
                    }}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    Mark as Resolved
                  </button>
                )}
                <button
                  onClick={() => setSelectedCase(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}