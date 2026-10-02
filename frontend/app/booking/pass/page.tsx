"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

interface RideRequest {
  id: number;
  seatsRequested: number;
  pickupPreference: string;
  fare: number;
  status: RequestStatus;
  ride: {
    startLocation: string;
    destination: string;
    rideDate: string;
    departureTime: string;
    vehicleModel?: string;
    vehicleNumber?: string;
    driver?: {
      fullName: string;
      phone?: string;
      email: string;
    };
  };
}

function TripPassContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const [booking, setBooking] = useState<RideRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadBooking = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your trip pass.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/ride-requests/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Unable to load this trip pass.");
        }

        const requests: RideRequest[] = await response.json();
        const selected = requests.find((request) => request.id === Number(requestId));
        if (!selected) {
          throw new Error("This trip pass could not be found.");
        }

        if (isCurrent) {
          setBooking(selected);
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load this trip pass.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    void loadBooking();
    return () => {
      isCurrent = false;
    };
  }, [requestId]);

  if (loading) {
    return <main className="grid min-h-screen place-items-center text-slate-500">Loading trip pass...</main>;
  }

  if (error || !booking) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <p role="alert" className="font-semibold text-rose-700">{error || "Trip pass unavailable."}</p>
          <a href="/rides/my-requests" className="mt-4 inline-block text-sm font-semibold text-indigo-700 underline">My Requests</a>
        </div>
      </main>
    );
  }

  if (booking.status !== "ACCEPTED") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center text-slate-900">
        <div className="max-w-md">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Request {booking.status}</p>
          <h1 className="mt-3 text-2xl font-bold">Your trip pass is not ready</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">A pass will be available here after the driver accepts your request.</p>
          <a href={`/booking/confirmation?requestId=${booking.id}`} className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Booking details</a>
        </div>
      </main>
    );
  }

  const reference = `CMD-${booking.id.toString().padStart(4, "0")}`;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 print:min-h-0 print:bg-white print:p-0">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <a href={`/booking/confirmation?requestId=${booking.id}`} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Back to booking</a>
          <button type="button" onClick={() => window.print()} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700">Print pass</button>
        </div>

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:rounded-none print:border-slate-400 print:shadow-none">
          <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 sm:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Commuto · Trip Pass</p>
              <h1 className="mt-2 text-2xl font-bold">{booking.ride.startLocation} <span className="text-slate-400">to</span> {booking.ride.destination}</h1>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">ACCEPTED</span>
          </header>

          <div className="grid gap-6 px-6 py-6 sm:grid-cols-[1fr_auto] sm:px-8">
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <PassDetail label="Pass reference" value={reference} />
              <PassDetail label="Travel date" value={booking.ride.rideDate} />
              <PassDetail label="Pickup" value={booking.pickupPreference || booking.ride.startLocation} />
              <PassDetail label="Departure" value={booking.ride.departureTime} />
              <PassDetail label="Destination" value={booking.ride.destination} />
              <PassDetail label="Passengers" value={String(booking.seatsRequested)} />
              <PassDetail label="Fare" value={`₹${Math.round(booking.fare)}`} />
            </div>

            <div className="min-w-48 border-t border-dashed border-slate-200 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Driver</p>
              <p className="mt-2 font-semibold">{booking.ride.driver?.fullName || "Commuto Driver"}</p>
              <p className="mt-1 text-sm text-slate-600">{booking.ride.driver?.phone || booking.ride.driver?.email || "Contact unavailable"}</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-slate-400">Vehicle</p>
              <p className="mt-2 text-sm font-semibold">{booking.ride.vehicleModel || "Vehicle details unavailable"}</p>
              <p className="mt-1 text-sm text-slate-600">{booking.ride.vehicleNumber || "Plate unavailable"}</p>
            </div>
          </div>

          <footer className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600 sm:px-8 print:bg-white">
            Show this pass and reference <span className="font-bold text-slate-900">{reference}</span> to your driver at pickup.
          </footer>
        </article>
      </div>
    </main>
  );
}

export default function TripPassPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center text-slate-500">Loading trip pass...</main>}>
      <TripPassContent />
    </Suspense>
  );
}

function PassDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}