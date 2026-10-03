"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiUrl } from "@/lib/api";

type Verification = {
  id: string;
  rawId?: number;
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
    rawId: 2001,
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
    rawId: 2002,
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
    rawId: 2003,
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
    rawId: 2004,
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
    reason: "Driving licence could not be verified with regional transport authority.",
  },
];

interface BackendVerification {
  id: number;
  driverId: number;
  driverName: string;
  driverEmail: string;
  licenseNumber: string;
  vehicleRc: string;
  insuranceNumber: string;
  vehicleModel: string;
  vehicleNumber: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

export default function AdminVerificationsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [applications, setApplications] = useState<Verification[]>(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Verification | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    let isCurrent = true;
    const fetchVerifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(apiUrl("/api/admin/verifications"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok && isCurrent) {
          const data = (await res.json()) as BackendVerification[];
          if (data && data.length > 0) {
            const mapped: Verification[] = data.map((b) => ({
              id: `VER-${b.id}`,
              rawId: b.id,
              driverId: `DRV-${b.driverId}`,
              name: b.driverName,
              email: b.driverEmail,
              phone: "+91 ••••• •••••",
              vehicle: b.vehicleModel || "Vehicle",
              vehicleNumber: b.vehicleNumber || "N/A",
              applicationDate: new Date(b.submittedAt).toLocaleDateString(),
              status: b.status === "APPROVED" ? "Approved" : b.status === "REJECTED" ? "Rejected" : "Pending",
              identity: "Uploaded",
              licence: b.licenseNumber ? "Uploaded" : "Missing",
              rc: b.vehicleRc ? "Uploaded" : "Missing",
              reason: b.rejectionReason || undefined,
            }));
            setApplications(mapped);
          }
        }
      } catch {
        // Fall back gracefully
      }
    };

    void fetchVerifications();
    return () => {
      isCurrent = false;
    };
  }, []);

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

  const updateStatus = async (
    id: string,
    status: Verification["status"],
    reason?: string,
    rawId?: number
  ) => {
    setApplications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status, reason } : item
      )
    );

    setSelected((current) =>
      current?.id === id ? { ...current, status, reason } : current
    );

    const targetRawId = rawId || (id.startsWith("VER-") ? Number(id.replace("VER-", "")) : null);
    if (targetRawId && !isNaN(targetRawId)) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch(apiUrl(`/api/admin/verifications/${targetRawId}/review`), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: status === "Approved" ? "APPROVED" : "REJECTED",
              rejectionReason: reason,
            }),
          });
        } catch {
          // Keep optimistic
        }
      }
    }
  };

  const approveApplication = () => {
    if (!selected) return;
    updateStatus(selected.id, "Approved", undefined, selected.rawId);
    setShowRejectBox(false);
  };

  const rejectApplication = () => {
    if (!selected) return;
    const reason = rejectReason.trim() || "Documents could not be verified.";
    updateStatus(selected.id, "Rejected", reason, selected.rawId);
    setRejectReason("");
    setShowRejectBox(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <AdminHeader
          title="Driver Verifications & KYC"
          subtitle="Inspect driver licenses, vehicle RC documents, and approve captain accounts"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Verifications" }]}
        />

        {/* Content */}
        <div className="space-y-8 px-6 py-8">
          {/* Stats Cards */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Applications</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</h3>
              <p className="mt-2 text-xs text-slate-400">All submitted KYC requests</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Review</p>
              <h3 className="mt-3 text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</h3>
              <p className="mt-2 text-xs text-amber-600">Action required</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Approved Captains</p>
              <h3 className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.approved}</h3>
              <p className="mt-2 text-xs text-emerald-600">Verified drivers</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Rejected</p>
              <h3 className="mt-3 text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</h3>
              <p className="mt-2 text-xs text-red-500">Failed verification</p>
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
                  placeholder="Search by driver, email, ID or vehicle number..."
                  className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="px-6 py-4">Application</th>
                    <th className="px-6 py-4">Driver</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Documents</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                        No verification applications found.
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 dark:text-white">{item.id}</p>
                          <p className="text-xs text-slate-400">{item.applicationDate}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.email} • {item.driverId}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{item.vehicle}</p>
                          <p className="text-xs text-slate-400">{item.vehicleNumber}</p>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                              DL: {item.licence}
                            </span>
                            <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                              RC: {item.rc}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              item.status === "Approved"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : item.status === "Pending"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                                : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelected(item);
                              setShowDocuments(false);
                              setShowRejectBox(false);
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          >
                            Review
                          </button>
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

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">KYC Review • {selected.id}</h3>
                <p className="text-xs text-slate-400">{selected.name} • {selected.driverId}</p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                  <p className="text-xs text-slate-400">Driver Contact</p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">{selected.email}</p>
                  <p className="text-xs text-slate-500">{selected.phone}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                  <p className="text-xs text-slate-400">Vehicle Registered</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selected.vehicle}</p>
                  <p className="text-xs text-slate-500">{selected.vehicleNumber}</p>
                </div>
              </div>

              {/* Documents */}
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Submitted Documents</p>
                  <button
                    onClick={() => setShowDocuments(!showDocuments)}
                    className="text-xs font-bold text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    {showDocuments ? "Hide List" : "Inspect Documents"}
                  </button>
                </div>

                {showDocuments && (
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between rounded-xl bg-white p-2.5 dark:bg-slate-900">
                      <span>Identity Proof (Aadhaar/PAN)</span>
                      <span className="font-bold text-emerald-600">✓ {selected.identity}</span>
                    </div>
                    <div className="flex justify-between rounded-xl bg-white p-2.5 dark:bg-slate-900">
                      <span>Driving Licence</span>
                      <span className="font-bold text-emerald-600">✓ {selected.licence}</span>
                    </div>
                    <div className="flex justify-between rounded-xl bg-white p-2.5 dark:bg-slate-900">
                      <span>Vehicle Registration Certificate (RC)</span>
                      <span className="font-bold text-emerald-600">✓ {selected.rc}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Rejection box if open */}
              {showRejectBox && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/40">
                  <label className="text-xs font-bold text-red-800 dark:text-red-300">Reason for rejection</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter rejection reason for driver..."
                    className="mt-2 w-full rounded-xl border border-red-200 bg-white p-2.5 text-xs outline-none focus:border-red-400 dark:border-red-800 dark:bg-slate-900 dark:text-white"
                    rows={2}
                  />
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => setShowRejectBox(false)}
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={rejectApplication}
                      className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500">
                Status: {selected.status}
              </span>

              {!showRejectBox && (
                <div className="flex gap-2">
                  {selected.status === "Pending" && (
                    <>
                      <button
                        onClick={approveApplication}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setShowRejectBox(true)}
                        className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelected(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}