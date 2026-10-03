"use client";

import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { apiUrl } from "@/lib/api";

type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

interface Passenger {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
}

interface RideSummary {
  id: number;
  startLocation: string;
  destination: string;
  rideDate: string;
  departureTime: string;
  availableSeats: number;
}

interface BackendRideRequest {
  id: number;
  seatsRequested: number;
  pickupPreference: string;
  note: string;
  fare: number;
  status: RequestStatus;
  createdAt: string;
  passenger: Passenger;
  ride: RideSummary;
}

export default function DriverRequestsPage() {
  const [requests, setRequests] = useState<BackendRideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const fetchDriverRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        await Promise.resolve();
        setErrorMessage("Please login as a driver to view requests.");
        setLoading(false);
        return;
      }

      // Step 1: Fetch all rides published by this driver
      const ridesRes = await fetch(apiUrl("/api/rides/my-rides"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!ridesRes.ok) {
        throw new Error("Failed to fetch driver rides");
      }

      const ridesData: RideSummary[] = await ridesRes.json();

      // Step 2: Fetch all requests for each ride
      const allRequests: BackendRideRequest[] = [];
      for (const ride of ridesData) {
        const reqRes = await fetch(
          apiUrl(`/api/ride-requests/ride/${ride.id}`),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (reqRes.ok) {
          const reqData: BackendRideRequest[] = await reqRes.json();
          allRequests.push(...reqData);
        }
      }

      // Sort newest first
      allRequests.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setRequests(allRequests);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => void fetchDriverRequests());

    const token = localStorage.getItem("token");
    if (!token) return;

    let client: Client | null = null;
    try {
      client = new Client({
        webSocketFactory: () => new SockJS(apiUrl("/ws")) as unknown as WebSocket,
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        onConnect: () => {
          client?.subscribe("/topic/driver/requests", () => {
            void fetchDriverRequests();
            setSuccessMessage("🔔 New ride request received in real time!");
          });
        },
      });
      client.activate();
    } catch {
      // Graceful fallback to regular refresh
    }

    return () => {
      if (client) {
        void client.deactivate();
      }
    };
  }, []);

  const handleAction = async (id: number, action: "accept" | "reject") => {
    try {
      setActionLoadingId(id);
      setErrorMessage("");
      setSuccessMessage("");
      const token = localStorage.getItem("token");

      const res = await fetch(
        apiUrl(`/api/ride-requests/${id}/${action}`),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.message || `Failed to ${action} ride request.`
        );
      }

      setSuccessMessage(
        `Request ${action === "accept" ? "Accepted" : "Rejected"} successfully!`
      );

      // Update local state
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? { ...req, status: action === "accept" ? "ACCEPTED" : "REJECTED" }
            : req
        )
      );
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const acceptedRequests = requests.filter((r) => r.status === "ACCEPTED");
  const rejectedRequests = requests.filter((r) => r.status === "REJECTED");
  const historyRequests = requests.filter((r) => r.status !== "PENDING");

  const visibleRequests =
    activeTab === "pending" ? pendingRequests : historyRequests;

  const potentialEarnings = pendingRequests.reduce(
    (sum, r) => sum + (r.fare || 0),
    0
  );

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
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            {successMessage}
          </div>
        )}

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="New Requests"
            value={pendingRequests.length.toString()}
            icon="🔔"
          />

          <SummaryCard
            title="Accepted"
            value={acceptedRequests.length.toString()}
            icon="✓"
          />

          <SummaryCard
            title="Rejected"
            value={rejectedRequests.length.toString()}
            icon="×"
          />

          <SummaryCard
            title="Potential Earnings"
            value={`₹${Math.round(potentialEarnings)}`}
            icon="₹"
          />
        </section>

        {/* Tabs */}
        <section className="mt-8 flex items-center justify-between border-b border-slate-200">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("pending")}
              className={`border-b-2 pb-3 text-sm font-semibold transition ${
                activeTab === "pending"
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
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
              className={`border-b-2 pb-3 text-sm font-semibold transition ${
                activeTab === "history"
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Request History
              {historyRequests.length > 0 && (
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                  {historyRequests.length}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Requests List */}
        <section className="mt-6">
          {loading ? (
            <div className="rounded-2xl bg-white p-12 text-center text-slate-500">
              Loading requests...
            </div>
          ) : visibleRequests.length === 0 ? (
            <EmptyState activeTab={activeTab} />
          ) : (
            <div className="space-y-5">
              {visibleRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  isActionLoading={actionLoadingId === request.id}
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
                Review passenger details before accepting a request. Never share
                sensitive information and use Commuto&apos;s safety tools whenever
                necessary.
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
  isActionLoading,
  onAction,
}: {
  request: BackendRideRequest;
  isActionLoading: boolean;
  onAction: (id: number, action: "accept" | "reject") => void;
}) {
  const passengerName = request.passenger?.fullName || "Commuto Passenger";
  const initials = passengerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 border border-slate-200">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-5 lg:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
            {initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">{passengerName}</h2>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                ✓ Verified Passenger
              </span>
            </div>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>✉ {request.passenger?.email}</span>
              {request.passenger?.phone && <span>📞 {request.passenger.phone}</span>}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {request.status !== "PENDING" && (
          <span
            className={`h-fit rounded-full px-4 py-2 text-xs font-semibold ${
              request.status === "ACCEPTED"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {request.status === "ACCEPTED" ? "✓ Accepted" : "× Rejected"}
          </span>
        )}
      </div>

      {/* Route & Ride Details */}
      <div className="mt-6 rounded-xl bg-slate-50 p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Requested Ride Route
            </p>

            <p className="mt-2 text-lg font-bold">
              {request.ride?.startLocation} → {request.ride?.destination}
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            <div>
              <p className="text-xs text-slate-400">Date</p>
              <p className="mt-1 font-medium">{request.ride?.rideDate}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Departure</p>
              <p className="mt-1 font-medium">{request.ride?.departureTime}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Seats Requested</p>
              <p className="mt-1 font-semibold text-indigo-700">
                {request.seatsRequested} Seat(s)
              </p>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Location
            color="bg-indigo-600"
            title="Pickup Preference"
            value={request.pickupPreference || request.ride?.startLocation || "Main Point"}
          />

          <Location
            color="bg-emerald-500"
            title="Destination"
            value={request.ride?.destination || "Drop Location"}
          />
        </div>

        {request.note && (
          <div className="mt-4 rounded-lg bg-white p-3 text-xs text-slate-600 border border-slate-200">
            <span className="font-semibold text-slate-800">Passenger Note: </span>
            {request.note}
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div className="mt-5 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs text-slate-400">Passenger Fare</p>

          <p className="mt-1 text-2xl font-bold text-indigo-700">
            ₹{Math.round(request.fare)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Earning from this passenger
          </p>
        </div>

        {request.status === "PENDING" && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              disabled={isActionLoading}
              onClick={() => onAction(request.id, "reject")}
              className="rounded-xl border border-red-200 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {isActionLoading ? "Processing..." : "Reject"}
            </button>

            <button
              disabled={isActionLoading}
              onClick={() => onAction(request.id, "accept")}
              className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isActionLoading ? "Processing..." : "Accept Request"}
            </button>
          </div>
        )}

        {request.status === "ACCEPTED" && (
          <span className="text-sm font-semibold text-emerald-600">
            ✓ Passenger Confirmed on this ride
          </span>
        )}

        {request.status === "REJECTED" && (
          <span className="text-sm text-slate-400">
            This request was rejected.
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

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
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
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

function EmptyState({ activeTab }: { activeTab: "pending" | "history" }) {
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-slate-200">
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
          ? "You're all caught up! New passenger requests for your published rides will appear here."
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