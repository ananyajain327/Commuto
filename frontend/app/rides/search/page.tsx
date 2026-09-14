"use client";

import { useState } from "react";

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

    const response = await fetch(
      "http://localhost:8080/api/rides/search",
      {
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
      }
    );

    // First read response as text
    const responseText = await response.text();

    console.log("Search API status:", response.status);
    console.log("Search API response:", responseText);

    // Backend returned an error
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

    // Empty successful response
    if (!responseText.trim()) {
      setRides([]);
      return;
    }

    const data: BackendRide[] = JSON.parse(responseText);

    let filteredRides = data;

    // Women-only filter
    if (womenOnly) {
      filteredRides = filteredRides.filter(
        (ride) => ride.womenOnly === true
      );
    }

    // Passenger count filter
    const passengerCount = Number(passengers);

    filteredRides = filteredRides.filter(
      (ride) => ride.availableSeats >= passengerCount
    );

    setRides(filteredRides);
  } catch (err) {
    console.error("Ride search error:", err);

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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-2xl font-bold tracking-tight text-slate-900">
              Commuto<span className="text-blue-600">.</span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Find a ride that fits your journey
            </p>
          </div>

          <a
            href="/dashboard"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <section className="mb-8">
          <div className="rounded-3xl bg-slate-900 px-8 py-9 text-white shadow-xl">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
                Smart Ride Matching
              </p>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Find your perfect ride.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
                Tell us where you are going and Commuto will help you discover
                rides that match your route, timing and preferences.
              </p>
            </div>
          </div>
        </section>

        {/* Search Box */}
        <section className="-mt-2 mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-bold">Search for a ride</h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your journey details below.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* From */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                From
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500 focus-within:bg-white">
                <span className="mr-3 text-lg">📍</span>

                <input
                  type="text"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Pickup location"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* To */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                To
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500 focus-within:bg-white">
                <span className="mr-3 text-lg">🎯</span>

                <input
                  type="text"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Destination"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Date
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500 focus-within:bg-white">
                <span className="mr-3 text-lg">📅</span>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Preferred Time
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500 focus-within:bg-white">
                <span className="mr-3 text-lg">🕐</span>

                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-5 border-t border-slate-100 pt-6 md:flex-row md:items-end md:justify-between">
            {/* Passengers */}
            <div className="w-full md:max-w-xs">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Passengers
              </label>

              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="1">1 Passenger</option>
                <option value="2">2 Passengers</option>
                <option value="3">3 Passengers</option>
                <option value="4">4 Passengers</option>
              </select>
            </div>

            {/* Women only */}
            <button
              type="button"
              onClick={() => setWomenOnly(!womenOnly)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                womenOnly
                  ? "border-pink-300 bg-pink-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  womenOnly ? "bg-pink-100" : "bg-slate-100"
                }`}
              >
                👩
              </div>

              <div>
                <p className="text-sm font-bold">Women-only rides</p>

                <p className="text-xs text-slate-500">
                  {womenOnly
                    ? "Preference enabled"
                    : "Show women-only rides"}
                </p>
              </div>

              <div
                className={`ml-3 h-6 w-11 rounded-full p-1 transition ${
                  womenOnly ? "bg-pink-500" : "bg-slate-300"
                }`}
              >
                <div
                  className={`h-4 w-4 rounded-full bg-white transition ${
                    womenOnly ? "translate-x-5" : ""
                  }`}
                />
              </div>
            </button>

            {/* Search */}
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Searching..." : "🔎 Find Rides"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}
        </section>

        {/* Results heading */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              {searched ? "SEARCH RESULTS" : "AVAILABLE RIDES"}
            </p>

            <h2 className="mt-1 text-2xl font-bold">Available rides</h2>
          </div>

          {searched && !loading && (
            <p className="text-sm text-slate-500">
              {rides.length} {rides.length === 1 ? "ride" : "rides"} found
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="font-semibold text-slate-700">
              Finding the best rides for you...
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Checking available rides.
            </p>
          </div>
        )}

        {/* No results */}
        {!loading && searched && rides.length === 0 && !error && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="text-5xl">🚗</div>

            <h3 className="mt-4 text-xl font-bold">
              No rides found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              We couldn't find a ride matching your journey. Try another date,
              route, or turn off the women-only filter.
            </p>
          </div>
        )}

        {/* Initial state */}
        {!loading && !searched && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="text-5xl">🗺️</div>

            <h3 className="mt-4 text-xl font-bold">
              Search for your journey
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Enter your pickup location and destination above to discover
              available Commuto rides.
            </p>
          </div>
        )}

        {/* Ride Cards */}
        {!loading && rides.length > 0 && (
          <div className="space-y-5">
            {rides.map((ride) => (
              <RideCard
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

function RideCard({
  ride,
  getInitials,
  formatTime,
}: {
  ride: BackendRide;
  getInitials: (name: string) => string;
  formatTime: (time: string) => string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Driver */}
        <div className="flex min-w-[220px] items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white">
            {getInitials(ride.driverName)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{ride.driverName}</h3>

              <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-600">
                ✓ VERIFIED
              </span>
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="text-yellow-500">★</span>

              <span className="font-semibold">New</span>

              <span className="text-slate-400">Driver</span>
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="h-3 w-3 rounded-full border-2 border-blue-600" />

              <span className="h-7 border-l border-dashed border-slate-300" />

              <span className="h-3 w-3 rounded-full bg-blue-600" />
            </div>

            <div>
              <p className="text-sm font-bold">
                {ride.startLocation} → {ride.destination}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {ride.vehicleModel} • {ride.vehicleNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="min-w-[110px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Departure
          </p>

          <p className="mt-1 text-lg font-bold">
            {formatTime(ride.departureTime)}
          </p>
        </div>

        {/* Match */}
        <div className="min-w-[100px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Route Match
          </p>

          <p className="mt-1 text-lg font-bold text-green-600">
            Available
          </p>
        </div>

        {/* Fare */}
        <div className="min-w-[90px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Est. Fare
          </p>

          <p className="mt-1 text-xl font-bold">
            ₹{ride.expectedFare}
          </p>

          <p className="text-xs text-slate-400">
            {ride.availableSeats} seats left
          </p>
        </div>

        {/* Action */}
        <div className="flex flex-col gap-2">
          {ride.womenOnly && (
            <span className="rounded-lg bg-pink-50 px-3 py-1.5 text-center text-xs font-bold text-pink-600">
              👩 Women Only
            </span>
          )}

          <a
            href={`/rides/request?rideId=${ride.id}`}
            className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-600"
          >
            Request Ride
          </a>
        </div>
      </div>
    </div>
  );
}