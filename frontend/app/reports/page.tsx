"use client";

import { useState } from "react";

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
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "Under Review") {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-red-50 text-red-700";
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Reports & Complaints</h1>
            <p className="mt-1 text-sm text-slate-500">
              Report an issue and track your support requests
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            ← Dashboard
          </a>
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
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl transition group-hover:bg-slate-900 group-hover:text-white">
                  {item.icon}
                </div>

                <h3 className="mt-5 font-bold">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>

                <p className="mt-5 text-sm font-semibold">
                  Report issue →
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* My Complaints */}
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold">My Complaints</h2>
              <p className="mt-1 text-sm text-slate-500">
                Track the status of your submitted reports.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              + New Complaint
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {complaints.map((complaint) => (
              <div
                key={complaint.id}
                className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    📋
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{complaint.subject}</h3>

                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {complaint.category}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
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
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-2xl">⏱️</div>
            <h3 className="mt-4 font-bold">Quick Response</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Most complaints are reviewed within 24 hours.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-2xl">🔍</div>
            <h3 className="mt-4 font-bold">Transparent Tracking</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Track every complaint from submission to resolution.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-2xl">🤝</div>
            <h3 className="mt-4 font-bold">Fair Resolution</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Our team reviews reports fairly using ride and payment data.
            </p>
          </div>
        </section>
      </div>

      {/* Complaint Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 py-8">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">Submit a Complaint</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Tell us what happened and we&apos;ll look into it.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* Category */}
              <div>
                <label className="text-sm font-semibold">
                  Complaint Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-slate-900"
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
                <label className="text-sm font-semibold">
                  Ride / Booking ID
                </label>

                <input
                  value={rideId}
                  onChange={(e) => setRideId(e.target.value)}
                  placeholder="e.g. RID-28491"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3.5 outline-none focus:border-slate-900"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-semibold">
                  Complaint Subject
                </label>

                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Briefly describe the issue"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3.5 outline-none focus:border-slate-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold">
                  What happened?
                </label>

                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Please provide as much detail as possible..."
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3.5 outline-none focus:border-slate-900"
                />
              </div>

              {/* Evidence */}
              <div>
                <label className="text-sm font-semibold">
                  Evidence / Attachment
                </label>

                <div className="mt-2 rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-slate-400">
                  <div className="text-2xl">📎</div>

                  <p className="mt-2 text-sm font-semibold">
                    Upload supporting evidence
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Images, receipts or screenshots
                  </p>

                  <input
                    type="file"
                    className="mx-auto mt-4 block max-w-full text-xs"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
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