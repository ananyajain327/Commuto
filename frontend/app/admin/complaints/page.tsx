"use client";

import { useMemo, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

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
    adminResponse: "Payment transaction is being verified with Razorpay gateway logs.",
  },
  {
    id: "CMP-3003",
    user: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    role: "Driver",
    rideId: "RID-5001",
    category: "Driver/Passenger",
    subject: "Passenger did not show up on time",
    description:
      "I waited for over 15 minutes at the designated pickup point but the passenger did not arrive or answer calls.",
    date: "08 Sep 2026",
    status: "Resolved",
    priority: "Medium",
    adminResponse: "No-show policy applied. Driver compensation credited.",
  },
  {
    id: "CMP-3004",
    user: "Karan Singh",
    email: "karan.singh@gmail.com",
    role: "Driver",
    rideId: "RID-5003",
    category: "Payment",
    subject: "Payout settlement delayed",
    description:
      "My weekend ride earnings were not transferred to my bank account as per the usual payout schedule.",
    date: "07 Sep 2026",
    status: "Resolved",
    priority: "High",
    adminResponse: "Bank settlement processed successfully.",
  },
  {
    id: "CMP-3005",
    user: "Neha Sharma",
    email: "neha.sharma@gmail.com",
    role: "Passenger",
    rideId: "RID-5004",
    category: "Ride Issue",
    subject: "Vehicle AC was not working",
    description:
      "The vehicle AC was completely off in peak afternoon heat despite booking an AC ride.",
    date: "06 Sep 2026",
    status: "Pending",
    priority: "Medium",
  },
];

export default function AdminComplaintsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [responseText, setResponseText] = useState("");

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
        statusFilter === "All" || complaint.status === statusFilter;
      const matchesCategory =
        categoryFilter === "All" || complaint.category === categoryFilter;
      const matchesPriority =
        priorityFilter === "All" || complaint.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [complaints, search, statusFilter, categoryFilter, priorityFilter]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    review: complaints.filter((c) => c.status === "In Review").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
    critical: complaints.filter((c) => c.priority === "Critical").length,
  };

  const updateComplaint = (id: string, status: ComplaintStatus, adminResp?: string) => {
    setComplaints((current) =>
      current.map((c) =>
        c.id === id
          ? { ...c, status, adminResponse: adminResp || c.adminResponse }
          : c
      )
    );

    setSelectedComplaint((current) =>
      current?.id === id
        ? { ...current, status, adminResponse: adminResp || current.adminResponse }
        : current
    );
  };

  const handleSendResponse = () => {
    if (!selectedComplaint || !responseText.trim()) return;
    updateComplaint(selectedComplaint.id, "Resolved", responseText.trim());
    setResponseText("");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <AdminHeader
          title="Complaints & Support Center"
          subtitle="Review and resolve passenger disputes, driver grievances and ride incidents"
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Complaints" }]}
        />

        {/* Content */}
        <div className="space-y-8 px-6 py-8">
          {/* Top Summary Cards */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tickets</p>
              <h3 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</h3>
              <p className="mt-2 text-xs text-slate-400">All submitted complaints</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Review</p>
              <h3 className="mt-3 text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</h3>
              <p className="mt-2 text-xs text-amber-600">Awaiting admin response</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Critical Priority</p>
              <h3 className="mt-3 text-3xl font-bold text-red-600 dark:text-red-400">{stats.critical}</h3>
              <p className="mt-2 text-xs text-red-500">Urgent attention needed</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Resolved</p>
              <h3 className="mt-3 text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.resolved}</h3>
              <p className="mt-2 text-xs text-emerald-600">Successfully closed</p>
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
                  placeholder="Search complaint ID, user, subject or ride..."
                  className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Ride Issue">Ride Issue</option>
                  <option value="Driver/Passenger">Driver/Passenger</option>
                  <option value="Payment">Payment</option>
                  <option value="Safety">Safety</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All">All Priorities</option>
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
                  <option value="Pending">Pending</option>
                  <option value="In Review">In Review</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Complaints Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                    <th className="px-6 py-4">Ticket</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Subject & Category</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                        No complaints found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 dark:text-white">{item.id}</p>
                          <p className="text-xs text-slate-400">{item.date}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.user}</p>
                          <p className="text-xs text-slate-400">{item.role} • {item.rideId}</p>
                        </td>

                        <td className="px-6 py-4 max-w-xs">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.subject}</p>
                          <p className="text-xs text-slate-400">{item.category}</p>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              item.priority === "Critical"
                                ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                                : item.priority === "High"
                                ? "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                            }`}
                          >
                            {item.priority}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              item.status === "Resolved"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                                : item.status === "In Review"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                                : item.status === "Rejected"
                                ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedComplaint(item)}
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                          >
                            Review & Reply
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

      {/* Complaint Detail / Action Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ticket • {selectedComplaint.id}</h3>
                <p className="text-xs text-slate-400">{selectedComplaint.date} • {selectedComplaint.user} ({selectedComplaint.role})</p>
              </div>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Subject & Category</p>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">{selectedComplaint.subject}</p>
                <p className="text-xs text-slate-500">{selectedComplaint.category} • Related to {selectedComplaint.rideId}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
                <p className="text-xs text-slate-400">Description</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.adminResponse && (
                <div className="rounded-2xl bg-emerald-50 p-3.5 dark:bg-emerald-950/40">
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Previous Admin Response</p>
                  <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">{selectedComplaint.adminResponse}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Admin Action / Resolution Response</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter response or resolution message to the user..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500">
                Status: {selectedComplaint.status}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={handleSendResponse}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Resolve Ticket
                </button>
                <button
                  onClick={() => setSelectedComplaint(null)}
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