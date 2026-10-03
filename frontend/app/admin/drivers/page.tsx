"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiUrl } from "@/lib/api";

type Driver = {
  id: string;
  rawId?: number;
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
    rawId: 2,
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
    rawId: 4,
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
    rawId: 6,
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
    joined: "10 Dec 2025",
  },
  {
    id: "DRV-1004",
    rawId: 8,
    name: "Rohit Meena",
    email: "rohit.meena@gmail.com",
    phone: "+91 90123 45678",
    vehicle: "Mahindra XUV700",
    vehicleNumber: "RJ14 GH 9012",
    rating: 4.5,
    rides: 94,
    earnings: 21500,
    verification: "Rejected",
    status: "Suspended",
    joined: "05 Mar 2026",
  },
  {
    id: "DRV-1005",
    rawId: 9,
    name: "Arjun Gupta",
    email: "arjun.gupta@gmail.com",
    phone: "+91 93456 78901",
    vehicle: "Honda City",
    vehicleNumber: "RJ14 JK 5634",
    rating: 4.8,
    rides: 260,
    earnings: 55900,
    verification: "Pending",
    status: "Active",
    joined: "18 Jan 2026",
  },
];

interface BackendUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: "PASSENGER" | "DRIVER" | "ADMIN";
  active: boolean;
  verified: boolean;
  createdAt: string;
}

interface BackendVerification {
  id: number;
  driverId: number;
  driverName: string;
  driverEmail: string;
  licenseNumber: string;
  vehicleRc: string;
  vehicleModel: string;
  vehicleNumber: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function AdminDriversPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    const fetchDrivers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, verifRes] = await Promise.all([
          fetch(apiUrl("/api/admin/users"), { headers }),
          fetch(apiUrl("/api/admin/verifications"), { headers }),
        ]);

        if (usersRes.ok && isCurrent) {
          const userList = (await usersRes.json()) as BackendUser[];
          const verifList = verifRes.ok ? ((await verifRes.json()) as BackendVerification[]) : [];

          const driverUsers = userList.filter((u) => u.role === "DRIVER");
          if (driverUsers.length > 0) {
            const mapped: Driver[] = driverUsers.map((u) => {
              const matchingVerif = verifList.find((v) => v.driverId === u.id || v.driverEmail === u.email);
              const verifStatus = matchingVerif
                ? matchingVerif.status === "APPROVED"
                  ? "Verified"
                  : matchingVerif.status === "REJECTED"
                  ? "Rejected"
                  : "Pending"
                : u.verified
                ? "Verified"
                : "Pending";

              return {
                id: `DRV-${u.id}`,
                rawId: u.id,
                name: u.fullName,
                email: u.email,
                phone: u.phone || "+91 ••••• •••••",
                vehicle: matchingVerif?.vehicleModel || "Maruti Suzuki Dzire",
                vehicleNumber: matchingVerif?.vehicleNumber || "RJ14 AB 1234",
                rating: 4.8,
                rides: 14,
                earnings: 3200,
                verification: verifStatus,
                status: u.active ? "Active" : "Suspended",
                joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent",
              };
            });
            setDrivers(mapped);
          }
        }
      } catch {
        // Fall back gracefully to mock list
      }
    };

    void fetchDrivers();
    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesSearch =
        driver.name.toLowerCase().includes(search.toLowerCase()) ||
        driver.email.toLowerCase().includes(search.toLowerCase()) ||
        driver.vehicle.toLowerCase().includes(search.toLowerCase()) ||
        driver.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
        driver.id.toLowerCase().includes(search.toLowerCase());

      const matchesVerification =
        verificationFilter === "All" || driver.verification === verificationFilter;

      const matchesStatus =
        statusFilter === "All" || driver.status === statusFilter;

      return matchesSearch && matchesVerification && matchesStatus;
    });
  }, [drivers, search, verificationFilter, statusFilter]);

  const handleOpenDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: string, rawId?: number) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: d.status === "Active" ? "Suspended" : "Active",
            }
          : d
      )
    );

    if (selectedDriver && selectedDriver.id === id) {
      setSelectedDriver((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "Active" ? "Suspended" : "Active",
            }
          : null
      );
    }

    const targetRawId = rawId || (id.startsWith("DRV-") ? Number(id.replace("DRV-", "")) : null);
    if (targetRawId && !isNaN(targetRawId)) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch(apiUrl(`/api/admin/users/${targetRawId}/toggle-status`), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          // Keep optimistic
        }
      }
    }
  };

  const totalDrivers = drivers.length;
  const verifiedDrivers = drivers.filter((d) => d.verification === "Verified").length;
  const pendingDrivers = drivers.filter((d) => d.verification === "Pending").length;
  const suspendedDrivers = drivers.filter((d) => d.status === "Suspended").length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <AdminHeader
          title="Drivers Management"
          subtitle="Manage verified captains, pending KYC approvals, vehicles and ratings"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Drivers" }]}
        />

        {/* Content */}
        <div className="space-y-8 px-6 py-8">
          {/* Top Summary Cards */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Drivers</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{totalDrivers}</h3>
              <p className="mt-2 text-xs text-slate-400">Registered captains</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Verified</p>
              <h3 className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{verifiedDrivers}</h3>
              <p className="mt-2 text-xs text-emerald-600">KYC approved</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Review</p>
              <h3 className="mt-3 text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingDrivers}</h3>
              <p className="mt-2 text-xs text-amber-600">Awaiting document check</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Suspended</p>
              <h3 className="mt-3 text-3xl font-bold text-red-600 dark:text-red-400">{suspendedDrivers}</h3>
              <p className="mt-2 text-xs text-red-500">Deactivated accounts</p>
            </div>
          </section>

          {/* Table Card */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            {/* Filter Bar */}
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
              <div className="flex-1">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by driver name, vehicle, number or ID..."
                  className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All">All Verifications</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            {/* Drivers Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="px-6 py-4">Driver</th>
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Trips</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Verification</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDrivers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                        No drivers found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              {driver.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{driver.name}</p>
                              <p className="text-xs text-slate-400">{driver.email} • {driver.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{driver.vehicle}</p>
                          <p className="text-xs text-slate-400">{driver.vehicleNumber}</p>
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold">{driver.rides}</td>
                        <td className="px-6 py-4 text-sm font-semibold">★ {driver.rating}</td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              driver.verification === "Verified"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : driver.verification === "Pending"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                                : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                            }`}
                          >
                            {driver.verification}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              driver.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                            }`}
                          >
                            {driver.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenDriver(driver)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                              Details
                            </button>

                            <button
                              onClick={() => handleToggleStatus(driver.id, driver.rawId)}
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold shadow-2xs transition ${
                                driver.status === "Active"
                                  ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400"
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400"
                              }`}
                            >
                              {driver.status === "Active" ? "Suspend" : "Activate"}
                            </button>
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

      {/* Driver Details Modal */}
      {isModalOpen && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white dark:bg-emerald-600">
                  {selectedDriver.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedDriver.name}</h3>
                  <p className="text-xs text-slate-400">{selectedDriver.id} • Joined {selectedDriver.joined}</p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Email & Phone</p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">{selectedDriver.email}</p>
                <p className="text-xs text-slate-500">{selectedDriver.phone}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Vehicle Info</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selectedDriver.vehicle}</p>
                <p className="text-xs text-slate-500">{selectedDriver.vehicleNumber}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Verification Status</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selectedDriver.verification}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Stats</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">★ {selectedDriver.rating} ({selectedDriver.rides} trips)</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  selectedDriver.status === "Active"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                    : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                }`}
              >
                Status: {selectedDriver.status}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(selectedDriver.id, selectedDriver.rawId)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    selectedDriver.status === "Active"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {selectedDriver.status === "Active" ? "Suspend Driver" : "Activate Driver"}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
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