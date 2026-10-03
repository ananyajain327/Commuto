"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { apiUrl } from "@/lib/api";

type Role = "Passenger" | "Driver" | "Admin";
type Status = "Active" | "Suspended";

type User = {
  id: string;
  rawId?: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
  rides: number;
  rating: number;
  joined: string;
  status: Status;
};

const initialUsers: User[] = [
  {
    id: "USR-1001",
    rawId: 1,
    name: "Ananya Jain",
    email: "ananya@example.com",
    phone: "+91 98765 43210",
    role: "Passenger",
    rides: 28,
    rating: 4.9,
    joined: "12 Jan 2026",
    status: "Active",
  },
  {
    id: "USR-1002",
    rawId: 2,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98234 56781",
    role: "Driver",
    rides: 156,
    rating: 4.8,
    joined: "04 Dec 2025",
    status: "Active",
  },
  {
    id: "USR-1003",
    rawId: 3,
    name: "Priya Mehta",
    email: "priya@example.com",
    phone: "+91 97654 32109",
    role: "Passenger",
    rides: 42,
    rating: 4.7,
    joined: "18 Feb 2026",
    status: "Active",
  },
  {
    id: "USR-1004",
    rawId: 4,
    name: "Aman Verma",
    email: "aman@example.com",
    phone: "+91 98123 45670",
    role: "Driver",
    rides: 94,
    rating: 4.6,
    joined: "27 Jan 2026",
    status: "Active",
  },
  {
    id: "USR-1005",
    rawId: 5,
    name: "Riya Gupta",
    email: "riya@example.com",
    phone: "+91 98987 65432",
    role: "Passenger",
    rides: 19,
    rating: 4.5,
    joined: "02 Mar 2026",
    status: "Suspended",
  },
  {
    id: "USR-1006",
    rawId: 6,
    name: "Karan Singh",
    email: "karan@example.com",
    phone: "+91 97531 86420",
    role: "Driver",
    rides: 121,
    rating: 4.9,
    joined: "14 Nov 2025",
    status: "Active",
  },
  {
    id: "USR-1007",
    rawId: 7,
    name: "Neha Sharma",
    email: "neha@example.com",
    phone: "+91 98712 34567",
    role: "Passenger",
    rides: 36,
    rating: 4.8,
    joined: "21 Feb 2026",
    status: "Active",
  },
  {
    id: "USR-1008",
    rawId: 8,
    name: "Vivek Jain",
    email: "vivek@example.com",
    phone: "+91 98321 09876",
    role: "Driver",
    rides: 77,
    rating: 4.7,
    joined: "09 Jan 2026",
    status: "Active",
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

export default function AdminUsersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(apiUrl("/api/admin/users"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok && isCurrent) {
          const data = (await res.json()) as BackendUser[];
          if (data && data.length > 0) {
            const mapped: User[] = data.map((u) => ({
              id: `USR-${u.id}`,
              rawId: u.id,
              name: u.fullName,
              email: u.email,
              phone: u.phone || "+91 ••••• •••••",
              role: u.role === "DRIVER" ? "Driver" : u.role === "ADMIN" ? "Admin" : "Passenger",
              rides: u.role === "DRIVER" ? 12 : 5,
              rating: 4.8,
              joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent",
              status: u.active ? "Active" : "Suspended",
            }));
            setUsers(mapped);
          }
        }
      } catch {
        // Fall back gracefully to mock initialUsers
      }
    };

    void fetchUsers();
    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.phone.includes(search) ||
        user.id.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleOpenUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: string, rawId?: number) => {
    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === "Active" ? "Suspended" : "Active",
            }
          : u
      )
    );

    if (selectedUser && selectedUser.id === id) {
      setSelectedUser((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "Active" ? "Suspended" : "Active",
            }
          : null
      );
    }

    // Call backend if rawId is present
    const targetRawId = rawId || (id.startsWith("USR-") ? Number(id.replace("USR-", "")) : null);
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

  const totalUsers = users.length;
  const passengers = users.filter((u) => u.role === "Passenger").length;
  const drivers = users.filter((u) => u.role === "Driver").length;
  const suspended = users.filter((u) => u.status === "Suspended").length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <AdminHeader
          title="Users Management"
          subtitle="View, filter, inspect and manage Commuto riders and drivers"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Users" }]}
        />

        {/* Content */}
        <div className="space-y-8 px-6 py-8">
          {/* Top Summary Cards */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Registered</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{totalUsers}</h3>
              <p className="mt-2 text-xs text-slate-400">Across all roles</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Passengers</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{passengers}</h3>
              <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">Rider accounts</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Drivers</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{drivers}</h3>
              <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">Publishers & Captains</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Suspended</p>
              <h3 className="mt-3 text-3xl font-bold text-red-600 dark:text-red-400">{suspended}</h3>
              <p className="mt-2 text-xs text-red-500">Action required</p>
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
                  placeholder="Search by name, email, phone, or ID..."
                  className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All">All Roles</option>
                  <option value="Passenger">Passengers</option>
                  <option value="Driver">Drivers</option>
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

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Rides</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                              <p className="text-xs text-slate-400">{user.email} • {user.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              user.role === "Driver"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                                : user.role === "Admin"
                                ? "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{user.phone}</td>
                        <td className="px-6 py-4 text-sm font-semibold">{user.rides}</td>
                        <td className="px-6 py-4 text-sm font-semibold">★ {user.rating}</td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              user.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenUser(user)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                              View
                            </button>

                            <button
                              onClick={() => handleToggleStatus(user.id, user.rawId)}
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold shadow-2xs transition ${
                                user.status === "Active"
                                  ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400"
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400"
                              }`}
                            >
                              {user.status === "Active" ? "Suspend" : "Activate"}
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

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white dark:bg-emerald-600">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-400">{selectedUser.id} • Joined {selectedUser.joined}</p>
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
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">{selectedUser.email}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Phone</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selectedUser.phone}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Role</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selectedUser.role}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Rating & Rides</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">★ {selectedUser.rating} ({selectedUser.rides} rides)</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  selectedUser.status === "Active"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                    : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                }`}
              >
                Status: {selectedUser.status}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(selectedUser.id, selectedUser.rawId)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    selectedUser.status === "Active"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {selectedUser.status === "Active" ? "Suspend Account" : "Activate Account"}
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
