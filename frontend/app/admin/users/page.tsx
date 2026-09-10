"use client";

import { useMemo, useState } from "react";

type Role = "Passenger" | "Driver";
type Status = "Active" | "Suspended";

type User = {
  id: string;
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
    name: "Vivek Jain",
    email: "vivek@example.com",
    phone: "+91 99123 45678",
    role: "Driver",
    rides: 73,
    rating: 4.4,
    joined: "09 Mar 2026",
    status: "Suspended",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.id.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const toggleStatus = (id: string) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Suspended" : "Active",
            }
          : user
      )
    );

    if (selectedUser?.id === id) {
      setSelectedUser((current) =>
        current
          ? {
              ...current,
              status:
                current.status === "Active" ? "Suspended" : "Active",
            }
          : null
      );
    }
  };

  const totalUsers = users.length;
  const passengers = users.filter((user) => user.role === "Passenger").length;
  const drivers = users.filter((user) => user.role === "Driver").length;
  const suspended = users.filter((user) => user.status === "Suspended").length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-slate-100 px-6 py-6">
            <a href="/admin" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
                C
              </div>

              <div>
                <p className="text-lg font-bold">Commuto</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Admin Panel
                </p>
              </div>
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            <a
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              📊
              Dashboard
            </a>

            <a
              href="/admin/users"
              className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white"
            >
              👥
              Users
            </a>

            {[
              ["🚗", "Drivers"],
              ["🛣️", "Rides"],
              ["📋", "Complaints"],
              ["✅", "Verifications"],
              ["📈", "Analytics"],
              ["🚨", "Reports"],
            ].map(([icon, title]) => (
              <button
                key={title}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <span>{icon}</span>
                {title}
              </button>
            ))}
          </nav>

          {/* Admin Profile */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                A
              </div>

              <div>
                <p className="text-sm font-semibold">Commuto Admin</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <a href="/admin" className="hover:text-slate-700">
                  Admin
                </a>
                <span>/</span>
                <span>Users</span>
              </div>

              <h1 className="mt-2 text-2xl font-bold">
                User Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage passengers and drivers registered on Commuto.
              </p>
            </div>

            <button className="w-fit rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              + Add User
            </button>
          </div>
        </header>

        <div className="space-y-7 px-6 py-8">
          {/* Stats */}
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon="👥"
              title="Total Users"
              value={totalUsers.toString()}
              subtitle="Registered users"
            />

            <StatCard
              icon="🧑"
              title="Passengers"
              value={passengers.toString()}
              subtitle="Active passenger accounts"
            />

            <StatCard
              icon="🚗"
              title="Drivers"
              value={drivers.toString()}
              subtitle="Registered drivers"
            />

            <StatCard
              icon="⛔"
              title="Suspended"
              value={suspended.toString()}
              subtitle="Accounts requiring attention"
            />
          </section>

          {/* Search and Filters */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email or user ID..."
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-slate-900"
                />
              </div>

              {/* Role */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-slate-900"
              >
                <option value="All">All Roles</option>
                <option value="Passenger">Passenger</option>
                <option value="Driver">Driver</option>
              </select>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-slate-900"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing {filteredUsers.length} of {users.length} users
              </p>

              {(search || roleFilter !== "All" || statusFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("All");
                    setStatusFilter("All");
                  }}
                  className="text-xs font-semibold text-slate-700 hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </section>

          {/* Users Table */}
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h2 className="text-lg font-bold">All Users</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review and manage user accounts.
                </p>
              </div>

              <button className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 sm:block">
                Export
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Rides</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-16 text-center"
                      >
                        <div className="text-3xl">🔍</div>
                        <p className="mt-3 font-semibold">
                          No users found
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Try changing your search or filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
                      >
                        {/* User */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-bold">
                              {user.name.charAt(0)}
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                {user.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {user.email}
                              </p>

                              <p className="mt-1 text-[10px] font-medium text-slate-400">
                                {user.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              user.role === "Driver"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-violet-50 text-violet-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Rides */}
                        <td className="px-6 py-5 text-sm font-semibold">
                          {user.rides}
                        </td>

                        {/* Rating */}
                        <td className="px-6 py-5">
                          <span className="text-sm font-semibold">
                            ⭐ {user.rating}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-5 text-sm text-slate-500">
                          {user.joined}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              user.status === "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-white"
                            >
                              View
                            </button>

                            <button
                              onClick={() => toggleStatus(user.id)}
                              className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                                user.status === "Active"
                                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              {user.status === "Active"
                                ? "Suspend"
                                : "Activate"}
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

          {/* Info */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                ℹ️
              </div>

              <div>
                <h3 className="font-bold">Admin access</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  User suspension and account management actions are currently
                  running in demo mode. They will be connected to the Commuto
                  backend and database during integration.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                  {selectedUser.name.charAt(0)}
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    {selectedUser.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedUser.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            {/* Details */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Detail label="Email" value={selectedUser.email} />
              <Detail label="Phone" value={selectedUser.phone} />
              <Detail label="Role" value={selectedUser.role} />
              <Detail label="Joined" value={selectedUser.joined} />
              <Detail
                label="Total Rides"
                value={selectedUser.rides.toString()}
              />
              <Detail
                label="Rating"
                value={`⭐ ${selectedUser.rating}`}
              />
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Account Status
                </span>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    selectedUser.status === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {selectedUser.status}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => toggleStatus(selectedUser.id)}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold ${
                  selectedUser.status === "Active"
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {selectedUser.status === "Active"
                  ? "Suspend User"
                  : "Activate User"}
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-3 text-3xl font-bold">{value}</h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl">
          {icon}
        </div>
      </div>

      <p className="mt-5 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold">{value}</p>
    </div>
  );
}
