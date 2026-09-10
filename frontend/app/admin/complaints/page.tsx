"use client";

import { useMemo, useState } from "react";

type ComplaintStatus =
  | "Pending"
  | "In Review"
  | "Resolved"
  | "Rejected";

type Priority = "Low" | "Medium" | "High" | "Critical";

type Complaint = {
  id: string;
  user: string;
  email: string;
  role: "Passenger" | "Driver";
  rideId: string;
  category: "Ride Issue" | "Driver/Passenger" | "Payment" | "Safety";
  subject: string;
  description: string;
  date: string;
  status: ComplaintStatus;
  priority: Priority;
  adminResponse?: string;
};

const initialComplaints: Complaint[] = [
  {
    id: "CMP-3001",
    user: "Ananya Jain",
    email: "ananya.jain@gmail.com",
    role: "Passenger",
    rideId: "RID-5001",
    category: "Safety",
    subject: "Driver was driving too fast",
    description:
      "The driver was driving at a very high speed during the journey. I felt uncomfortable and want the team to review the ride.",
    date: "10 Sep 2026",
    status: "Pending",
    priority: "Critical",
  },
  {
    id: "CMP-3002",
    user: "Priya Mehta",
    email: "priya.mehta@gmail.com",
    role: "Passenger",
    rideId: "RID-5002",
    category: "Payment",
    subject: "Incorrect fare charged",
    description:
      "The final fare shown in my booking was higher than the amount displayed while requesting the ride.",
    date: "09 Sep 2026",
    status: "In Review",
    priority: "High",
    adminResponse: "Payment transaction is being verified.",
  },
  {
    id: "CMP-3003",
    user: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    role: "Driver",
    rideId: "RID-5003",
    category: "Driver/Passenger",
    subject: "Passenger cancelled at pickup",
    description:
      "The passenger cancelled the ride after I reached the pickup location.",
    date: "08 Sep 2026",
    status: "Resolved",
    priority: "Medium",
    adminResponse:
      "Cancellation details were reviewed and the case has been resolved.",
  },
  {
    id: "CMP-3004",
    user: "Neha Gupta",
    email: "neha.gupta@gmail.com",
    role: "Passenger",
    rideId: "RID-5004",
    category: "Ride Issue",
    subject: "Driver arrived late",
    description:
      "The driver arrived around 25 minutes late at the pickup point.",
    date: "07 Sep 2026",
    status: "Rejected",
    priority: "Low",
    adminResponse:
      "The available trip data did not support the complaint.",
  },
  {
    id: "CMP-3005",
    user: "Kavya Joshi",
    email: "kavya.joshi@gmail.com",
    role: "Passenger",
    rideId: "RID-5005",
    category: "Ride Issue",
    subject: "Pickup location mismatch",
    description:
      "The pickup point shown to the passenger was different from the location selected during booking.",
    date: "06 Sep 2026",
    status: "Pending",
    priority: "High",
  },
];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] =
    useState<Complaint[]>(initialComplaints);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);

  const [response, setResponse] = useState("");

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const query = search.toLowerCase();

      const matchesSearch =
        complaint.id.toLowerCase().includes(query) ||
        complaint.user.toLowerCase().includes(query) ||
        complaint.email.toLowerCase().includes(query) ||
        complaint.rideId.toLowerCase().includes(query) ||
        complaint.subject.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        complaint.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        complaint.category === categoryFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        complaint.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesPriority
      );
    });
  }, [
    complaints,
    search,
    statusFilter,
    categoryFilter,
    priorityFilter,
  ]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(
      (c) => c.status === "Pending"
    ).length,
    review: complaints.filter(
      (c) => c.status === "In Review"
    ).length,
    resolved: complaints.filter(
      (c) => c.status === "Resolved"
    ).length,
    rejected: complaints.filter(
      (c) => c.status === "Rejected"
    ).length,
    critical: complaints.filter(
      (c) => c.priority === "Critical"
    ).length,
  };

  const updateComplaint = (
    id: string,
    status: ComplaintStatus,
    adminResponse?: string
  ) => {
    setComplaints((current) =>
      current.map((complaint) =>
        complaint.id === id
          ? {
              ...complaint,
              status,
              adminResponse:
                adminResponse || complaint.adminResponse,
            }
          : complaint
      )
    );

    setSelectedComplaint((current) =>
      current?.id === id
        ? {
            ...current,
            status,
            adminResponse:
              adminResponse || current.adminResponse,
          }
        : current
    );
  };

  const submitResponse = () => {
    if (!selectedComplaint) return;

    if (!response.trim()) {
      alert("Please enter an admin response.");
      return;
    }

    updateComplaint(
      selectedComplaint.id,
      "In Review",
      response.trim()
    );

    setResponse("");
  };

  const resolveComplaint = () => {
    if (!selectedComplaint) return;

    updateComplaint(
      selectedComplaint.id,
      "Resolved",
      response.trim() ||
        selectedComplaint.adminResponse ||
        "Complaint reviewed and resolved by the admin team."
    );

    setResponse("");
  };

  const rejectComplaint = () => {
    if (!selectedComplaint) return;

    updateComplaint(
      selectedComplaint.id,
      "Rejected",
      response.trim() ||
        "Complaint reviewed and rejected by the admin team."
    );

    setResponse("");
  };

  const statusStyle = (status: ComplaintStatus) => {
    switch (status) {
      case "Pending":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "In Review":
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "Resolved":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "Rejected":
        return "border-red-200 bg-red-50 text-red-700";
    }
  };

  const priorityStyle = (priority: Priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "Low":
        return "bg-slate-100 text-slate-600";
    }
  };

  const categoryIcon = (category: Complaint["category"]) => {
    switch (category) {
      case "Safety":
        return "🛡️";
      case "Payment":
        return "💳";
      case "Driver/Passenger":
        return "👥";
      default:
        return "🚗";
    }
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
            <AdminLink href="/admin" icon="📊" text="Dashboard" />

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
                Complaint Management
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
              Complaints & Support
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Review user complaints, investigate issues and
              resolve support cases.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              title="Total"
              value={stats.total}
              description="All complaints"
            />

            <StatCard
              title="Pending"
              value={stats.pending}
              description="Awaiting review"
            />

            <StatCard
              title="In Review"
              value={stats.review}
              description="Currently investigating"
            />

            <StatCard
              title="Resolved"
              value={stats.resolved}
              description="Successfully closed"
            />

            <StatCard
              title="Critical"
              value={stats.critical}
              description="Safety attention"
              danger
            />
          </div>

          {/* Critical Alert */}
          {stats.critical > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-xl">
                  🚨
                </div>

                <div>
                  <h4 className="font-bold text-red-800">
                    Critical complaints require attention
                  </h4>

                  <p className="mt-1 text-sm text-red-700">
                    There {stats.critical === 1 ? "is" : "are"}{" "}
                    {stats.critical} critical safety case
                    {stats.critical === 1 ? "" : "s"} currently
                    present.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
              <div className="relative xl:col-span-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search complaints..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Ride Issue">Ride Issue</option>
                <option value="Driver/Passenger">
                  Driver / Passenger
                </option>
                <option value="Payment">Payment</option>
                <option value="Safety">Safety</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="All">All Priority</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="mt-3">
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setCategoryFilter("All");
                  setPriorityFilter("All");
                }}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Complaints Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h4 className="font-bold">
                  Complaint Cases
                </h4>

                <p className="text-xs text-slate-500">
                  Showing {filteredComplaints.length} cases
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
                      Complaint
                    </th>
                    <th className="px-5 py-4">User</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-5">
                        <p className="font-semibold">
                          {complaint.subject}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {complaint.id} • {complaint.rideId}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-semibold">
                          {complaint.user}
                        </p>

                        <p className="text-xs text-slate-500">
                          {complaint.role}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">
                          <span>
                            {categoryIcon(complaint.category)}
                          </span>

                          <span className="text-sm">
                            {complaint.category}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${priorityStyle(
                            complaint.priority
                          )}`}
                        >
                          {complaint.priority}
                        </span>
                      </td>

                      <td className="px-5 py-5 text-sm text-slate-600">
                        {complaint.date}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(
                            complaint.status
                          )}`}
                        >
                          {complaint.status}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <button
                          onClick={() =>
                            setSelectedComplaint(complaint)
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:bg-slate-50"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredComplaints.length === 0 && (
                <div className="p-12 text-center">
                  <div className="text-4xl">📭</div>

                  <p className="mt-3 font-semibold">
                    No complaints found
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

      {/* Complaint Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Complaint Case
                </p>

                <h3 className="text-xl font-bold">
                  {selectedComplaint.id}
                </h3>
              </div>

              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setResponse("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Subject */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusStyle(
                      selectedComplaint.status
                    )}`}
                  >
                    {selectedComplaint.status}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${priorityStyle(
                      selectedComplaint.priority
                    )}`}
                  >
                    {selectedComplaint.priority} Priority
                  </span>

                  {selectedComplaint.category ===
                    "Safety" && (
                    <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">
                      🛡️ Safety Case
                    </span>
                  )}
                </div>

                <h4 className="mt-4 text-xl font-bold">
                  {selectedComplaint.subject}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* User Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Reported By
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedComplaint.user}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedComplaint.email}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    User Role
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedComplaint.role}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Complaint date: {selectedComplaint.date}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Ride ID
                  </p>

                  <p className="mt-1 font-semibold">
                    {selectedComplaint.rideId}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">
                    Category
                  </p>

                  <p className="mt-1 font-semibold">
                    {categoryIcon(
                      selectedComplaint.category
                    )}{" "}
                    {selectedComplaint.category}
                  </p>
                </div>
              </div>

              {/* Existing Response */}
              {selectedComplaint.adminResponse && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-sm font-bold text-blue-800">
                    Previous Admin Response
                  </p>

                  <p className="mt-2 text-sm leading-6 text-blue-700">
                    {selectedComplaint.adminResponse}
                  </p>
                </div>
              )}

              {/* Admin Response */}
              {selectedComplaint.status !== "Resolved" &&
                selectedComplaint.status !== "Rejected" && (
                  <div>
                    <label className="text-sm font-bold">
                      Admin Response
                    </label>

                    <textarea
                      value={response}
                      onChange={(e) =>
                        setResponse(e.target.value)
                      }
                      rows={4}
                      placeholder="Write a response or investigation note..."
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                    />

                    <button
                      onClick={submitResponse}
                      className="mt-3 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
                    >
                      Save Response
                    </button>
                  </div>
                )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                {selectedComplaint.status !== "Resolved" && (
                  <button
                    onClick={resolveComplaint}
                    className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                  >
                    ✓ Resolve Complaint
                  </button>
                )}

                {selectedComplaint.status !== "Rejected" && (
                  <button
                    onClick={rejectComplaint}
                    className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
                  >
                    ✕ Reject Complaint
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedComplaint(null);
                    setResponse("");
                  }}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold hover:bg-slate-50"
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
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
        active
          ? "bg-slate-900 font-semibold text-white"
          : "text-slate-600 hover:bg-slate-50"
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
}: {
  title: string;
  value: number;
  description: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${
        danger
          ? "border-red-100"
          : "border-slate-200"
      }`}
    >
      <p className="text-sm text-slate-500">{title}</p>

      <p
        className={`mt-2 text-3xl font-bold ${
          danger ? "text-red-600" : ""
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