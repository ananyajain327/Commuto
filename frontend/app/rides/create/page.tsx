"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiUrl } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

function CreateRideContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [womenOnly, setWomenOnly] = useState(false);
  const [startLocation, setStartLocation] = useState(() => searchParams.get("from") || "");
  const [destination, setDestination] = useState(() => searchParams.get("to") || "");
  const [rideDate, setRideDate] = useState(() => searchParams.get("date") || new Date().toISOString().split("T")[0]);
  const [departureTime, setDepartureTime] = useState("09:00");
  const [availableSeats, setAvailableSeats] = useState("3");
  const [expectedFare, setExpectedFare] = useState("250");
  const [vehicleModel, setVehicleModel] = useState("Maruti Suzuki Dzire");
  const [vehicleNumber, setVehicleNumber] = useState("RJ14 AB 1234");
  const [notes, setNotes] = useState("AC Ride. Luggage space available. Please reach pickup on time.");

  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
            setStartLocation(locationStr.trim());
          } else {
            setStartLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          }
        } catch {
          setStartLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        setDetectingLocation(false);
        alert(
          err.code === 1
            ? "Location permission was denied. Please enter your pickup point manually."
            : "Could not retrieve your GPS location. Please enter starting point manually."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePublishRide = async () => {
    setMessage("");
    setError("");

    const start = startLocation.trim();
    const dest = destination.trim();
    const vModel = vehicleModel.trim();
    const vNumber = vehicleNumber.trim();
    const fareNum = Number(expectedFare);
    const seatsNum = Number(availableSeats);

    if (!start || !dest || !rideDate || !departureTime || !expectedFare || !vModel || !vNumber) {
      setError("Please fill all required ride details (route, date, departure time, fare, vehicle).");
      return;
    }

    if (seatsNum < 1 || seatsNum > 6) {
      setError("Available seats must be between 1 and 6.");
      return;
    }

    if (fareNum <= 0) {
      setError("Expected fare must be greater than 0.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login before publishing a ride.");
      return;
    }

    // Format departureTime as "HH:mm"
    let formattedTime = departureTime.trim();
    if (/^\d:\d\d$/.test(formattedTime)) {
      formattedTime = "0" + formattedTime;
    }
    if (formattedTime.length === 5) {
      formattedTime = formattedTime + ":00";
    }

    try {
      setLoading(true);

      const response = await fetch(apiUrl("/api/rides"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startLocation: start,
          destination: dest,
          rideDate,
          departureTime: formattedTime.slice(0, 5),
          availableSeats: seatsNum,
          expectedFare: fareNum,
          vehicleModel: vModel,
          vehicleNumber: vNumber,
          womenOnly,
          notes: notes.trim(),
        }),
      });

      let data: ApiErrorResponse | null = null;
      try {
        data = (await response.json()) as ApiErrorResponse;
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to publish ride. Please verify your details and try again."
        );
      }

      setMessage("Ride published successfully! 🚗 Passengers can now find and book seats.");

      setTimeout(() => {
        router.push("/rides");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while publishing the ride."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white shadow-xs dark:bg-emerald-600">
              C
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Commuto<span className="text-emerald-500">.</span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Smart Mobility
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero */}
        <section className="mb-8 rounded-3xl bg-slate-900 px-8 py-8 text-white shadow-xl dark:bg-slate-900 dark:border dark:border-slate-800">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            Publish & Share Journey
          </p>

          <h1 className="text-2xl font-black sm:text-3xl md:text-4xl">
            Offer a Ride.
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-300 sm:text-sm md:leading-6">
            Publish your empty seats, split fuel costs, and let Commuto find verified passengers travelling along your route.
          </p>
        </section>

        {/* Success Message */}
        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-800 shadow-xs dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
            ✓ {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-700 shadow-xs dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ride Details</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Enter origin, destination, departure schedule and vehicle info.
              </p>
            </div>

            <div className="space-y-6">
              {/* Route */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Route & Corridor
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Starting point (Origin)
                      </label>
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        disabled={detectingLocation}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-500 transition cursor-pointer dark:text-emerald-400"
                      >
                        <span className={detectingLocation ? "animate-spin" : ""}>🎯</span>
                        <span>{detectingLocation ? "Locating..." : "Use Current Location"}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        📍
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Jaipur, Mansarovar"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <InputField
                    label="Destination"
                    icon="🎯"
                    placeholder="e.g. Ajmer, Bus Stand"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>

              {/* Schedule */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Schedule
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Travel date"
                    icon="📅"
                    type="date"
                    value={rideDate}
                    onChange={(e) => setRideDate(e.target.value)}
                  />

                  <InputField
                    label="Departure time"
                    icon="🕐"
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Seats & Fare */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Capacity & Pricing
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Available seats
                    </label>

                    <select
                      value={availableSeats}
                      onChange={(e) => setAvailableSeats(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="1">1 Seat</option>
                      <option value="2">2 Seats</option>
                      <option value="3">3 Seats</option>
                      <option value="4">4 Seats</option>
                      <option value="5">5 Seats</option>
                      <option value="6">6 Seats</option>
                    </select>
                  </div>

                  <InputField
                    label="Fare per passenger (₹)"
                    icon="₹"
                    placeholder="e.g. 250"
                    type="number"
                    value={expectedFare}
                    onChange={(e) => setExpectedFare(e.target.value)}
                  />
                </div>
              </div>

              {/* Vehicle */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Vehicle Information
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Vehicle Model"
                    icon="🚗"
                    placeholder="e.g. Maruti Suzuki Dzire"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                  />

                  <InputField
                    label="Registration Number"
                    icon="🔢"
                    placeholder="e.g. RJ14 AB 1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Preferences & Guidelines
                </h3>

                <div className="space-y-4">
                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Women Only Ride</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Allow booking requests from female co-passengers only.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={womenOnly}
                      onChange={(e) => setWomenOnly(e.target.checked)}
                      className="h-5 w-5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </label>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Trip Notes / Pickup Instructions
                    </label>

                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. AC available, trunk space for medium bags, please arrive 5 minutes early."
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handlePublishRide}
                  className="w-full rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white shadow-md shadow-emerald-950/20 transition hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Publishing Ride..." : "Publish Ride Now 🚗"}
                </button>
              </div>
            </div>
          </section>

          {/* Ride Preview Sticky Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Live Preview
              </p>
              <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">Your Commute</h3>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    A
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Pickup</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {startLocation || "Starting location"}
                    </p>
                  </div>
                </div>

                <div className="ml-3 h-4 border-l-2 border-dashed border-slate-200 dark:border-slate-700" />

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    B
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Dropoff</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {destination || "Destination"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p className="text-[10px] font-semibold text-slate-400">Schedule</p>
                  <p className="mt-0.5 text-xs font-bold text-slate-900 dark:text-white">
                    {rideDate || "Date"} • {departureTime || "Time"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <p className="text-[10px] font-semibold text-slate-400">Expected Fare</p>
                  <p className="mt-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{expectedFare || "0"} / seat
                  </p>
                </div>
              </div>

              {womenOnly && (
                <div className="mt-4 rounded-xl bg-pink-50 p-2.5 text-center text-xs font-bold text-pink-700 dark:bg-pink-950/40 dark:text-pink-300">
                  🌸 Women-only Ride Enabled
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function CreateRidePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading ride publisher...</div>}>
      <CreateRideContent />
    </Suspense>
  );
}

function InputField({
  label,
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  icon: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
          {icon}
        </span>

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
    </div>
  );
}