"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

type ComplaintStatus = "Open" | "Under Review" | "Resolved";

type Complaint = {
  id: string;
  subject: string;
  category: string;
  date: string;
  status: ComplaintStatus;
};

export default function ReportsPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "CMP-1042",
      subject: "Driver arrived at a different pickup point",
      category: "Ride Issue",
      date: "08 Sep 2026",
      status: "Under Review",
    },
    {
      id: "CMP-0987",
      subject: "Fare amount was different from estimate",
      category: "Payment",
      date: "03 Sep 2026",
      status: "Resolved",
    },
    {
      id: "CMP-0914",
      subject: "Vehicle details did not match",
      category: "Safety",
      date: "28 Aug 2026",
      status: "Open",
    },
  ]);

  const [category, setCategory] = useState("Ride Issue");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [rideId, setRideId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !description) return;

    const newComplaint: Complaint = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      category,
      date: "10 Sep 2026",
      status: "Open",
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    setSubject("");
    setDescription("");
    setRideId("");
    setCategory("Ride Issue");

    setSubmitted(true);
    setShowForm(false);

    setTimeout(() => setSubmitted(false), 3500);
  };

  const statusStyle = (status: ComplaintStatus) => {
    if (status === "Resolved") {
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
    }

    if (status === "Under Review") {
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    }

    return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 sticky top-0 z-20 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Reports & Complaints</h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Report an issue and track your support requests
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              ← Dashboard
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Success */}
        {submitted && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <p className="font-semibold text-emerald-700">
              ✓ Complaint submitted successfully
            </p>
            <p className="mt-1 text-sm text-emerald-600">
              Our support team will review your complaint shortly.
            </p>
          </div>
        )}

        {/* Emergency Banner */}
        <section className="rounded-3xl border border-red-100 bg-red-50 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-xl">
                🚨
              </div>

              <div>
                <h2 className="font-bold text-red-800">
                  Facing an emergency?
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-red-700">
                  For immediate safety concerns during an active ride, use
                  Commuto&apos;s Safety Center instead of waiting for a
                  complaint response.
                </p>
              </div>
            </div>

            <a
              href="/safety"
              className="w-fit rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700"
            >
              Open Safety Center
            </a>
          </div>
        </section>

        {/* Report Categories */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold">What would you like to report?</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose the category that best matches your issue.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "🚕",
                title: "Ride Issue",
                text: "Pickup, route or ride problems",
              },
              {
                icon: "👤",
                title: "Driver / Passenger",
                text: "Behaviour or conduct concerns",
              },
              {
                icon: "💳",
                title: "Payment",
                text: "Fare or transaction problems",
              },
              {
                icon: "🛡️",
                title: "Safety",
                text: "Safety or verification concerns",
              },
            ].map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  setCategory(item.title);
                  setShowForm(true);
                }}
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-600 cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl transition group-hover:bg-emerald-600 group-hover:text-white dark:bg-slate-800">
                  {item.icon}
                </div>

                <h3 className="mt-5 font-black text-slate-900 dark:text-slate-100">{item.title}</h3>

                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  {item.text}
                </p>

                <p className="mt-5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Report issue →
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* My Complaints */}
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 dark:border-slate-800 p-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">My Complaints</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Track the status of your submitted reports.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-500 cursor-pointer shadow-md"
            >
              + New Complaint
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-xl">
                    📋
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 dark:text-slate-100">{complaint.subject}</h3>

                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                        {complaint.category}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      {complaint.id} • Submitted {complaint.date}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(
                    complaint.status
                  )}`}
                >
                  {complaint.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Support Information */}
        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-2xl">⏱️</div>
            <h3 className="mt-4 font-black text-slate-900 dark:text-slate-100">Quick Response</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Most complaints are reviewed within 24 hours.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-2xl">🔍</div>
            <h3 className="mt-4 font-black text-slate-900 dark:text-slate-100">Transparent Tracking</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Track every complaint from submission to resolution.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-2xl">🤝</div>
            <h3 className="mt-4 font-black text-slate-900 dark:text-slate-100">Fair Resolution</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Our team reviews reports fairly using ride and payment data.
            </p>
          </div>
        </section>
      </div>

      {/* Complaint Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-5 py-8">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">Submit a Complaint</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Tell us what happened and we&apos;ll look into it.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* Category */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Complaint Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option>Ride Issue</option>
                  <option>Driver / Passenger</option>
                  <option>Payment</option>
                  <option>Safety</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Ride ID */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Ride / Booking ID
                </label>

                <input
                  value={rideId}
                  onChange={(e) => setRideId(e.target.value)}
                  placeholder="e.g. RID-28491"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Complaint Subject
                </label>

                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Briefly describe the issue"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  What happened?
                </label>

                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Please provide as much detail as possible..."
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              {/* Evidence */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Evidence / Attachment
                </label>

                <div className="mt-2 rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-emerald-400 dark:border-slate-800 dark:hover:border-emerald-600">
                  <div className="text-2xl">📎</div>

                  <p className="mt-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                    Upload supporting evidence
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Images, receipts or screenshots
                  </p>

                  <input
                    type="file"
                    className="mx-auto mt-4 block max-w-full text-xs text-slate-500 dark:text-slate-400"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-extrabold text-white hover:bg-emerald-500 cursor-pointer shadow-md"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}