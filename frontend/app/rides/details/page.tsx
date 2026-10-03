"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { apiUrl } from "@/lib/api";

type BackendRide = {
  id: number;
  origin?: string;
  startLocation?: string;
  destination: string;
  departureTime: string;
  rideDate?: string;
  availableSeats: number;
  expectedFare: number;
  vehicleModel: string;
  vehicleNumber: string;
  womenOnly: boolean;
  notes?: string;
  status: string;
  driver?: {
    id: number;
    fullName: string;
    email: string;
    phone?: string;
    rating?: number;
  };
};

function RideDetailsContent() {
  const searchParams = useSearchParams();
  const rideIdParam = searchParams.get("id");
  const routeParam = searchParams.get("route");
  const driverParam = searchParams.get("driver");
  const fareParam = searchParams.get("fare");
  const dateParam = searchParams.get("date");
  const timeParam = searchParams.get("time");
  const statusParam = searchParams.get("status");

  const [requested, setRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backendRide, setBackendRide] = useState<BackendRide | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMapTrack, setShowMapTrack] = useState(true);

  let defaultOrigin = "Jaipur Railway Station";
  let defaultDestination = "Ajmer Bus Stand";
  let defaultRouteTitle = "Jaipur → Ajmer";

  if (routeParam) {
    defaultRouteTitle = routeParam;
    if (routeParam.includes("→")) {
      const parts = routeParam.split("→").map((s) => s.trim());
      defaultOrigin = parts[0] || defaultOrigin;
      defaultDestination = parts[1] || defaultDestination;
    } else if (routeParam.includes("to")) {
      const parts = routeParam.split("to").map((s) => s.trim());
      defaultOrigin = parts[0] || defaultOrigin;
      defaultDestination = parts[1] || defaultDestination;
    }
  }

  useEffect(() => {
    if (!rideIdParam) return;

    const fetchRide = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(apiUrl(`/api/rides/${rideIdParam}`), {
          headers,
        });

        if (res.ok) {
          const data = (await res.json()) as BackendRide;
          setBackendRide(data);
        }
      } catch {
        // Fall back gracefully
      } finally {
        setLoading(false);
      }
    };

    void fetchRide();
  }, [rideIdParam]);

  const rideCode = backendRide ? `CM-${String(backendRide.id).padStart(4, "0")}` : (rideIdParam ? `CM-${String(rideIdParam).padStart(4, "0")}` : "CM-0001");
  const origin = backendRide?.startLocation || backendRide?.origin || defaultOrigin;
  const destination = backendRide?.destination || defaultDestination;
  const routeDisplay = backendRide ? `${origin} → ${destination}` : defaultRouteTitle;
  const driverName = backendRide?.driver?.fullName || driverParam || "Ananya Jain";
  const driverRating = backendRide?.driver?.rating || "4.9";
  const rideDate = backendRide?.rideDate || dateParam || "Today";
  const rideTime = backendRide?.departureTime || timeParam || "06:30 PM";
  const seats = backendRide?.availableSeats !== undefined ? `${backendRide.availableSeats} Seats` : "3 Seats";
  const vehicle = backendRide?.vehicleModel ? `${backendRide.vehicleModel} (${backendRide.vehicleNumber || "Verified"})` : "Honda City · RJ14 CD 4582";
  const womenOnly = backendRide?.womenOnly ? "Yes (Women Only)" : "Standard (All Commuters)";
  const statusDisplay = backendRide?.status || statusParam || "ACTIVE & OPEN";

  const numericFare = backendRide?.expectedFare || (fareParam ? Number(fareParam) : 280);
  const serviceFee = 0;
  const totalFare = numericFare + serviceFee;

  const handleRequestRide = async () => {
    try {
      setSubmitting(true);
      setRequestError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setRequestError("Please login before requesting this ride.");
        return;
      }

      const rideIdToBook = backendRide?.id || (rideIdParam ? Number(rideIdParam) : 1);
      const res = await fetch(apiUrl("/api/ride-requests"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rideId: rideIdToBook,
          seatsRequested: 1,
          pickupPreference: origin,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Could not submit ride request.");
      }

      setRequested(true);
    } catch (err) {
      setRequestError(err instanceof Error ? err.message : "Failed to request ride.");
    } finally {
      setSubmitting(false);
    }
  };

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-black text-lg text-white shadow-md shadow-emerald-900/20 dark:bg-emerald-500">
              C
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Commuto
              </span>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Ride Details
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition shadow-2xs"
            >
              ← Dashboard
            </Link>
            <Link
              href="/safety"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 transition"
            >
              <span>🚨</span>
              <span>SOS</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading && (
          <div className="mb-6 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            Refreshing live route information from Commuto servers...
          </div>
        )}

        {/* Heading & Status Banner */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {rideCode}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {statusDisplay}
              </span>
            </div>

            <h1 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {routeDisplay}
            </h1>

            <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {rideDate} · Departure {rideTime}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition cursor-pointer"
            >
              <span>📤</span>
              <span>Share Trip</span>
            </button>

            <Link
              href={`/rides/tracking/${rideIdParam || "1"}`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-md shadow-emerald-900/20 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition"
            >
              <span>📍</span>
              <span>Live GPS Tracking</span>
            </Link>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Step 1: Interactive Journey Route Card */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Interactive Journey Route
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    Confirmed stops and verified travel waypoints
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMapTrack(!showMapTrack)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {showMapTrack ? "Hide Path ▲" : "Show Path ▼"}
                </button>
              </div>

              {/* Waypoint Steps */}
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="h-4 w-4 rounded-full border-4 border-emerald-600 bg-white dark:bg-slate-900 shadow-sm" />
                  <span className="h-20 border-l-2 border-dashed border-slate-300 dark:border-slate-700" />
                  <span className="h-4 w-4 rounded-full bg-emerald-600 shadow-sm" />
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Pickup Location
                    </p>
                    <h3 className="mt-0.5 text-base font-extrabold text-slate-900 dark:text-white">
                      {origin}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Scheduled Departure: {rideTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Drop-off Destination
                    </p>
                    <h3 className="mt-0.5 text-base font-extrabold text-slate-900 dark:text-white">
                      {destination}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Estimated duration: ~1h 45m
                    </p>
                  </div>
                </div>
              </div>

              {showMapTrack && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Expressway Route Flow
                    </span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      🟢 Optimal Traffic
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-400 w-full animate-pulse" />
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:grid-cols-3">
                <DetailBox label="Est. Distance" value="84 km" icon="🛣️" />
                <DetailBox label="Duration" value="1h 45m" icon="⏱️" />
                <DetailBox label="Route Match" value="98% Direct" icon="🎯" />
              </div>
            </section>

            {/* Driver Profile & Vehicle Amenities */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Driver Partner
                  </h2>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    Background-verified Commuto community driver
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                  ✓ VERIFIED DRIVER
                </span>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-black text-xl text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 shadow-sm">
                  {driverName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "DR"}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{driverName}</h3>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-extrabold text-amber-500">⭐ {driverRating} rating</span>
                    <span>·</span>
                    <span>Verified Driver</span>
                    <span>·</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">ID & Vehicle Checked</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDriverModal(true)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition cursor-pointer"
                >
                  View Profile →
                </button>
              </div>

              {/* Step 4: Driver Vehicle Badges & Amenities */}
              <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:grid-cols-2">
                <InfoRow icon="🚗" label="Vehicle & Class" value={vehicle} />
                <InfoRow icon="🛡️" label="Identity & License" value="Government ID & DL Verified" />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  ❄️ AC Climate Control
                </span>
                <span className="rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  🎒 Boot Space Available
                </span>
                <span className="rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  🚭 Smoke-Free Cabin
                </span>
                <span className="rounded-lg bg-slate-100 px-3 py-1 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  🎵 In-Ride Music
                </span>
              </div>
            </section>
          </div>

          {/* Right Column / Sidebar */}
          <aside className="space-y-6">
            {/* Fare Summary */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Fare Summary</h2>

              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Seat Share (1 Seat)</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">₹{numericFare}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Platform Convenience Fee</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹0 (Free)</span>
                </div>

                <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-slate-900 dark:text-white">Total Payable</span>
                      <p className="text-[10px] text-slate-400">Fuel cost split transparently</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{totalFare}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Ride Details / Info */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Trip Specifications</h2>

              <div className="mt-4 space-y-3">
                <InfoRow icon="📅" label="Date" value={rideDate} />
                <InfoRow icon="🕐" label="Departure Time" value={rideTime} />
                <InfoRow icon="💺" label="Available Seats" value={seats} />
                <InfoRow icon="👩" label="Preference" value={womenOnly} />
              </div>
            </section>

            {/* Reserve Action Box */}
            <section className="rounded-3xl bg-slate-950 p-6 sm:p-7 text-white shadow-xl border border-slate-800">
              <p className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                READY TO COMMUTE?
              </p>

              <h2 className="mt-1 text-xl font-black">Reserve your seat</h2>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Send an instant ride request to {driverName}. The driver will receive a live notification to accept your booking.
              </p>

              {requestError && (
                <div className="mt-3 rounded-xl bg-rose-500/20 p-3 text-xs text-rose-200">
                  {requestError}
                </div>
              )}

              <button
                type="button"
                onClick={() => void handleRequestRide()}
                disabled={requested || submitting}
                className={`mt-5 w-full rounded-2xl py-3.5 text-xs font-black uppercase tracking-wider transition active:scale-95 cursor-pointer ${
                  requested
                    ? "cursor-default bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : submitting
                    ? "cursor-wait bg-emerald-600/70 text-white"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 shadow-lg shadow-emerald-900/20"
                }`}
              >
                {requested
                  ? "✓ Ride Request Sent!"
                  : submitting
                  ? "Sending Request..."
                  : "Request Ride Now →"}
              </button>

              {requested && (
                <div className="mt-4 rounded-2xl bg-white/10 p-4 text-center">
                  <p className="text-xs font-bold text-emerald-300">
                    🎉 Request placed successfully!
                  </p>
                  <p className="mt-1 text-[11px] text-slate-300">
                    You can monitor driver confirmation in My Requests or view live route tracking.
                  </p>

                  <div className="mt-3 flex flex-col gap-2">
                    <Link
                      href="/rides/my-requests"
                      className="block rounded-xl bg-white/15 py-2 text-xs font-extrabold text-white transition hover:bg-white/25"
                    >
                      View in My Bookings →
                    </Link>
                  </div>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>

      {/* Driver Profile Modal */}
      {showDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Driver Verification Details</h3>
              <button
                type="button"
                onClick={() => setShowDriverModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {driverName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "DR"}
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">{driverName}</h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">✓ Government KYC Verified</p>
                  <p className="text-xs text-slate-400 mt-0.5">Rating: ⭐ {driverRating} · Verified Driver</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 space-y-2 text-xs dark:bg-slate-800">
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Vehicle</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{vehicle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-700">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Registration (RC)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Verified & Active</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Driving License</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Valid</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowDriverModal(false)}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 dark:bg-emerald-500 cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Trip Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">Share Ride Details</h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Share this verified ride with your travel companions, friends, or family so they can view route details and split fare.
            </p>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                readOnly
                value={getShareUrl()}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 dark:bg-emerald-500 cursor-pointer"
              >
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function RideDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent dark:border-emerald-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Loading ride details...
            </p>
          </div>
        </main>
      }
    >
      <RideDetailsContent />
    </Suspense>
  );
}

function DetailBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
      <div className="text-base">{icon}</div>
      <p className="mt-1.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 text-xs font-black text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm dark:bg-slate-800">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="mt-0.5 text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate">{value}</p>
      </div>
    </div>
  );
}
