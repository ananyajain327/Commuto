"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { apiUrl } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "OPEN";

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

interface CustomBroadcastRequest {
  id: number;
  startLocation: string;
  destination: string;
  rideDate: string;
  departureTime: string;
  seatsNeeded: number;
  budgetPerSeat: number;
  womenOnly: boolean;
  note: string;
  status: string;
  createdAt: string;
  passenger: Passenger;
}

export default function DriverRequestsPage() {
  const [requests, setRequests] = useState<BackendRideRequest[]>([]);
  const [broadcasts, setBroadcasts] = useState<CustomBroadcastRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "broadcasts" | "history">("pending");

  const fetchDriverRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("Please login as a driver to view requests.");
        setLoading(false);
        return;
      }

      // 1. Fetch direct ride requests for driver's rides
      const ridesRes = await fetch(apiUrl("/api/rides/my-rides"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allRequests: BackendRideRequest[] = [];
      if (ridesRes.ok) {
        const ridesData: RideSummary[] = await ridesRes.json();
        for (const ride of ridesData) {
          const reqRes = await fetch(apiUrl(`/api/ride-requests/ride/${ride.id}`), {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (reqRes.ok) {
            const reqData: BackendRideRequest[] = await reqRes.json();
            allRequests.push(...reqData);
          }
        }
      }

      allRequests.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRequests(allRequests);

      // 2. Fetch open passenger broadcasts from /api/custom-ride-requests/open
      const broadcastRes = await fetch(apiUrl("/api/custom-ride-requests/open"), {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => null);

      if (broadcastRes && broadcastRes.ok) {
        const bData: CustomBroadcastRequest[] = await broadcastRes.json();
        setBroadcasts(bData);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, []);

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
          client?.subscribe("/topic/custom-requests", () => {
            void fetchDriverRequests();
            setSuccessMessage("📢 New passenger ride broadcast in your city!");
          });
        },
      });
      client.activate();
    } catch {
      // Fallback to regular refresh
    }

    return () => {
      if (client) {
        void client.deactivate();
      }
    };
  }, [fetchDriverRequests]);

  const handleAction = async (id: number, action: "accept" | "reject") => {
    try {
      setActionLoadingId(id);
      setErrorMessage("");
      setSuccessMessage("");
      const token = localStorage.getItem("token");

      const res = await fetch(apiUrl(`/api/ride-requests/${id}/${action}`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || `Failed to ${action} ride request.`);
      }

      setSuccessMessage(`Request ${action === "accept" ? "Accepted" : "Rejected"} successfully!`);

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: action === "accept" ? "ACCEPTED" : "REJECTED" } : req
        )
      );
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAcceptBroadcast = async (broadcastId: number) => {
    try {
      setActionLoadingId(broadcastId);
      setErrorMessage("");
      setSuccessMessage("");
      const token = localStorage.getItem("token");

      const res = await fetch(apiUrl(`/api/custom-ride-requests/${broadcastId}/accept`), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to accept broadcast request.");
      }

      setSuccessMessage("🎉 Passenger travel request accepted! Passenger has been notified.");
      setBroadcasts((prev) => prev.filter((b) => b.id !== broadcastId));
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to accept broadcast");
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "PENDING");
  const acceptedRequests = requests.filter((r) => r.status === "ACCEPTED");
  const historyRequests = requests.filter((r) => r.status !== "PENDING");

  const potentialEarnings =
    pendingRequests.reduce((sum, r) => sum + (r.fare || 0), 0) +
    broadcasts.reduce((sum, b) => sum + (b.budgetPerSeat * b.seatsNeeded || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-30 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-base shadow-md shadow-indigo-500/20">
                C
              </span>
              <h1 className="text-xl font-bold tracking-tight">Driver Ride Requests</h1>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Review direct bookings and city-wide passenger travel broadcasts in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/driver/dashboard"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 transition shadow-sm"
            >
              ← Driver Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            {successMessage}
          </div>
        )}

        {/* Summary Cards */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Direct Ride Bookings"
            value={pendingRequests.length.toString()}
            icon="🔔"
            highlight={pendingRequests.length > 0}
          />
          <SummaryCard
            title="City Broadcasts"
            value={broadcasts.length.toString()}
            icon="📢"
            highlight={broadcasts.length > 0}
          />
          <SummaryCard
            title="Accepted History"
            value={acceptedRequests.length.toString()}
            icon="✓"
          />
          <SummaryCard
            title="Potential Earnings"
            value={`₹${Math.round(potentialEarnings)}`}
            icon="₹"
          />
        </section>

        {/* Tabs */}
        <section className="mt-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("pending")}
              className={`border-b-2 pb-3 text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === "pending"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Direct Bookings
              {pendingRequests.length > 0 && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("broadcasts")}
              className={`border-b-2 pb-3 text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === "broadcasts"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              City Passenger Broadcasts
              {broadcasts.length > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                  {broadcasts.length} Live
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={`border-b-2 pb-3 text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === "history"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Request History
              {historyRequests.length > 0 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium">
                  {historyRequests.length}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Requests List */}
        <section className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-3" />
              Loading ride requests...
            </div>
          ) : activeTab === "broadcasts" ? (
            broadcasts.length === 0 ? (
              <EmptyBroadcastsState />
            ) : (
              <div className="space-y-5">
                {broadcasts.map((broadcast) => (
                  <BroadcastCard
                    key={broadcast.id}
                    broadcast={broadcast}
                    isActionLoading={actionLoadingId === broadcast.id}
                    onAccept={handleAcceptBroadcast}
                  />
                ))}
              </div>
            )
          ) : activeTab === "pending" ? (
            pendingRequests.length === 0 ? (
              <EmptyState activeTab="pending" />
            ) : (
              <div className="space-y-5">
                {pendingRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    isActionLoading={actionLoadingId === request.id}
                    onAction={handleAction}
                  />
                ))}
              </div>
            )
          ) : historyRequests.length === 0 ? (
            <EmptyState activeTab="history" />
          ) : (
            <div className="space-y-5">
              {historyRequests.map((request) => (
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
        <section className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-6 dark:border-indigo-900/30 dark:bg-indigo-950/20">
          <div className="flex gap-4 items-start">
            <span className="text-2xl">🛡️</span>
            <div>
              <h2 className="font-bold text-indigo-950 dark:text-indigo-200">
                Driver Safety & Direct Contact
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-indigo-800 dark:text-indigo-300">
                Always verify passenger identity before departure. Use the In-App Chat to coordinate exact pickup spots and keep your location tracking active during transit.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- Request Card (Direct Bookings) ---------- */

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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 font-black text-white text-base shadow-sm">
            {initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{passengerName}</h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                ✓ Verified Passenger
              </span>
            </div>

            <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>✉ {request.passenger?.email}</span>
              {request.passenger?.phone && <span>📞 {request.passenger.phone}</span>}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {request.status !== "PENDING" && (
          <span
            className={`h-fit rounded-full px-3.5 py-1 text-xs font-bold ${
              request.status === "ACCEPTED"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
            }`}
          >
            {request.status === "ACCEPTED" ? "✓ Accepted" : "× Rejected"}
          </span>
        )}
      </div>

      {/* Route & Ride Details */}
      <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Target Published Ride
            </p>
            <p className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
              {request.ride?.startLocation} → {request.ride?.destination}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <div>
              <p className="text-[10px] font-semibold text-slate-400">Date</p>
              <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">{request.ride?.rideDate}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400">Departure</p>
              <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">{request.ride?.departureTime}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400">Seats Requested</p>
              <p className="mt-0.5 font-bold text-indigo-600 dark:text-indigo-400">
                {request.seatsRequested} Seat(s)
              </p>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="mt-4 grid gap-3 md:grid-cols-2 pt-3 border-t border-slate-200 dark:border-slate-700/60">
          <Location
            color="bg-indigo-600"
            title="Pickup Preference"
            value={request.pickupPreference || request.ride?.startLocation || "Main Pickup"}
          />
          <Location
            color="bg-emerald-500"
            title="Drop Destination"
            value={request.ride?.destination || "Drop Location"}
          />
        </div>

        {request.note && (
          <div className="mt-3 rounded-xl bg-white p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-slate-100">Passenger Note: </span>
            {request.note}
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div className="mt-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Fare</p>
          <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
            ₹{Math.round(request.fare)}
          </p>
        </div>

        {request.status === "PENDING" && (
          <div className="flex flex-wrap gap-2.5">
            <button
              disabled={isActionLoading}
              onClick={() => onAction(request.id, "reject")}
              className="rounded-xl border border-rose-200 px-5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40 disabled:opacity-50 transition"
            >
              {isActionLoading ? "Processing..." : "Reject"}
            </button>
            <button
              disabled={isActionLoading}
              onClick={() => onAction(request.id, "accept")}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {isActionLoading ? "Processing..." : "Accept Request"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Broadcast Card (City Travel Requests) ---------- */

function BroadcastCard({
  broadcast,
  isActionLoading,
  onAccept,
}: {
  broadcast: CustomBroadcastRequest;
  isActionLoading: boolean;
  onAccept: (id: number) => void;
}) {
  const passengerName = broadcast.passenger?.fullName || "Commuto Passenger";
  const initials = passengerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const totalBudget = (broadcast.budgetPerSeat || 0) * (broadcast.seatsNeeded || 1);

  return (
    <div className="rounded-2xl border-2 border-amber-200/80 bg-white p-6 shadow-sm dark:border-amber-900/40 dark:bg-slate-900">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 font-black text-white text-base shadow-sm">
            {initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{passengerName}</h2>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                📢 City Broadcast
              </span>
              {broadcast.womenOnly && (
                <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  ♀ Women Only
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>✉ {broadcast.passenger?.email}</span>
              {broadcast.passenger?.phone && <span>📞 {broadcast.passenger.phone}</span>}
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Offered Budget</p>
          <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
            ₹{Math.round(totalBudget)}
            <span className="text-xs font-normal text-slate-400 ml-1">
              (₹{broadcast.budgetPerSeat}/seat)
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Passenger Wanted Route
            </p>
            <p className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
              {broadcast.startLocation} → {broadcast.destination}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs">
            <div>
              <p className="text-[10px] font-semibold text-slate-400">Date</p>
              <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">{broadcast.rideDate}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400">Preferred Time</p>
              <p className="mt-0.5 font-bold text-slate-800 dark:text-slate-200">{broadcast.departureTime}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400">Seats Needed</p>
              <p className="mt-0.5 font-bold text-indigo-600 dark:text-indigo-400">
                {broadcast.seatsNeeded} Seat(s)
              </p>
            </div>
          </div>
        </div>

        {broadcast.note && (
          <div className="mt-3 rounded-xl bg-white p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-slate-100">Custom Note: </span>
            {broadcast.note}
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          disabled={isActionLoading}
          onClick={() => onAccept(broadcast.id)}
          className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 disabled:opacity-50 transition"
        >
          {isActionLoading ? "Claiming..." : "⚡ Accept & Pick Up Passenger"}
        </button>
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function Location({ color, title, value }: { color: string; title: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <div>
        <p className="text-[10px] text-slate-400 font-semibold">{title}</p>
        <p className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  highlight = false,
}: {
  title: string;
  value: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm transition dark:bg-slate-900 ${
        highlight
          ? "border-indigo-300 dark:border-indigo-700 ring-1 ring-indigo-500/20"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</p>
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 text-sm">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function EmptyState({ activeTab }: { activeTab: "pending" | "history" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl dark:bg-indigo-950/60 text-indigo-600">
        {activeTab === "pending" ? "✓" : "📋"}
      </div>
      <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
        {activeTab === "pending" ? "No new direct bookings" : "No request history"}
      </h2>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {activeTab === "pending"
          ? "You're all caught up! When passengers request seats on your published rides, they will appear here."
          : "Your accepted and rejected requests will appear here."}
      </p>
      <Link
        href="/driver/dashboard"
        className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

function EmptyBroadcastsState() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl dark:bg-amber-950/60 text-amber-600">
        📢
      </div>
      <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
        No open city broadcasts right now
      </h2>
      <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        When passengers broadcast a custom travel request looking for drivers, they will show up here instantly with real-time alerts.
      </p>
    </div>
  );
}