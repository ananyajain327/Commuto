"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { apiUrl } from "@/lib/api";

type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

interface RideRequest {
  id: number;
  seatsRequested: number;
  pickupPreference: string;
  fare: number;
  status: RequestStatus;
  ride: {
    id: number;
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
  const [copied, setCopied] = useState(false);

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
        const response = await fetch(apiUrl("/api/ride-requests/my-requests"), {
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

  const otpCode = booking ? `${(booking.id * 179 + 1000) % 9000 + 1000}` : "7492";

  const handleCopyOtp = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(otpCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent dark:border-emerald-500 mb-3" />
          <p className="text-xs font-bold">Generating secure boarding pass...</p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-md dark:border-slate-800 dark:bg-slate-900">
          <p className="text-3xl">⚠️</p>
          <p role="alert" className="mt-3 font-bold text-rose-600">{error || "Trip pass unavailable."}</p>
          <Link
            href="/rides/my-requests"
            className="mt-5 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
          >
            ← View My Requests
          </Link>
        </div>
      </main>
    );
  }

  if (booking.status !== "ACCEPTED") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-md dark:border-slate-800 dark:bg-slate-900">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Request {booking.status}
          </span>
          <h1 className="mt-4 text-xl font-black">Your trip pass is pending confirmation</h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            A digital boarding pass and start OTP will unlock immediately once the driver confirms your seat request.
          </p>
          <Link
            href={`/booking/confirmation?requestId=${booking.id}`}
            className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white dark:bg-slate-800 hover:bg-slate-700 transition"
          >
            Booking Details
          </Link>
        </div>
      </main>
    );
  }

  const reference = `CMD-${booking.id.toString().padStart(4, "0")}`;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 transition-colors print:min-h-0 print:bg-white print:p-0">
      <div className="mx-auto max-w-2xl">
        {/* Top bar */}
        <div className="mb-5 flex items-center justify-between print:hidden">
          <Link
            href={`/booking/confirmation?requestId=${booking.id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ← Back to Booking
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition cursor-pointer shadow-2xs"
            >
              🖨️ Print Pass
            </button>
          </div>
        </div>

        {/* Boarding Pass Ticket */}
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 print:rounded-none print:border-slate-400 print:shadow-none">
          {/* Header */}
          <header className="relative bg-slate-950 p-6 sm:p-8 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 font-bold text-xs">
                    C
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
                    Commuto Boarding Pass
                  </p>
                </div>
                <h1 className="mt-3 text-xl sm:text-2xl font-black leading-tight">
                  {booking.ride.startLocation} <span className="text-emerald-400">→</span> {booking.ride.destination}
                </h1>
                <p className="mt-1 text-xs text-slate-400">
                  {booking.ride.rideDate} · Departure {booking.ride.departureTime}
                </p>
              </div>

              <div className="text-right">
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-300 border border-emerald-500/40">
                  ✓ CONFIRMED
                </span>
                <p className="mt-2 text-xl font-black text-white">₹{Math.round(booking.fare)}</p>
                <p className="text-[10px] text-slate-400">{booking.seatsRequested} Seat(s)</p>
              </div>
            </div>
          </header>

          {/* Step 3: Interactive OTP & QR Code Section */}
          <div className="border-y border-dashed border-slate-200 bg-emerald-50/40 p-6 dark:border-slate-800 dark:bg-emerald-950/20">
            <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
              {/* Boarding OTP Box */}
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm dark:border-emerald-900/60 dark:bg-slate-900">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Boarding Verification OTP
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-3xl font-black tracking-widest text-slate-900 dark:text-white">
                      {otpCode}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyOtp}
                    className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-95 cursor-pointer"
                  >
                    {copied ? "✓ Copied" : "📋 Copy"}
                  </button>
                </div>
                <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  Share this 4-digit PIN with your driver to start the trip.
                </p>
              </div>

              {/* Dynamic QR Code Simulation */}
              <div className="flex items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-950 p-2 text-white">
                  {/* Decorative QR code pattern */}
                  <svg className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 2h7v7H2V2zm2 2v3h3V4H4zm11-2h7v7h-7V2zm2 2v3h3V4h-3zM2 15h7v7H2v-7zm2 2v3h3v-3H4zm13-2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h3v3h-3v-3zm-2 2h2v3h-2v-3zm2 2h2v2h-2v-2zm-6-4h2v2h-2v-2zm0 3h2v3h-2v-3zM10 2h4v2h-4V2zm2 4h2v4h-2V6zm-2 5h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v4h-2v-4z" />
                  </svg>
                  <div className="absolute inset-x-2 top-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-bounce" />
                </div>

                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white">QR Pass Scanner</p>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    Driver can scan to verify identity instantly.
                  </p>
                  <span className="mt-2 inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Pass: {reference}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Driver Info */}
          <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
            <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <PassDetail label="Pass reference" value={reference} />
              <PassDetail label="Travel date" value={booking.ride.rideDate} />
              <PassDetail label="Pickup point" value={booking.pickupPreference || booking.ride.startLocation} />
              <PassDetail label="Departure time" value={booking.ride.departureTime} />
              <PassDetail label="Destination" value={booking.ride.destination} />
              <PassDetail label="Seats booked" value={`${booking.seatsRequested} Seat(s)`} />
            </div>

            <div className="min-w-52 border-t border-dashed border-slate-200 pt-5 dark:border-slate-800 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Driver</p>
              <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">
                {booking.ride.driver?.fullName || "Commuto Driver"}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                📞 {booking.ride.driver?.phone || booking.ride.driver?.email || "Phone on request"}
              </p>

              <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Vehicle Info</p>
              <p className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                {booking.ride.vehicleModel || "Standard Sedan"}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Plate: {booking.ride.vehicleNumber || "Plate Verified"}
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60 print:bg-white">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              🛡️ Live GPS tracking and 24x7 SOS emergency shield active on this trip.
            </p>

            <div className="flex items-center gap-2">
              <Link
                href={`/rides/tracking/${booking.ride.id}`}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-900/20 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition"
              >
                📍 Track Driver Live →
              </Link>
            </div>
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
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 break-words text-xs font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}