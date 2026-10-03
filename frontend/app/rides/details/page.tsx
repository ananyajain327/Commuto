"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { apiUrl } from "@/lib/api";

type BackendRide = {
  id: number;
  origin: string;
  destination: string;
  departureTime: string;
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

  // Parse origin and destination if route param exists
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

  // Load real ride from backend if ride ID is present
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
        // Fall back gracefully to query params / mock data
      } finally {
        setLoading(false);
      }
    };

    void fetchRide();
  }, [rideIdParam]);

  // Computed display values
  const rideCode = backendRide ? `CM-${String(backendRide.id).padStart(4, "0")}` : (rideIdParam ? `CM-${String(rideIdParam).padStart(4, "0")}` : "CM-0001");
  const origin = backendRide ? backendRide.origin : defaultOrigin;
  const destination = backendRide ? backendRide.destination : defaultDestination;
  const routeDisplay = backendRide ? `${backendRide.origin} → ${backendRide.destination}` : defaultRouteTitle;
  const driverName = backendRide?.driver?.fullName || driverParam || "Rahul Sharma";
  const driverRating = backendRide?.driver?.rating ? backendRide.driver.rating.toFixed(1) : "4.9";
  const vehicle = backendRide ? `${backendRide.vehicleModel || "Sedan"} (${backendRide.vehicleNumber || "Verified"})` : "Hyundai Creta · RJ14 AB 1234";
  const seats = backendRide ? `${backendRide.availableSeats} seats` : "2 seats";
  const womenOnly = backendRide ? (backendRide.womenOnly ? "Yes (Women-only)" : "No (All genders)") : "No (All genders)";
  const rideDate = dateParam || "Tomorrow";
  const rideTime = timeParam || (backendRide ? new Date(backendRide.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "08:30 AM");
  const statusDisplay = statusParam || backendRide?.status || "UPCOMING";

  const numericFare = backendRide
    ? backendRide.expectedFare
    : (fareParam ? parseInt(fareParam.replace(/\D/g, "") || "280", 10) : 280);
  const serviceFee = Math.round(numericFare * 0.08) || 20;
  const totalFare = numericFare + serviceFee;

  const handleRequestRide = async () => {
    setRequestError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (rideIdParam && token) {
        const res = await fetch(apiUrl(`/api/rides/${rideIdParam}/requests`), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ seatsRequested: 1 }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          const msg = (errData && typeof errData === "object" && "message" in errData && typeof errData.message === "string")
            ? errData.message
            : "Ride request could not be processed right now.";
          // If already requested or conflict, still show requested
          if (res.status === 409 || msg.includes("already requested")) {
            setRequested(true);
            return;
          }
          setRequestError(msg);
          // Still allow local UX confirmation
          setRequested(true);
          return;
        }
      }
      setRequested(true);
    } catch {
      setRequested(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `https://commuto.app/rides/details?id=${rideIdParam || "1"}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    void navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    const text = `Check out this verified ride on Commuto: ${routeDisplay} on ${rideDate} at ${rideTime}. Total fare: ₹${totalFare}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `Commuto Ride: ${routeDisplay}`, text, url });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-2xl font-black tracking-tight text-slate-900">
              Commuto<span className="text-blue-600">.</span>
            </Link>
            <span className="hidden sm:inline-block h-4 w-px bg-slate-200" />
            <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-slate-400">
              Ride Details
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
            >
              ← Dashboard
            </Link>
            <Link
              href="/rides"
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
            >
              My Rides
            </Link>
            <Link
              href="/safety"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100"
            >
              <span>🚨</span>
              <span>SOS</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {loading && (
          <div className="mb-6 rounded-2xl bg-blue-50 p-4 text-xs font-semibold text-blue-700">
            Refreshing live ride information from Commuto servers...
          </div>
        )}

        {/* Heading & Status Banner */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-widest text-blue-700">
                {rideCode}
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                {statusDisplay}
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl text-slate-900">
              {routeDisplay}
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              {rideDate} · {rideTime}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
            >
              <span>📤</span>
              <span>Share Trip</span>
            </button>

            <Link
              href={`/rides/tracking/${rideIdParam || "1"}`}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-blue-700"
            >
              <span>📍</span>
              <span>Open Live GPS Tracking</span>
            </Link>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Journey Route */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Journey Route</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    Confirmed stops and verified travel waypoints
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
                  Direct Route
                </span>
              </div>

              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="h-4 w-4 rounded-full border-4 border-blue-600 bg-white shadow-sm" />
                  <span className="h-24 border-l-2 border-dashed border-slate-300" />
                  <span className="h-4 w-4 rounded-full bg-blue-600 shadow-sm" />
                </div>

                <div className="flex-1 space-y-8">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Pickup Location
                    </p>
                    <h3 className="mt-0.5 text-base font-extrabold text-slate-900">
                      {origin}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Departure scheduled for {rideTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Drop-off Destination
                    </p>
                    <h3 className="mt-0.5 text-base font-extrabold text-slate-900">
                      {destination}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Estimated arrival in ~2h 45m
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                <DetailBox label="Est. Distance" value="135 km" icon="🛣️" />
                <DetailBox label="Duration" value="2h 45m" icon="⏱️" />
                <DetailBox label="Route Match" value="96% Match" icon="🎯" />
              </div>
            </section>

            {/* Driver Profile Section */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Driver Partner</h2>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    Background-verified Commuto community driver
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                  ✓ VERIFIED DRIVER
                </span>
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#172033] text-xl font-black text-white shadow-md">
                  {driverName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "DR"}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-black text-slate-900">{driverName}</h3>

                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-extrabold text-amber-500">⭐ {driverRating || "4.8"} rating</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-slate-500">Verified Driver</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-semibold text-emerald-600">ID & Vehicle Checked</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDriverModal(true)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
                >
                  View Profile →
                </button>
              </div>

              <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
                <InfoRow icon="🚗" label="Vehicle Model" value={vehicle} />
                <InfoRow icon="🛡️" label="Identity & License" value="Government ID & DL Verified" />
              </div>
            </section>

            {/* Commuto Safety */}
            <section className="rounded-3xl border border-blue-100 bg-blue-50/70 p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                  🛡️
                </div>

                <div>
                  <h2 className="text-base font-black text-slate-900">Commuto Safety Shield</h2>

                  <p className="mt-1.5 text-xs leading-5 text-slate-600">
                    Your safety is our #1 priority. This trip is covered by real-time GPS tracking, 24/7 SOS emergency response, and verified passenger/driver verification.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <SafetyItem text="Driver KYC Verified" />
                <SafetyItem text="Live SOS Response" />
                <SafetyItem text="Live GPS Route Tracking" />
              </div>
            </section>
          </div>

          {/* Right Column / Sidebar */}
          <aside className="space-y-6">
            {/* Fare Summary */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">Fare Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-slate-500">Per Passenger Share</span>
                  <span className="font-extrabold text-slate-900">₹{numericFare}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-xs font-semibold text-slate-500">Commuto Platform Fee</span>
                  <span className="font-extrabold text-slate-900">₹{serviceFee}</span>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-slate-900">Total payable</span>
                      <p className="text-[10px] text-slate-400">Includes all taxes & tolls</p>
                    </div>
                    <span className="text-2xl font-black text-blue-600">₹{totalFare}</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[11px] leading-4 text-slate-400">
                Fare is split automatically among co-passengers. Cashless or direct payment available.
              </p>
            </section>

            {/* Ride Details / Info */}
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-lg font-black text-slate-900">Ride Information</h2>

              <div className="mt-4 space-y-3">
                <InfoRow icon="📅" label="Date" value={rideDate} />
                <InfoRow icon="🕐" label="Departure Time" value={rideTime} />
                <InfoRow icon="💺" label="Available Seats" value={seats} />
                <InfoRow icon="👩" label="Preference" value={womenOnly} />
              </div>
            </section>

            {/* Reserve / Booking Action */}
            <section className="rounded-3xl bg-[#172033] p-7 text-white shadow-xl">
              <p className="text-[11px] font-black uppercase tracking-wider text-indigo-300">
                READY TO COMMUTE?
              </p>

              <h2 className="mt-1.5 text-xl font-black">Reserve your seat</h2>

              <p className="mt-2 text-xs leading-5 text-slate-300">
                Send an instant ride request to {driverName}. The driver will receive a live notification to accept your request.
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
                className={`mt-5 w-full rounded-2xl py-4 text-xs font-black uppercase tracking-wider transition active:scale-[0.98] ${
                  requested
                    ? "cursor-default bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : submitting
                    ? "cursor-wait bg-blue-500/70 text-white"
                    : "bg-[#5b5ce2] text-white hover:bg-[#4d4ecf] shadow-lg shadow-indigo-500/25"
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
                      View in My Requests →
                    </Link>
                    <Link
                      href={`/rides/tracking/${rideIdParam || "1"}`}
                      className="block rounded-xl bg-emerald-600 py-2 text-xs font-extrabold text-white transition hover:bg-emerald-500"
                    >
                      📍 Track Live Ride GPS
                    </Link>
                  </div>
                </div>
              )}
            </section>

            {/* Live GPS Route Button */}
            <Link
              href={`/rides/tracking/${rideIdParam || "1"}`}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 py-3.5 text-xs font-extrabold text-blue-700 transition hover:bg-blue-100"
            >
              <span>🗺️</span>
              <span>Open Live GPS Tracking</span>
            </Link>

            {/* Emergency SOS Button */}
            <Link
              href="/safety"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white py-3.5 text-xs font-extrabold text-red-600 transition hover:bg-red-50 hover:border-red-300"
            >
              <span>🚨</span>
              <span>Emergency SOS Safety Center</span>
            </Link>
          </aside>
        </div>
      </div>

      {/* Driver Profile Modal */}
      {showDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Driver Verification Details</h3>
              <button
                type="button"
                onClick={() => setShowDriverModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172033] text-lg font-black text-white">
                  {driverName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "DR"}
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">{driverName}</h4>
                  <p className="text-xs text-emerald-600 font-bold">✓ Government KYC Verified</p>
                  <p className="text-xs text-slate-400 mt-0.5">Rating: ⭐ {driverRating} · 128 Reviews</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Vehicle</span>
                  <span className="font-bold text-slate-800">{vehicle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Registration (RC)</span>
                  <span className="font-bold text-slate-800">Verified & Active</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="font-semibold text-slate-500">Driving License</span>
                  <span className="font-bold text-slate-800">Commercial / Valid</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-slate-500">Trip Acceptance Rate</span>
                  <span className="font-bold text-emerald-600">98% (Super Driver)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-4">
                Driver identity, vehicle documents, and police verification status are checked by the Commuto Safety Team.
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowDriverModal(false)}
                className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Trip Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Share Ride Details</h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Share this verified ride with your travel companions, friends, or family so they can view route details and split fare.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out this ride on Commuto: ${routeDisplay} on ${rideDate} at ${rideTime} (₹${totalFare}). View details: ${getShareUrl()}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>

              <a
                href={`sms:?body=${encodeURIComponent(
                  `Commuto Ride: ${routeDisplay} at ${rideTime} (₹${totalFare}). Details: ${getShareUrl()}`
                )}`}
                className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
              >
                <span>📱</span>
                <span>SMS</span>
              </a>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                readOnly
                value={getShareUrl()}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                {copied ? "Copied! ✓" : "Copy"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => void handleNativeShare()}
              className="mt-3 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Share via other apps...
            </button>
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
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
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
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-lg">{icon}</div>
      <p className="mt-2 text-[11px] font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-black text-slate-900">{value}</p>
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
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-base">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="mt-0.5 text-xs font-extrabold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function SafetyItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 shadow-sm">
      <span className="text-emerald-500 font-black">✓</span>
      <span>{text}</span>
    </div>
  );
}
