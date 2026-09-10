"use client";

import { useMemo, useState } from "react";

type Verification = {
  id: string;
  driverId: string;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  vehicleNumber: string;
  applicationDate: string;
  status: "Pending" | "Approved" | "Rejected";
  identity: "Uploaded" | "Missing";
  licence: "Uploaded" | "Missing";
  rc: "Uploaded" | "Missing";
  reason?: string;
};

const initialApplications: Verification[] = [
  {
    id: "VER-2001",
    driverId: "DRV-1002",
    name: "Aman Verma",
    email: "aman.verma@gmail.com",
    phone: "+91 91234 56789",
    vehicle: "Hyundai Creta",
    vehicleNumber: "RJ14 CD 7821",
    applicationDate: "08 Sep 2026",
    status: "Pending",
    identity: "Uploaded",
    licence: "Uploaded",
    rc: "Uploaded",
  },
  {
    id: "VER-2002",
    driverId: "DRV-1005",
    name: "Arjun Gupta",
    email: "arjun.gupta@gmail.com",
    phone: "+91 93456 78901",
    vehicle: "Honda City",
    vehicleNumber: "RJ14 JK 5634",
    applicationDate: "07 Sep 2026",
    status: "Pending",
    identity: "Uploaded",
    licence: "Uploaded",
    rc: "Uploaded",
  },
  {
    id: "VER-2003",
    driverId: "DRV-1001",
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    vehicle: "Maruti Suzuki Dzire",
    vehicleNumber: "RJ14 AB 4521",
    applicationDate: "01 Sep 2026",
    status: "Approved",
    identity: "Uploaded",
    licence: "Uploaded",
    rc: "Uploaded",
  },
  {
    id: "VER-2004",
    driverId: "DRV-1004",
    name: "Rohit Meena",
    email: "rohit.meena@gmail.com",
    phone: "+91 90123 45678",
    vehicle: "Mahindra XUV700",
    vehicleNumber: "RJ14 GH 9012",
    applicationDate: "28 Aug 2026",
    status: "Rejected",
    identity: "Uploaded",
    licence: "Missing",
    rc: "Uploaded",
    reason: "Driving licence could not be verified.",
  },
];

export default function AdminVerificationsPage() {
  const [applications, setApplications] =
    useState<Verification[]>(initialApplications);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Verification | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const filteredApplications = useMemo(() => {
    return applications.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.driverId.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.vehicleNumber.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const stats = {
    total: applications.length,
    pending: applications.filter((x) => x.status === "Pending").length,
    approved: applications.filter((x) => x.status === "Approved").length,
    rejected: applications.filter((x) => x.status === "Rejected").length,
  };

  const updateStatus = (
    id: string,
    status: Verification["status"],
    reason?: string
  ) => {
    setApplications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              reason,
            }
          : item
      )
    );

    setSelected((current) =>
      current?.id === id
        ? {
            ...current,
            status,
            reason,
          }
        : current
    );
  };

  const approveApplication = () => {
    if (!selected) return;

    updateStatus(selected.id, "Approved");
    setShowRejectBox(false);
  };

  const rejectApplication = () => {
    if (!selected) return;

    const reason =
      rejectReason.trim() ||
      "Documents could not be verified.";

    updateStatus(selected.id, "Rejected", reason);
    setRejectReason("");
    setShowRejectBox(false);
  };

  const statusStyle = (status: Verification["status"]) => {
    if (status === "Approved") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (status === "Pending") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-red-200 bg-red-50 text-red-700";
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
                <p className="text-xs text-slate-500">
                  Admin Console
                </p>
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
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              🚗 Drivers
            </a>

            <a
              href="/admin/verifications"
              className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
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
                Driver Verifications
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
              Verification Center
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Review driver documents and approve or reject
              verification applications.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Total Applications
              </p>

              <p className="mt-2 text-3xl font-bold">
                {stats.total}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                All verification requests
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Pending Review
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {stats.pending}
              </p>

              <p className="mt-2 text-xs text-amber-600">
                Require admin action
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Approved
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {stats.approved}
              </p>

              <p className="mt-2 text-xs text-emerald-600">
                Verified drivers
              </p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">
                Rejected
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {stats.rejected}
              </p>

              <p className="mt-2 text-xs text-red-600">
                Failed verification
              </p>
            </div>
          </div>

          {/* Search / Filters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by driver, email, ID or vehicle number..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="All">All Applications</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Applications */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h4 className="font-bold">
                  Verification Applications
                </h4>

                <p className="text-xs text-slate-500">
                  Showing {filteredApplications.length} applications
                </p>
              </div>

              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                {stats.pending} Pending
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">Driver</th>
                    <th className="px-5 py-4">Vehicle</th>
                    <th className="px-5 py-4">Documents</th>
                    <th className="px-5 py-4">Applied</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                            {item.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>

                          <div>
                            <p className="font-semibold">
                              {item.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {item.driverId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-medium">
                          {item.vehicle}
                        </p>

                        <p className="text-xs text-slate-500">
                          {item.vehicleNumber}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex gap-1.5">
                          <span
                            title="Identity Proof"
                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                              item.identity === "Uploaded"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            🪪
                          </span>

                          <span
                            title="Driving Licence"
                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                              item.licence === "Uploaded"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            📄
                          </span>

                          <span
                            title="Vehicle RC"
                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                              item.rc === "Uploaded"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            🚘
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-600">
                        {item.applicationDate}
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
                          onClick={() => {
                            setSelected(item);
                            setShowDocuments(false);
                            setShowRejectBox(false);
                          }}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredApplications.length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-4xl">📋</div>

                  <p className="mt-3 font-semibold">
                    No applications found
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Verification Application
                </p>

                <h3 className="text-xl font-bold">
                  {selected.name}
                </h3>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Profile */}
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 font-bold text-white">
                    {selected.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>

                  <div>
                    <h4 className="font-bold">
                      {selected.name}
                    </h4>

                    <p className="text-sm text-slate-500">
                      {selected.email}
                    </p>

                    <p className="text-sm text-slate-500">
                      {selected.phone}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(
                    selected.status
                  )}`}
                >
                  {selected.status}
                </span>
              </div>

              {/* Driver / Vehicle info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Driver ID
                  </p>

                  <p className="mt-1 font-semibold">
                    {selected.driverId}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Application ID
                  </p>

                  <p className="mt-1 font-semibold">
                    {selected.id}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Vehicle
                  </p>

                  <p className="mt-1 font-semibold">
                    {selected.vehicle}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Vehicle Number
                  </p>

                  <p className="mt-1 font-semibold">
                    {selected.vehicleNumber}
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold">
                      Submitted Documents
                    </h4>

                    <p className="mt-1 text-xs text-slate-500">
                      Review all required documents
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setShowDocuments(!showDocuments)
                    }
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    {showDocuments ? "Hide" : "View Documents"}
                  </button>
                </div>

                {showDocuments && (
                  <div className="mt-5 space-y-3">
                    <DocumentRow
                      title="Identity Proof"
                      value={selected.identity}
                    />

                    <DocumentRow
                      title="Driving Licence"
                      value={selected.licence}
                    />

                    <DocumentRow
                      title="Vehicle Registration Certificate"
                      value={selected.rc}
                    />
                  </div>
                )}
              </div>

              {/* Previous rejection */}
              {selected.status === "Rejected" &&
                selected.reason && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-bold text-red-700">
                      Rejection Reason
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                      {selected.reason}
                    </p>
                  </div>
                )}

              {/* Reject Box */}
              {showRejectBox && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                  <label className="text-sm font-bold text-red-800">
                    Reason for rejection
                  </label>

                  <textarea
                    value={rejectReason}
                    onChange={(e) =>
                      setRejectReason(e.target.value)
                    }
                    rows={4}
                    placeholder="Enter the reason for rejecting this application..."
                    className="mt-3 w-full rounded-xl border border-red-200 bg-white p-3 text-sm outline-none focus:border-red-400"
                  />

                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => setShowRejectBox(false)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={rejectApplication}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              {!showRejectBox && (
                <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                  {selected.status === "Pending" ? (
                    <>
                      <button
                        onClick={approveApplication}
                        className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        ✓ Approve Verification
                      </button>

                      <button
                        onClick={() => setShowRejectBox(true)}
                        className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
                      >
                        ✕ Reject Application
                      </button>
                    </>
                  ) : (
                    <div className="w-full rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
                      This application has already been{" "}
                      <strong>{selected.status.toLowerCase()}</strong>.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function DocumentRow({
  title,
  value,
}: {
  title: string;
  value: "Uploaded" | "Missing";
}) {
  const uploaded = value === "Uploaded";

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
          📄
        </div>

        <div>
          <p className="text-sm font-semibold">{title}</p>

          <p className="text-xs text-slate-500">
            Driver submitted document
          </p>
        </div>
      </div>

      <span
        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
          uploaded
            ? "bg-emerald-50 text-emerald-700"
            : "bg-red-50 text-red-700"
        }`}
      >
        {uploaded ? "✓ Uploaded" : "✕ Missing"}
      </span>
    </div>
  );
}