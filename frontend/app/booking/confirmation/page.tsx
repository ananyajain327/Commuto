"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiUrl } from "@/lib/api";

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

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const requestIdParam = searchParams.get("requestId");

  const [booking, setBooking] = useState<RideRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const getShareDetails = () => {
    const trackingUrl = typeof window !== "undefined"
      ? `${window.location.origin}/rides/tracking/${booking?.ride?.id || ""}`
      : `http://localhost:3000/rides/tracking/${booking?.ride?.id || ""}`;
    const text = `🚗 Commuto Ride Booking!\n• Route: ${booking?.ride?.startLocation || "Origin"} → ${booking?.ride?.destination || "Destination"}\n• Driver: ${booking?.ride?.driver?.fullName || "Commuto Driver"} (${booking?.ride?.vehicleModel || "Vehicle"} - ${booking?.ride?.vehicleNumber || ""})\n• Date: ${booking?.ride?.rideDate || "Upcoming"} at ${booking?.ride?.departureTime || ""}\n• Status: ${booking?.status}\n• Live Tracking: ${trackingUrl}`;
    return { trackingUrl, text };
  };

  const handleCopyLink = () => {
    const { trackingUrl } = getShareDetails();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(trackingUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    const { trackingUrl, text } = getShareDetails();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Commuto Ride Confirmation",
          text: text,
          url: trackingUrl,
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    handleCopyLink();
  };

  const handleWhatsAppShare = () => {
    const { text } = getShareDetails();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleSmsShare = () => {
    const { text } = getShareDetails();
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
  };

  useEffect(() => {
    let isCurrent = true;

    const loadBooking = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Please login to view booking details.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(apiUrl("/api/ride-requests/my-requests"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to load your ride requests.");
        }

        const requests: RideRequest[] = await response.json();
        const selected = requestIdParam
          ? requests.find((request) => request.id === Number(requestIdParam))
          : requests[0];

        if (!selected) {
          throw new Error("The requested ride booking could not be found.");
        }
        if (isCurrent) {
          setBooking(selected);
        }
      } catch (err) {
        if (isCurrent) {
          setErrorMessage(err instanceof Error ? err.message : "Unable to load booking details.");
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
  }, [requestIdParam]);

  const cancelBooking = async () => {
    if (!booking || (booking.status !== "PENDING" && booking.status !== "ACCEPTED")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setActionError("Please login to cancel this ride request.");
      return;
    }

    try {
      setCancelling(true);
      setActionError("");
      const response = await fetch(
        apiUrl(`/api/ride-requests/${booking.id}/cancel`),
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Unable to cancel this ride request.");
      }

      setBooking({ ...booking, status: "CANCELLED" });
      setCancelled(true);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unable to cancel this ride request.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-500">Loading booking details...</div>;
  }

  if (errorMessage || !booking) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p role="alert" className="font-semibold text-rose-600">{errorMessage || "Booking not found"}</p>
        <Link href="/rides/search" className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white">Find Rides</Link>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <div>
              <h1 className="text-2xl font-bold">Booking Cancelled</h1>
              <p className="mt-1 text-sm text-slate-500">
                Your ride request has been cancelled.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              ← Dashboard
            </Link>
          </div>
        </header>

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
              ✓
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Ride Cancelled
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your booking for Jaipur → Ajmer has been cancelled
              successfully.
            </p>

            <Link
              href="/rides/my-requests"
              className="mt-7 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              My Requests
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const driver = booking.ride.driver;
  const driverName = driver?.fullName || "Commuto Driver";
  const driverInitials = driverName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const isAccepted = booking.status === "ACCEPTED";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">{isAccepted ? "Booking Confirmed" : "Request Submitted"}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {isAccepted
                ? "Your Commuto ride has been accepted by the driver."
                : "Your ride request is waiting for driver confirmation."}
            </p>
          </div>

          <Link
            href="/rides/my-requests"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            My Requests
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Success Banner */}
        <section className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl ${isAccepted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {isAccepted ? "✓" : "…"}
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            {isAccepted ? "You&apos;re all set!" : "Request Under Review"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {isAccepted
              ? `Your ride from ${booking.ride.startLocation} to ${booking.ride.destination} is confirmed.`
              : "The driver will notify you after reviewing your request."}
          </p>

          <div className="mx-auto mt-5 w-fit rounded-full bg-indigo-50 px-4 py-2">
            <span className="text-xs font-semibold text-indigo-700">
              Request ID: CMD-{booking.id.toString().padStart(4, "0")} · Status: {booking.status}
            </span>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-6 lg:col-span-2">
            {/* Journey */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Your Journey
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    {booking.ride.startLocation} → {booking.ride.destination}
                  </h2>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isAccepted ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {isAccepted ? "Confirmed" : booking.status}
                </span>
              </div>

              <div className="mt-7">
                <JourneyPoint
                  color="bg-indigo-600"
                  title="Pickup"
                  location={booking.pickupPreference || booking.ride.startLocation}
                  time={booking.ride.departureTime}
                />

                <div className="ml-1.5 h-14 border-l border-dashed border-slate-300" />

                <JourneyPoint
                  color="bg-emerald-500"
                  title="Destination"
                  location={booking.ride.destination}
                  time=""
                />
              </div>

              <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
                <InfoItem label="Date" value={booking.ride.rideDate} />
                <InfoItem label="Seats" value={String(booking.seatsRequested)} />
                <InfoItem label="Departure" value={booking.ride.departureTime} />
              </div>
            </section>

            {/* Driver */}
            {isAccepted && <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Your Driver
                </h2>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  ✓ Verified
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
                  {driverInitials}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold">{driverName}</h3>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    {driver?.phone && <span>☎ {driver.phone}</span>}
                    <span>{driver?.email || "Driver contact unavailable"}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 px-5 py-4">
                  <p className="text-xs text-slate-400">
                    Vehicle
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {booking.ride.vehicleModel || "Vehicle details unavailable"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {booking.ride.vehicleNumber || "Plate unavailable"}
                  </p>
                </div>
              </div>
            </section>}

            {/* Safety */}
            <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
              <div className="flex gap-4">
                <div className="text-2xl">🛡️</div>

                <div>
                  <h2 className="font-semibold text-emerald-900">
                    Your ride is protected
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-emerald-700">
                    Driver verification, trip sharing, emergency assistance
                    and safety reporting are available throughout your ride.
                  </p>

                  <Link
                    href="/safety"
                    className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline"
                  >
                    Open Safety Center
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Fare */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">
                Fare Summary
              </h2>

              <div className="mt-5 space-y-4">
                <FareRow
                  label="Total fare"
                  value={`₹${Math.round(booking.fare)}`}
                />

                <FareRow
                  label="Seats"
                  value={`× ${booking.seatsRequested}`}
                />

                <FareRow
                  label="Service fee"
                  value="₹0"
                />

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      Total Paid
                    </span>

                    <span className="text-xl font-bold text-indigo-700">
                      ₹{Math.round(booking.fare)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-indigo-50 p-4">
                <p className="text-xs font-semibold text-indigo-900">
                  💡 Smart Fare Split
                </p>

                <p className="mt-1 text-xs leading-5 text-indigo-700">
                  Your fare is calculated from the shared route and
                  passenger contribution.
                </p>
              </div>
            </section>

            {/* Actions */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-lg font-semibold">
                Ride Actions
              </h2>

              <div className="mt-5 space-y-3">
                {isAccepted && (
                  <Link href={`/booking/pass?requestId=${booking.id}`} className="block w-full rounded-xl bg-emerald-700 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-800">
                    View Trip Pass
                  </Link>
                )}
                <Link href="/rides/my-requests" className="block w-full rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700">
                  My Requests
                </Link>

                {booking.ride.id ? (
                  <Link
                    href={`/rides/tracking/${booking.ride.id}`}
                    className="block w-full rounded-xl border border-indigo-200 px-5 py-3 text-center text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                  >
                    📍 Track Ride
                  </Link>
                ) : null}

                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  📤 Share Trip
                </button>

                {(booking.status === "PENDING" || booking.status === "ACCEPTED") && (
                  <button
                    onClick={() => void cancelBooking()}
                    disabled={cancelling}
                    className="w-full rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {cancelling ? "Cancelling..." : "Cancel Request"}
                  </button>
                )}
                {actionError && <p role="alert" className="text-sm text-rose-600">{actionError}</p>}
              </div>
            </section>

            {/* Reminder */}
            <section className="rounded-2xl bg-slate-900 p-6 text-white">
              <div className="flex gap-3">
                <span className="text-xl">⏰</span>

                <div>
                  <h3 className="font-semibold">
                    Be ready for pickup
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-300">
                    Please arrive at the pickup point a few minutes before
                    departure.
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* Bottom */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold">
                Need help with your booking?
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Contact Commuto support if you face any issue with this ride.
              </p>
            </div>

            <button className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50">
              Contact Support
            </button>
          </div>
        </section>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-bold">
                    📤
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Share Trip Booking</h3>
                    <p className="text-xs text-slate-500">Send journey details to family and friends</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Trip Summary</p>
                <p className="text-sm font-bold text-slate-900">
                  {booking?.ride?.startLocation || "Origin"} → {booking?.ride?.destination || "Destination"}
                </p>
                <p className="text-xs text-slate-600">
                  🚗 Driver: {booking?.ride?.driver?.fullName || "Commuto Driver"} · {booking?.ride?.vehicleModel} ({booking?.ride?.vehicleNumber})
                </p>
                <p className="text-xs text-slate-500">
                  📅 {booking?.ride?.rideDate} at {booking?.ride?.departureTime}
                </p>
              </div>

              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 transition"
                >
                  <span>💬</span> Share via WhatsApp
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5b5ce2] py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-[#4a4bcf] transition"
                >
                  <span>📱</span> Device Share Options
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSmsShare}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    📨 SMS / Text
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    {shareCopied ? "✓ Link Copied!" : "📋 Copy Link"}
                  </button>
                </div>
              </div>

              {shareCopied && (
                <p className="mt-3 text-center text-xs font-bold text-emerald-600">
                  ✓ Trip tracking URL copied to clipboard!
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading booking...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}

/* ---------- Components ---------- */

function JourneyPoint({
  color,
  title,
  location,
  time,
}: {
  color: string;
  title: string;
  location: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full ${color}`} />

      <div className="flex flex-1 justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400">{title}</p>
          <p className="mt-1 text-sm font-semibold">{location}</p>
        </div>

        <span className="text-sm font-semibold">{time}</span>
      </div>
    </div>
  );
}


function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}


function FareRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}