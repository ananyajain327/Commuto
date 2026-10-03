"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { apiUrl } from "@/lib/api";

interface Ride {
  id: number;
  startLocation: string;
  destination: string;
  rideDate: string;
  departureTime: string;
  availableSeats: number;
  expectedFare: number;
  vehicleModel: string;
  vehicleNumber: string;
  womenOnly?: boolean;
  driver?: {
    id: number;
    fullName: string;
    phone: string;
  };
}

function RideRequestContent() {
  const searchParams = useSearchParams();
  const rideIdParam = searchParams.get("rideId");
  const fromParam = searchParams.get("from") || "";
  const toParam = searchParams.get("to") || "";
  const dateParam = searchParams.get("date") || "";

  const [isCustomMode, setIsCustomMode] = useState(!rideIdParam);

  // Specific ride booking state
  const [ride, setRide] = useState<Ride | null>(null);
  const [loadingRide, setLoadingRide] = useState(false);

  // Custom request state
  const [customFrom, setCustomFrom] = useState(fromParam);
  const [customTo, setCustomTo] = useState(toParam);
  const [customDate, setCustomDate] = useState(dateParam || new Date().toISOString().split("T")[0]);
  const [customTime, setCustomTime] = useState("09:00");
  const [budget, setBudget] = useState("200");
  const [womenOnly, setWomenOnly] = useState(false);

  // Shared booking options
  const [seats, setSeats] = useState(1);
  const [pickupPreference, setPickupPreference] = useState("");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [requested, setRequested] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // GPS auto-detect
  const handleUseCurrentLocation = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`
          );
          if (res.ok) {
            const data = await res.json();
            const road = data.address?.road || "";
            const area =
              data.address?.suburb ||
              data.address?.neighbourhood ||
              data.address?.city ||
              data.address?.town ||
              "";
            const locationStr =
              road && area
                ? `${road}, ${area}`
                : data.display_name?.split(",").slice(0, 3).join(",") ||
                  `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
            
            if (isCustomMode) {
              setCustomFrom(locationStr.trim());
            } else {
              setPickupPreference(locationStr.trim());
            }
          } else {
            const fallback = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
            if (isCustomMode) setCustomFrom(fallback);
            else setPickupPreference(fallback);
          }
        } catch {
          const fallback = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          if (isCustomMode) setCustomFrom(fallback);
          else setPickupPreference(fallback);
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        setDetectingLocation(false);
        alert(
          err.code === 1
            ? "Location permission was denied. Please enter your pickup point manually."
            : "Could not retrieve your location. Please enter your pickup point manually."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fetch specific ride if rideId exists
  useEffect(() => {
    if (!rideIdParam) return;

    async function fetchRideDetails() {
      try {
        setLoadingRide(true);
        const token = localStorage.getItem("token");
        const res = await fetch(apiUrl(`/api/rides/${rideIdParam}`), {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          setIsCustomMode(true);
          return;
        }

        const data: Ride = await res.json();
        setRide(data);
        if (data.startLocation) {
          setPickupPreference(data.startLocation);
        }
      } catch {
        setIsCustomMode(true);
      } finally {
        setLoadingRide(false);
      }
    }

    void fetchRideDetails();
  }, [rideIdParam]);

  const farePerSeat =
    ride && ride.availableSeats > 0
      ? Math.round(ride.expectedFare / ride.availableSeats)
      : ride?.expectedFare || Number(budget) || 0;

  const totalFare = isCustomMode ? Number(budget) * seats : farePerSeat * seats;

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Please login first to send a ride request.");
        setSubmitting(false);
        return;
      }

      if (isCustomMode) {
        if (!customFrom.trim() || !customTo.trim()) {
          setErrorMessage("Please enter both pickup point and destination.");
          setSubmitting(false);
          return;
        }

        // Check if there is an existing matching ride in backend
        const searchRes = await fetch(
          apiUrl(`/api/rides/search?from=${encodeURIComponent(customFrom.trim())}&to=${encodeURIComponent(customTo.trim())}`),
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(() => null);

        let targetRideId = rideIdParam ? Number(rideIdParam) : null;

        if (searchRes && searchRes.ok) {
          const matchingRides = await searchRes.json().catch(() => []);
          if (Array.isArray(matchingRides) && matchingRides.length > 0) {
            targetRideId = matchingRides[0].id;
          }
        }

        // If a matching ride is available in backend, create live request
        if (targetRideId) {
          await fetch(apiUrl("/api/ride-requests"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              rideId: targetRideId,
              seatsRequested: seats,
              pickupPreference: customFrom.trim(),
              note: note.trim() || `Custom travel request for ${customDate} at ${customTime}. Budget: ₹${budget}/seat.`,
            }),
          });
        }

        // Save custom request locally so passenger can see in My Requests
        const storedRequests = JSON.parse(localStorage.getItem("custom_ride_requests") || "[]");
        const newReq = {
          id: Date.now(),
          from: customFrom.trim(),
          to: customTo.trim(),
          date: customDate,
          time: customTime,
          seats,
          budget: Number(budget),
          womenOnly,
          note: note.trim(),
          status: "BROADCASTED",
          createdAt: new Date().toISOString(),
        };
        storedRequests.unshift(newReq);
        localStorage.setItem("custom_ride_requests", JSON.stringify(storedRequests));

        setRequested(true);
      } else {
        // Specific ride booking
        const res = await fetch(apiUrl("/api/ride-requests"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rideId: Number(rideIdParam),
            seatsRequested: seats,
            pickupPreference: pickupPreference.trim() || ride?.startLocation || "Pickup Point",
            note: note.trim(),
          }),
        });

        const responseData = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(
            responseData?.message ||
              (res.status === 403
                ? "You cannot request this ride (Already requested or invalid role)"
                : "Failed to send ride request.")
          );
        }

        setRequested(true);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong while sending request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRide) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-500 font-medium">Loading ride details...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-6 py-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-xs dark:bg-emerald-600">
              🚗
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Commuto<span className="text-emerald-500">.</span>
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Ride Request Center
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/rides/search"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              ← Search Rides
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700 shadow-xs dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <span>⚠</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {requested ? (
          /* SUCCESS BANNER */
          <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              ✓
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-900 dark:text-white">
              {isCustomMode ? "Ride Request Broadcasted!" : "Ride Request Sent!"}
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
              {isCustomMode
                ? "Your custom travel request has been posted to our network. Verified drivers traveling along this route will see your request and can offer you a ride."
                : `Your seat request has been sent to ${ride?.driver?.fullName || "the driver"}. You will receive a notification once confirmed.`}
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50 p-5 text-left dark:border-slate-800 dark:bg-slate-800/60">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Route</span>
                <span className="text-slate-900 dark:text-white">
                  {isCustomMode ? `${customFrom} → ${customTo}` : `${ride?.startLocation} → ${ride?.destination}`}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Seats & Fare</span>
                <span className="text-slate-900 dark:text-white">
                  {seats} seat(s) · ₹{totalFare}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/rides"
                className="rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-emerald-500"
              >
                View My Rides & Requests →
              </Link>
              <Link
                href="/dashboard"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Back to Dashboard
              </Link>
            </div>
          </section>
        ) : (
          /* REQUEST FORM */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mode Selector Tabs */}
            <div className="flex rounded-2xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
                  isCustomMode
                    ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-800 dark:text-emerald-400"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                📢 Custom Travel Request (No Ride Found)
              </button>
              {ride && (
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
                    !isCustomMode
                      ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-800 dark:text-emerald-400"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  🚗 Request Seat on Selected Ride
                </button>
              )}
            </div>

            {/* MAIN CARD */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <div className="border-b border-slate-100 pb-5 dark:border-slate-800">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  {isCustomMode ? "Post Travel Request" : "Selected Ride Request"}
                </p>
                <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                  {isCustomMode
                    ? "Can't find a ride? Request your route"
                    : `Request Seat: ${ride?.startLocation} → ${ride?.destination}`}
                </h1>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {isCustomMode
                    ? "Post where and when you want to travel. Drivers going that way can accept and pick you up."
                    : `Driver: ${ride?.driver?.fullName || "Verified Driver"} · ${ride?.vehicleModel} (${ride?.vehicleNumber})`}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {isCustomMode ? (
                  <>
                    {/* Pickup Location */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Pickup Point / Starting Location *
                        </label>
                        <button
                          type="button"
                          onClick={handleUseCurrentLocation}
                          disabled={detectingLocation}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          {detectingLocation ? "Detecting GPS..." : "📍 Use Current Location"}
                        </button>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">📍</span>
                        <input
                          type="text"
                          required
                          value={customFrom}
                          onChange={(e) => setCustomFrom(e.target.value)}
                          placeholder="e.g. Vaishali Nagar, Jaipur"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    {/* Destination */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Destination / Drop-off Point *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">🎯</span>
                        <input
                          type="text"
                          required
                          value={customTo}
                          onChange={(e) => setCustomTo(e.target.value)}
                          placeholder="e.g. Ajmer Bus Stand"
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Travel Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Preferred Departure Time *
                        </label>
                        <input
                          type="time"
                          required
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Budget Offer */}
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Offered Fare per seat (₹)
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="5000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="e.g. 250"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Specific Ride Selected Pickup Landmark */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Your Pickup Landmark
                        </label>
                        <button
                          type="button"
                          onClick={handleUseCurrentLocation}
                          disabled={detectingLocation}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          {detectingLocation ? "Detecting GPS..." : "📍 Use Current Location"}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={pickupPreference}
                        onChange={(e) => setPickupPreference(e.target.value)}
                        placeholder={ride?.startLocation || "Enter landmark for driver"}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </>
                )}

                {/* Number of Seats */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Seats Needed
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSeats(num)}
                        className={`flex-1 rounded-xl border py-2.5 text-xs font-bold transition cursor-pointer ${
                          seats === num
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                            : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {num} {num === 1 ? "Seat" : "Seats"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Women-only Preference */}
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👩</span>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Women-Only Preference</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Match exclusively with female drivers & co-passengers</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={womenOnly}
                    onChange={(e) => setWomenOnly(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Notes / Luggage Details (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. 1 small backpack, traveling for university exam..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Total Fare Breakdown */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        {isCustomMode ? "Estimated Total Offer" : "Total Ride Fare"}
                      </p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        {seats} seat(s) × ₹{isCustomMode ? budget : farePerSeat}
                      </p>
                    </div>
                    <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                      ₹{totalFare}
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
                >
                  {submitting
                    ? "Submitting Request..."
                    : isCustomMode
                    ? "📢 Broadcast Ride Request to Drivers →"
                    : "Send Ride Request →"}
                </button>
              </div>
            </section>
          </form>
        )}
      </div>
    </main>
  );
}

export default function RideRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <p className="text-slate-500 font-medium">Loading request form...</p>
        </div>
      }
    >
      <RideRequestContent />
    </Suspense>
  );
}