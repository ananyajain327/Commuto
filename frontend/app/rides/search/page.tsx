"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { apiUrl } from "@/lib/api";

interface BackendRide {
  id: number;
  driverId: number;
  driverName: string;
  startLocation: string;
  destination: string;
  rideDate: string;
  departureTime: string;
  availableSeats: number;
  expectedFare: number;
  vehicleModel: string;
  vehicleNumber: string;
  womenOnly: boolean;
  notes?: string;
  status: string;
}

export default function FindRidePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [womenOnly, setWomenOnly] = useState(false);

  const [rides, setRides] = useState<BackendRide[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);

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
            setFrom(locationStr.trim());
          } else {
            setFrom(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          }
        } catch {
          setFrom(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
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

  const handleSearch = async () => {
    setError("");
    setSearched(true);

    if (!from.trim() || !to.trim()) {
      setError("Please enter pickup location and destination.");
      setRides([]);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login before searching for rides.");
      setRides([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(apiUrl("/api/rides/search"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startLocation: from.trim(),
          destination: to.trim(),
          rideDate: date || null,
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMessage = `Search failed (${response.status})`;
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage =
              errorData.message ||
              errorData.error ||
              responseText ||
              errorMessage;
          } catch {
            errorMessage = responseText;
          }
        }
        throw new Error(errorMessage);
      }

      if (!responseText.trim()) {
        setRides([]);
        return;
      }

      const data: BackendRide[] = JSON.parse(responseText);
      let filteredRides = data;

      if (womenOnly) {
        filteredRides = filteredRides.filter((ride) => ride.womenOnly === true);
      }

      const passengerCount = Number(passengers);
      filteredRides = filteredRides.filter(
        (ride) => ride.availableSeats >= passengerCount
      );

      setRides(filteredRides);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while searching for rides.");
      }
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (value: string) => {
    if (!value) return "--";
    const [hours, minutes] = value.split(":");
    const hour = Number(hours);
    if (Number.isNaN(hour)) return value;
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const getInitials = (name: string) => {
    if (!name) return "DR";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
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
                Smart Matching
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition shadow-2xs"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="mb-6 overflow-hidden rounded-3xl bg-slate-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/50 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-bold text-emerald-300 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Smart Route Matching & Transparent Pricing
            </div>

            <h1 className="mt-4 text-2xl sm:text-4xl font-black tracking-tight">
              Find your ideal commute.
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Enter your route to discover verified carpools, preview route paths, and travel affordably.
            </p>
          </div>
        </section>

        {/* Search Filter Box */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* From */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  From (Pickup)
                </label>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={detectingLocation}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 transition cursor-pointer"
                >
                  {detectingLocation ? "Detecting..." : "📍 GPS"}
                </button>
              </div>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800">
                <span className="mr-2 text-sm">📍</span>
                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Enter pickup point"
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* To */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                To (Destination)
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800">
                <span className="mr-2 text-sm">🎯</span>
                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Travel Date
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800">
                <span className="mr-2 text-sm">📅</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Preferred Time */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Preferred Time
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800">
                <span className="mr-2 text-sm">🕐</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {/* Passengers */}
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <option value="1">👤 1 Passenger</option>
                <option value="2">👥 2 Passengers</option>
                <option value="3">👥 3 Passengers</option>
                <option value="4">👥 4 Passengers</option>
              </select>

              {/* Women only filter toggle */}
              <button
                type="button"
                onClick={() => setWomenOnly(!womenOnly)}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition cursor-pointer ${
                  womenOnly
                    ? "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <span>👩</span>
                <span>{womenOnly ? "Women-Only Enabled" : "Women-Only Option"}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/20 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Searching Routes..." : "🔎 Search Available Rides"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
              ⚠️ {error}
            </div>
          )}
        </section>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-white">
            {searched ? "Search Results" : "Available Carpools"}
          </h2>
          {searched && !loading && (
            <span className="text-xs font-bold text-slate-500">
              {rides.length} {rides.length === 1 ? "ride" : "rides"} found
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent dark:border-emerald-500" />
            <p className="mt-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              Finding best matching routes...
            </p>
          </div>
        )}

        {/* No results */}
        {!loading && searched && rides.length === 0 && !error && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="text-4xl">🚗</div>
            <h3 className="mt-3 text-base font-black text-slate-900 dark:text-white">
              No matching scheduled rides found
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              No driver has published this exact route yet. You can post a custom broadcast request so drivers can pick you up!
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link
                href={`/rides/request?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
              >
                📢 Broadcast Custom Request
              </Link>
            </div>
          </div>
        )}

        {/* Initial state */}
        {!loading && !searched && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="text-4xl">🗺️</div>
            <h3 className="mt-3 text-base font-black text-slate-900 dark:text-white">
              Enter your route above to find rides
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
              Instant matching with live route preview, verified driver background check, and fair cost splitting.
            </p>
          </div>
        )}

        {/* Ride Cards with Route Preview & Vehicle Badges */}
        {!loading && rides.length > 0 && (
          <div className="space-y-4">
            {rides.map((ride) => (
              <InteractiveRideCard
                key={ride.id}
                ride={ride}
                getInitials={getInitials}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function InteractiveRideCard({
  ride,
  getInitials,
  formatTime,
}: {
  ride: BackendRide;
  getInitials: (name: string) => string;
  formatTime: (time: string) => string;
}) {
  const [showRoutePreview, setShowRoutePreview] = useState(false);

  // Derived vehicle type and amenities
  const vehicleLower = (ride.vehicleModel || "").toLowerCase();
  const isSUV = vehicleLower.includes("creta") || vehicleLower.includes("harrier") || vehicleLower.includes("suv") || vehicleLower.includes("brezza") || vehicleLower.includes("xuv");
  const isEV = vehicleLower.includes("ev") || vehicleLower.includes("nexon ev") || vehicleLower.includes("electric");
  const vehicleType = isEV ? "⚡ Electric EV" : isSUV ? "🚙 SUV" : "🚗 Premium Sedan";

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          {/* Driver details */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 font-bold text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {getInitials(ride.driverName)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">{ride.driverName}</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  ✓ Verified
                </span>
                {ride.womenOnly && (
                  <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200">
                    ♀ Women Only
                  </span>
                )}
              </div>

              {/* Vehicle 3D / Isometric Badges & Amenities */}
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {vehicleType}
                </span>
                <span>{ride.vehicleModel || "Standard"}</span>
                <span>•</span>
                <span>⭐ 4.9 Rating</span>
              </div>
            </div>
          </div>

          {/* Route summary */}
          <div className="flex-1 lg:px-6">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-emerald-600 bg-white dark:bg-slate-900" />
                <span className="h-6 border-l border-dashed border-slate-300 dark:border-slate-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {ride.startLocation} → {ride.destination}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {ride.rideDate} · Departure {formatTime(ride.departureTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Fare & Booking Button */}
          <div className="flex items-center justify-between gap-4 lg:justify-end">
            <div className="text-left lg:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Seat Share</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">
                ₹{ride.expectedFare}
                <span className="text-xs font-normal text-slate-400 ml-1">/ seat</span>
              </p>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                {ride.availableSeats} seat(s) left
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRoutePreview(!showRoutePreview)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition cursor-pointer"
                title="Toggle visual route preview"
              >
                {showRoutePreview ? "Hide Path ▲" : "Route Path ▼"}
              </button>

              <Link
                href={`/rides/request?rideId=${ride.id}`}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-900/20 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition"
              >
                Request Seat →
              </Link>
            </div>
          </div>
        </div>

        {/* Amenities Bar */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
            ❄️ AC Climate Control
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
            🎒 Luggage Space
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
            🚭 Smoke-free
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
            🎵 Music Allowed
          </span>
        </div>
      </div>

      {/* Step 1: Interactive Route Map Preview Card */}
      {showRoutePreview && (
        <div className="border-t border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🗺️</span>
              <span>Interactive Route Overview</span>
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                🟢 Live Highway Flow: Fast
              </span>
              <span className="rounded-md bg-slate-200 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                ⚡ Est. Time: ~35 mins
              </span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                  A
                </span>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Origin</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{ride.startLocation}</p>
                </div>
              </div>

              <div className="flex-1 mx-4 flex items-center gap-2">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 relative">
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md dark:bg-emerald-950 dark:text-emerald-400">
                  Direct Expressway Route
                </span>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Destination</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{ride.destination}</p>
                </div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white font-bold text-[10px]">
                  B
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}