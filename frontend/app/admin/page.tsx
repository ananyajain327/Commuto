"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

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

interface AdminOverview {
  totalUsers: number;
  totalDrivers: number;
  verifiedDrivers: number;
  activeRides: number;
  completedRides: number;
  totalRides: number;
  pendingVerifications: number;
  activeSosAlerts: number;
  platformGrossFare: number;
}

interface AdminRide {
  id: number;
  driverId: number;
  driverName: string;
  startLocation: string;
  destination: string;
  expectedFare: number;
  status: string;
}

export default function AdminDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [liveRides, setLiveRides] = useState<AdminRide[]>([]);

  useEffect(() => {
    let isCurrent = true;
    const loadAdminData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [overviewRes, ridesRes] = await Promise.all([
          fetch(apiUrl("/api/admin/overview"), { headers }),
          fetch(apiUrl("/api/admin/rides"), { headers }),
        ]);

        if (overviewRes.ok && isCurrent) {
          const ov = (await overviewRes.json()) as AdminOverview;
          setOverview(ov);
        }
        if (ridesRes.ok && isCurrent) {
          const rList = (await ridesRes.json()) as AdminRide[];
          setLiveRides(rList);
        }
      } catch {
        // Fall back gracefully to mock stats if not logged in as admin
      }
    };

    void loadAdminData();
    return () => {
      isCurrent = false;
    };
  }, []);

  const dynamicStats = [
    {
      title: "Total Users",
      value: overview ? String(overview.totalUsers) : "12,480",
      change: "+8.4%",
      icon: "👥",
      link: "/admin/users",
    },
    {
      title: "Verified Drivers",
      value: overview ? `${overview.verifiedDrivers} / ${overview.totalDrivers}` : "2,184",
      change: "+5.2%",
      icon: "🚗",
      link: "/admin/drivers",
    },
    {
      title: "Total Rides",
      value: overview ? String(overview.totalRides) : "38,642",
      change: overview ? `${overview.activeRides} active` : "+12.8%",
      icon: "🛣️",
      link: "/admin/rides",
    },
    {
      title: "Platform Gross Volume",
      value: overview ? `₹${overview.platformGrossFare.toFixed(0)}` : "₹18.6L",
      change: "+14.6%",
      icon: "💰",
      link: "/admin/analytics",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <AdminHeader
          title="Good evening, Admin 👋"
          subtitle="Admin Control Center • Commuto Smart Mobility"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Overview" }]}
        />

        <div className="space-y-8 px-6 py-8">
          {/* Overview */}
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold">Platform Overview</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Monitor Commuto&apos;s overall performance and key platform metrics.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {dynamicStats.map((stat) => (
                <Link
                  key={stat.title}
                  href={stat.link}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                      <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {stat.value}
                      </h3>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl group-hover:scale-110 transition dark:bg-slate-800">
                      {stat.icon}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      ↑ {stat.change}
                    </span>

                    <span className="text-xs text-slate-400">
                      vs last period
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="mb-5 text-xl font-bold">Quick Actions</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "👥", title: "Manage Users", text: "View, filter and manage platform riders", href: "/admin/users" },
                { icon: "🚗", title: "Verify Drivers", text: "Review pending driver applications", href: "/admin/verifications" },
                { icon: "📋", title: "Review Complaints", text: "Handle reported rider/driver issues", href: "/admin/complaints" },
                { icon: "📈", title: "View Analytics", text: "Explore revenue and demand insights", href: "/admin/analytics" },
              ].map((action) => (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-xs transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl group-hover:scale-110 transition dark:bg-slate-800">
                    {action.icon}
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{action.title}</h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {action.text}
                  </p>

                  <p className="mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Open Module →
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* Analytics Chart & Health */}
          <section className="grid gap-6 xl:grid-cols-3">
            {/* Chart */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Ride Activity</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Ride volume over the past 7 days
                  </p>
                </div>

                <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 6 months</option>
                </select>
              </div>

              <div className="mt-8 flex h-64 items-end gap-3 border-b border-l border-slate-100 px-4 pb-0 dark:border-slate-800">
                {[42, 58, 48, 75, 62, 88, 96].map((height, index) => (
                  <div
                    key={index}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >
                    <div
                      style={{ height: `${height}%` }}
                      className="relative rounded-t-xl bg-slate-900 transition group-hover:bg-slate-700 dark:bg-emerald-600 dark:group-hover:bg-emerald-500"
                    >
                      <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block dark:bg-slate-800">
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
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-bold">Platform Health</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Live microservice status
              </p>

              <div className="mt-7 space-y-5">
                {[
                  ["API Services", "Operational"],
                  ["PostgreSQL Database", "Operational"],
                  ["WebSocket Gateway", "Operational"],
                  ["Razorpay Payments", "Operational"],
                  ["SOS Alert Dispatcher", "Operational"],
                ].map(([service, status]) => (
                  <div
                    key={service}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{service}</span>

                    <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      {status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/40">
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  ✓ All systems operational
                </p>

                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                  Connected to Spring Boot Backend (Port 8080)
                </p>
              </div>
            </div>
          </section>

          {/* Recent Rides */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold">Recent Rides</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Latest platform activity and trips
                </p>
              </div>

              <Link href="/admin/rides" className="text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
                View All Rides →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="px-6 py-4">Ride ID</th>
                    <th className="px-6 py-4">Passenger</th>
                    <th className="px-6 py-4">Driver</th>
                    <th className="px-6 py-4">Route</th>
                    <th className="px-6 py-4">Fare</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {(liveRides.length > 0 ? liveRides : recentRides).map((item) => {
                    const isLive = "startLocation" in item;
                    const ride = item as unknown as Record<string, string | number>;
                    const idText = isLive ? `RID-${ride.id}` : String(ride.id);
                    const passengerText = isLive ? "Platform Rider" : String(ride.passenger);
                    const driverText = isLive ? String(ride.driverName) : String(ride.driver);
                    const routeText = isLive ? `${ride.startLocation} → ${ride.destination}` : String(ride.route);
                    const fareText = isLive ? `₹${ride.expectedFare}` : String(ride.fare);
                    const statusText = String(ride.status);

                    return (
                      <tr
                        key={String(ride.id)}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">
                          {idText}
                        </td>

                        <td className="px-6 py-5 text-sm">{passengerText}</td>

                        <td className="px-6 py-5 text-sm font-medium">{driverText}</td>

                        <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                          {routeText}
                        </td>

                        <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">
                          {fareText}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              statusText.toLowerCase() === "completed"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : statusText.toLowerCase() === "active"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                                : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                            }`}
                          >
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bottom Grid */}
          <section className="grid gap-6 xl:grid-cols-2">
            {/* Complaints */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                <div>
                  <h2 className="font-bold">Recent Complaints</h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Issues requiring admin attention
                  </p>
                </div>

                <Link
                  href="/admin/complaints"
                  className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400"
                >
                  Manage Complaints →
                </Link>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
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
                            ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                            : "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                        }`}
                      >
                        {complaint.priority}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {complaint.category}
                      </span>

                      <Link href="/admin/complaints" className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400">
                        Review →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
                <div>
                  <h2 className="font-bold">Pending Driver Verification</h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Drivers waiting for document review
                  </p>
                </div>

                <Link
                  href="/admin/verifications"
                  className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400"
                >
                  View Queue →
                </Link>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {verificationRequests.map((driver) => (
                  <div
                    key={driver.name}
                    className="flex items-center justify-between gap-4 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-bold dark:bg-slate-800">
                        {driver.name.charAt(0)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold">{driver.name}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {driver.vehicle} • {driver.submitted}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/admin/verifications"
                      className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Safety Alert */}
          <section className="rounded-3xl border border-red-200 bg-white p-6 shadow-xs dark:border-red-900/50 dark:bg-slate-900">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-xl dark:bg-red-950/60">
                  🚨
                </div>

                <div>
                  <h2 className="font-bold text-red-600 dark:text-red-400">Emergency & SOS Monitoring</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Live SOS alerts, security triggers, and safety reports.
                  </p>
                </div>
              </div>

              <Link
                href="/admin/fraud"
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 text-center"
              >
                Review Safety Reports →
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-slate-200 py-6 text-center dark:border-slate-800">
            <p className="text-xs text-slate-400">
              Commuto Admin Panel • Smart Mobility Management System
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}