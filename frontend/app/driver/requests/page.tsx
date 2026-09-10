"use client";

import { useState } from "react";

type RequestStatus = "pending" | "accepted" | "rejected";

type RideRequest = {
  id: number;
  initials: string;
  name: string;
  rating: string;
  rides: number;
  route: string;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  fare: number;
  verified: boolean;
  womenOnly: boolean;
};

const initialRequests: RideRequest[] = [
  {
    id: 1,
    initials: "RK",
    name: "Riya Kapoor",
    rating: "4.9",
    rides: 42,
    route: "Jaipur → Ajmer",
    pickup: "Jaipur Railway Station",
    destination: "Ajmer Bus Stand",
    date: "12 September 2026",
    time: "6:30 PM",
    seats: 1,
    fare: 280,
    verified: true,
    womenOnly: false,
  },
  {
    id: 2,
    initials: "NS",
    name: "Neha Singh",
    rating: "5.0",
    rides: 31,
    route: "Jaipur → Ajmer",
    pickup: "Tonk Road",
    destination: "Ajmer City",
    date: "13 September 2026",
    time: "8:00 AM",
    seats: 2,
    fare: 560,
    verified: true,
    womenOnly: true,
  },
  {
    id: 3,
    initials: "MS",
    name: "Mohit Sharma",
    rating: "4.7",
    rides: 18,
    route: "Jaipur → Kishangarh",
    pickup: "Malviya Nagar",
    destination: "Kishangarh",
    date: "13 September 2026",
    time: "7:00 PM",
    seats: 1,
    fare: 220,
    verified: true,
    womenOnly: false,
  },
];

export default function DriverRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [activeTab, setActiveTab] = useState<"pending" | "history">(
    "pending"
  );

  const [statuses, setStatuses] = useState<
    Record<number, RequestStatus>
  >({});

  const handleAction = (
    id: number,
    status: "accepted" | "rejected"
  ) => {
    setStatuses((previous) => ({
      ...previous,
      [id]: status,
    }));
  };

  const pendingRequests = requests.filter(
    (request) => !statuses[request.id]
  );

  const historyRequests = requests.filter(
    (request) => statuses[request.id]
  );

  const visibleRequests =
    activeTab === "pending" ? pendingRequests : historyRequests;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Ride Requests</h1>
            <p className="mt-1 text-sm text-slate-500">
              Review passenger requests and manage your upcoming rides.
            </p>
          </div>

          <a
            href="/driver/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            ← Driver Dashboard
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="New Requests"
            value={pendingRequests.length.toString()}
            icon="🔔"
          />

          <SummaryCard
            title="Accepted"
            value={
              Object.values(statuses).filter(
                (status) => status === "accepted"
              ).length.toString()
            }
            icon="✓"
          />

          <SummaryCard
            title="Rejected"
            value={
              Object.values(statuses).filter(
                (status) => status === "rejected"
              ).length.toString()
            }
            icon="×"
          />

          <SummaryCard
            title="Potential Earnings"
            value={`₹${pendingRequests.reduce(
              (total, request) => total + request.fare,
              0
            )}`}
            icon="₹"
          />
        </section>

        {/* Tabs */}
        <section className="mt-8 flex items-center justify-between border-b border-slate-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("pending")}
              className={`border-b-2 pb-3 text-sm font-semibold ${
                activeTab === "pending"
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500"
              }`}
            >
              New Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`border-b-2 pb-3 text-sm font-semibold ${
                activeTab === "history"
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500"
              }`}
            >
              Request History
            </button>
          </div>
        </section>

        {/* Requests */}
        <section className="mt-6">
          {visibleRequests.length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            <div className="space-y-5">
              {visibleRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  status={statuses[request.id]}
                  onAction={handleAction}
                />
              ))}
            </div>
          )}
        </section>

        {/* Safety Note */}
        <section className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
          <div className="flex gap-4">
            <span className="text-2xl">🛡️</span>

            <div>
              <h2 className="font-semibold text-indigo-900">
                Driver Safety Reminder
              </h2>

              <p className="mt-1 text-sm leading-6 text-indigo-700">
                Review passenger details before accepting a request. Never
                share sensitive information and use Commuto's safety tools
                whenever necessary.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- Request Card ---------- */

function RequestCard({
  request,
  status,
  onAction,
}: {
  request: RideRequest;
  status?: RequestStatus;
  onAction: (
    id: number,
    status: "accepted" | "rejected"
  ) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      {/* Top */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
            {request.initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">{request.name}</h2>

              {request.verified && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  ✓ Verified Passenger
                </span>
              )}

              {request.womenOnly && (
                <span className="rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-700">
                  ♀ Women Preference
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>★ {request.rating}</span>
              <span>{request.rides} rides</span>
              <span>Passenger</span>
            </div>
          </div>
        </div>

        {/* Status */}
        {status && (
          <span
            className={`h-fit rounded-full px-4 py-2 text-xs font-semibold ${
              status === "accepted"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {status === "accepted"
              ? "✓ Accepted"
              : "× Rejected"}
          </span>
        )}
      </div>

      {/* Route */}
      <div className="mt-6 rounded-xl bg-slate-50 p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Requested Route
            </p>

            <p className="mt-2 text-lg font-bold">
              {request.route}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            <div>
              <p className="text-xs text-slate-400">Date</p>
              <p className="mt-1 font-medium">{request.date}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Departure</p>
              <p className="mt-1 font-medium">{request.time}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Seats</p>
              <p className="mt-1 font-medium">
                {request.seats}
              </p>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Location
            color="bg-indigo-600"
            title="Pickup"
            value={request.pickup}
          />

          <Location
            color="bg-emerald-500"
            title="Destination"
            value={request.destination}
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs text-slate-400">
            Passenger Fare
          </p>

          <p className="mt-1 text-2xl font-bold text-indigo-700">
            ₹{request.fare}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Estimated earning from this request
          </p>
        </div>

        {!status && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() =>
                onAction(request.id, "rejected")
              }
              className="rounded-xl border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Reject
            </button>

            <button
              onClick={() =>
                onAction(request.id, "accepted")
              }
              className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Accept Request
            </button>
          </div>
        )}

        {status === "accepted" && (
          <button className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white">
            View Booking →
          </button>
        )}

        {status === "rejected" && (
          <span className="text-sm text-slate-400">
            This request has been rejected.
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------- Location ---------- */

function Location({
  color,
  title,
  value,
}: {
  color: string;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-3 w-3 rounded-full ${color}`} />

      <div>
        <p className="text-xs text-slate-400">{title}</p>
        <p className="mt-1 text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

/* ---------- Summary ---------- */

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold">{value}</p>
    </div>
  );
}

/* ---------- Empty State ---------- */

function EmptyState({
  activeTab,
}: {
  activeTab: "pending" | "history";
}) {
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
        {activeTab === "pending" ? "✓" : "📋"}
      </div>

      <h2 className="mt-5 text-lg font-semibold">
        {activeTab === "pending"
          ? "No new ride requests"
          : "No request history"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {activeTab === "pending"
          ? "You're all caught up! New passenger requests will appear here."
          : "Your accepted and rejected requests will appear here."}
      </p>

      <a
        href="/driver/dashboard"
        className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Back to Dashboard
      </a>
    </div>
  );
}