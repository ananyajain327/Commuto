"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "OPEN";

interface Driver {
  fullName: string;
  email: string;
  phone?: string;
}

interface Ride {
  id: number;
  startLocation: string;
  destination: string;
  rideDate: string;
  departureTime: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  vehicleModel?: string;
  vehicleNumber?: string;
  driver?: Driver;
}

interface RideRequest {
  id: number;
  seatsRequested: number;
  pickupPreference: string;
  fare: number;
  status: RequestStatus;
  ride: Ride;
}

interface CustomBroadcast {
  id: number;
  startLocation: string;
  destination: string;
  rideDate: string;
  departureTime: string;
  seatsNeeded: number;
  budgetPerSeat: number;
  womenOnly: boolean;
  note: string;
  status: RequestStatus;
  acceptedByDriver?: Driver;
  createdAt: string;
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [customBroadcasts, setCustomBroadcasts] = useState<CustomBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const loadRequests = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Please login to view your ride requests.");
      setLoading(false);
      return;
    }

    try {
      // 1. Specific ride requests
      const response = await fetch(apiUrl("/api/ride-requests/my-requests"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const result: RideRequest[] = await response.json();
        setRequests(result);
      }

      // 2. Custom broadcast requests
      const customRes = await fetch(apiUrl("/api/custom-ride-requests/my"), {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => null);

      if (customRes && customRes.ok) {
        const customResult: CustomBroadcast[] = await customRes.json();
        setCustomBroadcasts(customResult);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unable to load ride requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void loadRequests());
  }, [loadRequests]);

  const cancelRequest = async (requestId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setActionError("Please login to cancel this ride request.");
      return;
    }

    try {
      setCancellingId(requestId);
      setActionError("");
      const response = await fetch(apiUrl(`/api/ride-requests/${requestId}/cancel`), {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Unable to cancel this ride request.");
      }

      setRequests((current) =>
        current.map((request) =>
          request.id === requestId ? { ...request, status: "CANCELLED" } : request
        )
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to cancel this ride request.");
    } finally {
      setCancellingId(null);
    }
  };

  const cancelCustomBroadcast = async (broadcastId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setCancellingId(broadcastId);
      const res = await fetch(apiUrl(`/api/custom-ride-requests/${broadcastId}/cancel`), {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCustomBroadcasts((curr) =>
          curr.map((b) => (b.id === broadcastId ? { ...b, status: "CANCELLED" } : b))
        );
      }
    } catch {
      // ignore
    } finally {
      setCancellingId(null);
    }
  };

  const hasAnyRequests = requests.length > 0 || customBroadcasts.length > 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-30 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 font-black text-white text-sm shadow-md">
                C
              </span>
              <h1 className="text-xl font-bold tracking-tight">My Ride Requests</h1>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Track driver responses and manage your ride bookings in real time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/rides/search"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
            >
              Find Rides
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl space-y-5 px-6 py-8">
        {loading && (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mb-3" />
            Loading your ride requests...
          </div>
        )}

        {!loading && errorMessage && (
          <div
            role="alert"
            className="rounded-2xl border border-rose-200 bg-white p-6 text-center text-rose-700 shadow-sm dark:border-rose-900/40 dark:bg-slate-900 dark:text-rose-300"
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && !hasAnyRequests && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl dark:bg-emerald-950/60 text-emerald-600">
              🚗
            </div>
            <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">
              No ride requests yet
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              When you book a ride or broadcast a travel request, it will appear here.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link
                href="/rides/search"
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
              >
                Search Available Rides
              </Link>
              <Link
                href="/rides/request"
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 transition"
              >
                Broadcast Custom Request
              </Link>
            </div>
          </div>
        )}

        {/* Custom Broadcasts */}
        {customBroadcasts.map((broadcast) => {
          const isPending = broadcast.status === "OPEN";
          const isAccepted = broadcast.status === "ACCEPTED";
          return (
            <article
              key={`cb-${broadcast.id}`}
              className="rounded-2xl border-2 border-emerald-200/80 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    📢 Custom City Broadcast
                  </span>
                  <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                    {broadcast.startLocation} <span className="text-slate-400">→</span>{" "}
                    {broadcast.destination}
                  </h2>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isAccepted
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                      : isPending
                      ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {isAccepted ? "✓ Driver Claimed" : isPending ? "Waiting for Drivers" : broadcast.status}
                </span>
              </div>

              <dl className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800">
                <div>
                  <dt className="text-[10px] text-slate-400 font-semibold">Date & Time</dt>
                  <dd className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {broadcast.rideDate} · {broadcast.departureTime}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-slate-400 font-semibold">Seats Needed</dt>
                  <dd className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {broadcast.seatsNeeded} Seat(s)
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-slate-400 font-semibold">Your Budget</dt>
                  <dd className="mt-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{broadcast.budgetPerSeat * broadcast.seatsNeeded} (₹{broadcast.budgetPerSeat}/seat)
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-slate-400 font-semibold">Preference</dt>
                  <dd className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {broadcast.womenOnly ? "♀ Women Only" : "Standard"}
                  </dd>
                </div>
              </dl>

              {isPending && (
                <div className="mt-4 rounded-xl bg-emerald-50/60 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                  📡 Broadcast is live! Drivers driving on this route can see your request and accept it.
                </div>
              )}

              {isAccepted && broadcast.acceptedByDriver && (
                <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                  <p className="font-bold">🎉 Driver Partner Accepted: {broadcast.acceptedByDriver.fullName}</p>
                  <p className="mt-0.5">📞 {broadcast.acceptedByDriver.phone || broadcast.acceptedByDriver.email}</p>
                </div>
              )}

              {isPending && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => void cancelCustomBroadcast(broadcast.id)}
                    disabled={cancellingId === broadcast.id}
                    className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40 disabled:opacity-50 transition"
                  >
                    {cancellingId === broadcast.id ? "Cancelling..." : "Cancel Broadcast"}
                  </button>
                </div>
              )}
            </article>
          );
        })}

        {/* Specific Ride Requests */}
        {requests.map((request) => {
          const canCancel = request.status === "PENDING" || request.status === "ACCEPTED";
          const statusStyle =
            request.status === "ACCEPTED"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              : request.status === "PENDING"
              ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

          return (
            <article
              key={`req-${request.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Booking Request CMD-{request.id.toString().padStart(4, "0")}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
                    {request.ride.startLocation} <span className="text-slate-400">→</span>{" "}
                    {request.ride.destination}
                  </h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle}`}>
                  {request.status === "ACCEPTED" ? "Confirmed" : request.status}
                </span>
              </div>

              <dl className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800">
                <div>
                  <dt className="text-[10px] text-slate-400 font-semibold">Date and time</dt>
                  <dd className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {request.ride.rideDate} · {request.ride.departureTime}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-slate-400 font-semibold">Pickup</dt>
                  <dd className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {request.pickupPreference || request.ride.startLocation}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-slate-400 font-semibold">Seats</dt>
                  <dd className="mt-0.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                    {request.seatsRequested}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] text-slate-400 font-semibold">Fare</dt>
                  <dd className="mt-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{Math.round(request.fare)}
                  </dd>
                </div>
              </dl>

              {request.status === "PENDING" && (
                <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  ⏳ Waiting for the driver to review and accept your booking.
                </p>
              )}

              {request.status === "ACCEPTED" && (
                <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-xs text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40">
                  <p className="font-bold">Driver: {request.ride.driver?.fullName || "Commuto Driver"}</p>
                  <p className="mt-0.5">
                    {request.ride.driver?.phone || request.ride.driver?.email || "Contact details unavailable"}
                  </p>
                  <p className="mt-0.5 text-emerald-800 dark:text-emerald-400">
                    {request.ride.vehicleModel || "Vehicle details unavailable"}
                    {request.ride.vehicleNumber ? ` · ${request.ride.vehicleNumber}` : ""}
                  </p>
                </div>
              )}

              {actionError && cancellingId === null && (
                <p role="alert" className="mt-3 text-xs text-rose-600">
                  {actionError}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link
                  href={`/booking/confirmation?requestId=${request.id}`}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition"
                >
                  View Details
                </Link>
                {request.status === "ACCEPTED" && (
                  <Link
                    href={`/booking/pass?requestId=${request.id}`}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
                  >
                    View Trip Pass
                  </Link>
                )}
                {request.status === "ACCEPTED" && request.ride.status === "ACTIVE" && (
                  <Link
                    href={`/rides/tracking/${request.ride.id}`}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
                  >
                    Live Track Ride
                  </Link>
                )}
                {canCancel && (
                  <button
                    type="button"
                    onClick={() => void cancelRequest(request.id)}
                    disabled={cancellingId !== null}
                    className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/40 disabled:opacity-60 transition"
                  >
                    {cancellingId === request.id ? "Cancelling..." : "Cancel Request"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}