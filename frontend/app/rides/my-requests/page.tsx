"use client";

import { useEffect, useState } from "react";

type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

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

const requestsUrl = "http://localhost:8080/api/ride-requests/my-requests";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    let isCurrent = true;

    const loadRequests = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Please login to view your ride requests.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(requestsUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to load your ride requests.");
        }

        const result: RideRequest[] = await response.json();
        if (isCurrent) {
          setRequests(result);
        }
      } catch (err) {
        if (isCurrent) {
          setErrorMessage(err instanceof Error ? err.message : "Unable to load ride requests.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    void loadRequests();
    return () => {
      isCurrent = false;
    };
  }, []);

  const cancelRequest = async (requestId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setActionError("Please login to cancel this ride request.");
      return;
    }

    try {
      setCancellingId(requestId);
      setActionError("");
      const response = await fetch(`http://localhost:8080/api/ride-requests/${requestId}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Unable to cancel this ride request.");
      }

      setRequests((current) => current.map((request) => (
        request.id === requestId ? { ...request, status: "CANCELLED" } : request
      )));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to cancel this ride request.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">My Ride Requests</h1>
            <p className="mt-1 text-sm text-slate-500">Track driver responses and manage your bookings.</p>
          </div>
          <a href="/rides/search" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
            Find Rides
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl space-y-4 px-6 py-8">
        {loading && <p className="py-12 text-center text-slate-500">Loading your requests...</p>}

        {!loading && errorMessage && (
          <div role="alert" className="rounded-2xl bg-white p-6 text-center text-rose-700 shadow-sm ring-1 ring-slate-200">
            {errorMessage}
          </div>
        )}

        {!loading && !errorMessage && requests.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold">No ride requests yet</h2>
            <p className="mt-2 text-sm text-slate-500">Requests you send will appear here.</p>
            <a href="/rides/search" className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
              Search Rides
            </a>
          </div>
        )}

        {requests.map((request) => {
          const canCancel = request.status === "PENDING" || request.status === "ACCEPTED";
          const statusStyle = request.status === "ACCEPTED"
            ? "bg-emerald-50 text-emerald-700"
            : request.status === "PENDING"
              ? "bg-amber-50 text-amber-700"
              : "bg-slate-100 text-slate-600";

          return (
            <article key={request.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Ride request CMD-{request.id.toString().padStart(4, "0")}</p>
                  <h2 className="mt-2 text-xl font-bold">{request.ride.startLocation} <span className="text-slate-400">→</span> {request.ride.destination}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}>
                  {request.status === "ACCEPTED" ? "Confirmed" : request.status}
                </span>
              </div>

              <dl className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                <div><dt className="text-xs text-slate-400">Date and time</dt><dd className="mt-1 text-sm font-medium">{request.ride.rideDate} · {request.ride.departureTime}</dd></div>
                <div><dt className="text-xs text-slate-400">Pickup</dt><dd className="mt-1 text-sm font-medium">{request.pickupPreference || request.ride.startLocation}</dd></div>
                <div><dt className="text-xs text-slate-400">Seats</dt><dd className="mt-1 text-sm font-medium">{request.seatsRequested}</dd></div>
                <div><dt className="text-xs text-slate-400">Fare</dt><dd className="mt-1 text-sm font-medium">₹{Math.round(request.fare)}</dd></div>
              </dl>

              {request.status === "PENDING" && (
                <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Waiting for the driver to review your request.</p>
              )}

              {request.status === "ACCEPTED" && (
                <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="font-semibold">Driver: {request.ride.driver?.fullName || "Commuto Driver"}</p>
                  <p className="mt-1">{request.ride.driver?.phone || request.ride.driver?.email || "Contact details unavailable"}</p>
                  <p className="mt-1 text-emerald-800">{request.ride.vehicleModel || "Vehicle details unavailable"}{request.ride.vehicleNumber ? ` · ${request.ride.vehicleNumber}` : ""}</p>
                </div>
              )}

              {actionError && cancellingId === null && <p role="alert" className="mt-4 text-sm text-rose-600">{actionError}</p>}

              <div className="mt-5 flex flex-wrap gap-3">
                <a href={`/booking/confirmation?requestId=${request.id}`} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">
                  View Details
                </a>
                {request.status === "ACCEPTED" && request.ride.status === "ACTIVE" && (
                  <a href={`/rides/tracking/${request.ride.id}`} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    Track Ride
                  </a>
                )}
                {canCancel && (
                  <button
                    type="button"
                    onClick={() => void cancelRequest(request.id)}
                    disabled={cancellingId !== null}
                    className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
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