"use client";

import { useMemo, useState } from "react";

type Driver = {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  vehicleNumber: string;
  rating: number;
  rides: number;
  earnings: number;
  verification: "Pending" | "Verified" | "Rejected";
  status: "Active" | "Suspended";
  joined: string;
};

const initialDrivers: Driver[] = [
  {
    id: "DRV-1001",
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    vehicle: "Maruti Suzuki Dzire",
    vehicleNumber: "RJ14 AB 4521",
    rating: 4.9,
    rides: 342,
    earnings: 68450,
    verification: "Verified",
    status: "Active",
    joined: "12 Jan 2026",
  },
  {
    id: "DRV-1002",
    name: "Aman Verma",
    email: "aman.verma@gmail.com",
    phone: "+91 91234 56789",
    vehicle: "Hyundai Creta",
    vehicleNumber: "RJ14 CD 7821",
    rating: 4.7,
    rides: 218,
    earnings: 48200,
    verification: "Pending",
    status: "Active",
    joined: "24 Feb 2026",
  },
  {
    id: "DRV-1003",
    name: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    phone: "+91 99887 66554",
    vehicle: "Tata Nexon",
    vehicleNumber: "RJ45 EF 3390",
    rating: 4.6,
    rides: 187,
    earnings: 39600,
    verification: "Verified",
    status: "Active",
    joined: "03 Mar 2026",
  },
  {
    id: "DRV-1004",
    name: "Rohit Meena",
    email: "rohit.meena@gmail.com",
    phone: "+91 90123 45678",
    vehicle: "Mahindra XUV700",
    vehicleNumber: "RJ14 GH 9012",
    rating: 4.3,
    rides: 96,
    earnings: 21400,
    verification: "Rejected",
    status: "Suspended",
    joined: "18 Mar 2026",
  },
  {
    id: "DRV-1005",
    name: "Arjun Gupta",
    email: "arjun.gupta@gmail.com",
    phone: "+91 93456 78901",
    vehicle: "Honda City",
    vehicleNumber: "RJ14 JK 5634",
    rating: 4.8,
    rides: 275,
    earnings: 55750,
    verification: "Pending",
    status: "Active",
    joined: "05 Apr 2026",
  },
];

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [search, setSearch] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(search.toLowerCase()) ||
        driver.email.toLowerCase().includes(search.toLowerCase()) ||
        driver.id.toLowerCase().includes(search.toLowerCase()) ||
        driver.vehicleNumber.toLowerCase().includes(search.toLowerCase());

      const matchesVerification =
        verificationFilter === "All" ||
        driver.verification === verificationFilter;

      const matchesStatus =
        statusFilter === "All" || driver.status === statusFilter;

      return matchesSearch && matchesVerification && matchesStatus;
    });
  }, [drivers, search, verificationFilter, statusFilter]);

  const stats = {
    total: drivers.length,
    verified: drivers.filter((d) => d.verification === "Verified").length,
    pending: drivers.filter((d) => d.verification === "Pending").length,
    rejected: drivers.filter((d) => d.verification === "Rejected").length,
  };

  const updateVerification = (
    id: string,
    verification: Driver["verification"]
  ) => {
    setDrivers((current) =>
      current.map((driver) =>
        driver.id === id ? { ...driver, verification } : driver
      )
    );

    setSelectedDriver((current) =>
      current?.id === id ? { ...current, verification } : current
    );
  };

  const toggleStatus = (id: string) => {
    setDrivers((current) =>
      current.map((driver) =>
        driver.id === id
          ? {
              ...driver,
              status: driver.status === "Active" ? "Suspended" : "Active",
            }
          : driver
      )
    );

    setSelectedDriver((current) =>
      current?.id === id
        ? {
            ...current,
            status:
              current.status === "Active" ? "Suspended" : "Active",
          }
        : current
    );
  };

  const verificationStyle = (status: Driver["verification"]) => {
    if (status === "Verified") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "Pending") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
  };

  const statusStyle = (status: Driver["status"]) => {
    return status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-red-50 text-red-700 border-red-200";
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
                <h1 className="text-lg font-bold">Commuto</h1>
                <p className="text-xs text-slate-500">Admin Console</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-5">
            <a
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              📊 Dashboard
            </a>

            <a
              href="/admin/users"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              👥 Users
            </a>

            <a
              href="/admin/drivers"
              className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              🚗 Drivers
            </a>

            <a
              href="/admin/verifications"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              ✓ Verifications
            </a>

            <a
              href="/admin/rides"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              🛣️ Rides
            </a>

            <a
              href="/admin/complaints"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              ⚠️ Complaints
            </a>

            <a
              href="/admin/analytics"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              📈 Analytics
            </a>
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
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Administration
              </p>
              <h2 className="text-xl font-bold sm:text-2xl">
                Driver Management
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">Ananya Jain</p>
                <p className="text-xs text-slate-500">Administrator</p>
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
              Drivers
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Manage drivers, verification status, vehicles and platform
              access.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Total Drivers</p>
              <p className="mt-2 text-3xl font-bold">{stats.total}</p>
              <p className="mt-2 text-xs text-slate-400">
                Registered on Commuto
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Verified</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {stats.verified}
              </p>
              <p className="mt-2 text-xs text-emerald-600">
                Ready to drive
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Pending</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {stats.pending}
              </p>
              <p className="mt-2 text-xs text-amber-600">
                Need review
              </p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Rejected</p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {stats.rejected}
              </p>
              <p className="mt-2 text-xs text-red-600">
                Verification failed
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 xl:flex-row">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by driver name, email, ID or vehicle number..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
                />
              </div>

              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="All">All Verification</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setVerificationFilter("All");
                  setStatusFilter("All");
                }}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h4 className="font-bold">All Drivers</h4>
                <p className="text-xs text-slate-500">
                  Showing {filteredDrivers.length} drivers
                </p>
              </div>

              <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                + Add Driver
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Driver</th>
                    <th className="px-5 py-4">Vehicle</th>
                    <th className="px-5 py-4">Rating</th>
                    <th className="px-5 py-4">Rides</th>
                    <th className="px-5 py-4">Earnings</th>
                    <th className="px-5 py-4">Verification</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredDrivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                            {driver.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>

                          <div>
                            <p className="font-semibold">
                              {driver.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {driver.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-medium">
                          {driver.vehicle}
                        </p>
                        <p className="text-xs text-slate-500">
                          {driver.vehicleNumber}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <span className="font-semibold">
                          ⭐ {driver.rating}
                        </span>
                      </td>

                      <td className="px-5 py-5 font-medium">
                        {driver.rides}
                      </td>

                      <td className="px-5 py-5 font-semibold">
                        ₹{driver.earnings.toLocaleString("en-IN")}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${verificationStyle(
                            driver.verification
                          )}`}
                        >
                          {driver.verification}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(
                            driver.status
                          )}`}
                        >
                          {driver.status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <button
                          onClick={() => setSelectedDriver(driver)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredDrivers.length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-4xl">🚗</div>
                  <p className="mt-3 font-semibold">
                    No drivers found
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

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Driver Profile
                </p>
                <h3 className="text-xl font-bold">
                  {selectedDriver.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedDriver(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Profile */}
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
                  {selectedDriver.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <div>
                  <h4 className="text-lg font-bold">
                    {selectedDriver.name}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {selectedDriver.email}
                  </p>
                  <p className="text-sm text-slate-500">
                    {selectedDriver.phone}
                  </p>
                </div>
              </div>

              {/* Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Driver ID</p>
                  <p className="mt-1 font-semibold">
                    {selectedDriver.id}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="mt-1 font-semibold">
                    {selectedDriver.joined}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Vehicle</p>
                  <p className="mt-1 font-semibold">
                    {selectedDriver.vehicle}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Vehicle Number
                  </p>
                  <p className="mt-1 font-semibold">
                    {selectedDriver.vehicleNumber}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">Rating</p>
                  <p className="mt-1 font-semibold">
                    ⭐ {selectedDriver.rating} / 5
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Total Earnings
                  </p>
                  <p className="mt-1 font-semibold">
                    ₹{selectedDriver.earnings.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              {/* Verification */}
              <div>
                <p className="mb-3 text-sm font-bold">
                  Verification Status
                </p>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${verificationStyle(
                      selectedDriver.verification
                    )}`}
                  >
                    {selectedDriver.verification}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(
                      selectedDriver.status
                    )}`}
                  >
                    {selectedDriver.status}
                  </span>
                </div>
              </div>

              {/* Documents */}
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">
                      Verification Documents
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      Identity and vehicle documents
                    </p>
                  </div>

                  <button
                    onClick={() => setShowDocuments(!showDocuments)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    {showDocuments ? "Hide" : "View Documents"}
                  </button>
                </div>

                {showDocuments && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4 text-center">
                      <div className="text-2xl">🪪</div>
                      <p className="mt-2 text-sm font-semibold">
                        Identity Proof
                      </p>
                      <p className="text-xs text-emerald-600">
                        Uploaded
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 text-center">
                      <div className="text-2xl">📄</div>
                      <p className="mt-2 text-sm font-semibold">
                        Driving Licence
                      </p>
                      <p className="text-xs text-emerald-600">
                        Uploaded
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4 text-center">
                      <div className="text-2xl">🚘</div>
                      <p className="mt-2 text-sm font-semibold">
                        Vehicle RC
                      </p>
                      <p className="text-xs text-emerald-600">
                        Uploaded
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                {selectedDriver.verification === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateVerification(
                          selectedDriver.id,
                          "Verified"
                        )
                      }
                      className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                    >
                      ✓ Approve Verification
                    </button>

                    <button
                      onClick={() =>
                        updateVerification(
                          selectedDriver.id,
                          "Rejected"
                        )
                      }
                      className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
                    >
                      ✕ Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() => toggleStatus(selectedDriver.id)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  {selectedDriver.status === "Active"
                    ? "Suspend Driver"
                    : "Activate Driver"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}