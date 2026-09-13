"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRidePage() {
  const router = useRouter();

  const [womenOnly, setWomenOnly] = useState(false);

  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [rideDate, setRideDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [availableSeats, setAvailableSeats] = useState("1");
  const [expectedFare, setExpectedFare] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePublishRide = async () => {
    setMessage("");
    setError("");

    if (
      !startLocation.trim() ||
      !destination.trim() ||
      !rideDate ||
      !departureTime ||
      !expectedFare ||
      !vehicleModel.trim() ||
      !vehicleNumber.trim()
    ) {
      setError("Please fill all required ride details.");
      return;
    }

    if (Number(availableSeats) < 1 || Number(availableSeats) > 6) {
      setError("Available seats must be between 1 and 6.");
      return;
    }

    if (Number(expectedFare) <= 0) {
      setError("Expected fare must be greater than 0.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login as a driver before publishing a ride.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startLocation: startLocation.trim(),
          destination: destination.trim(),
          rideDate,
          departureTime,
          availableSeats: Number(availableSeats),
          expectedFare: Number(expectedFare),
          vehicleModel: vehicleModel.trim(),
          vehicleNumber: vehicleNumber.trim(),
          womenOnly,
          notes: notes.trim(),
        }),
      });

      let data: any = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to publish ride. Please try again."
        );
      }

      setMessage("Ride published successfully! 🚗");

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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-2xl font-bold tracking-tight">
              Commuto<span className="text-blue-600">.</span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Share your journey with trusted co-passengers
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

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Hero */}
        <section className="mb-8 rounded-3xl bg-slate-900 px-8 py-9 text-white shadow-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Driver Dashboard
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Offer a Ride.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
            Publish your journey, share your available seats and let Commuto
            find passengers travelling along your route.
          </p>
        </section>

        {/* Success Message */}
        {message && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
            ✓ {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            ⚠ {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Form */}
          <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-7">
              <h2 className="text-xl font-bold">Ride details</h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the details of your upcoming journey.
              </p>
            </div>

            <div className="space-y-6">
              {/* Route */}
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                  Journey
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Starting point"
                    icon="📍"
                    placeholder="e.g. Jaipur"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                  />

                  <InputField
                    label="Destination"
                    icon="🎯"
                    placeholder="e.g. Ajmer"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>

              {/* Date Time */}
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                  Schedule
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
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
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                  Ride preferences
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Available seats
                    </label>

                    <select
                      value={availableSeats}
                      onChange={(e) => setAvailableSeats(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
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
                    label="Expected fare per passenger"
                    icon="₹"
                    placeholder="e.g. 350"
                    type="number"
                    value={expectedFare}
                    onChange={(e) => setExpectedFare(e.target.value)}
                  />
                </div>
              </div>

              {/* Vehicle */}
              <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
                  Vehicle information
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Vehicle model"
                    icon="🚗"
                    placeholder="e.g. Hyundai Creta"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                  />

                  <InputField
                    label="Vehicle number"
                    icon="🔢"
                    placeholder="e.g. RJ14AB1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Women Only */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <button
                  type="button"
                  onClick={() => setWomenOnly(!womenOnly)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        womenOnly ? "bg-pink-100" : "bg-white"
                      }`}
                    >
                      👩
                    </div>

                    <div>
                      <p className="text-sm font-bold">
                        Women-only ride
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Only accept female passengers for this ride
                      </p>
                    </div>
                  </div>

                  <div
                    className={`h-6 w-11 rounded-full p-1 transition ${
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
              </div>

              {/* Notes */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Additional notes
                </label>

                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add pickup instructions, luggage information, etc."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white"
                />
              </div>

              {/* Publish */}
              <button
                type="button"
                onClick={handlePublishRide}
                disabled={loading}
                className={`w-full rounded-xl px-6 py-4 text-sm font-bold text-white shadow-lg transition ${
                  loading
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-blue-600 shadow-blue-600/20 hover:bg-blue-700"
                }`}
              >
                {loading ? "Publishing Ride..." : "🚀 Publish Ride"}
              </button>
            </div>
          </section>

          {/* Summary */}
          <aside className="h-fit space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-blue-600">
                RIDE PREVIEW
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Your journey
              </h2>

              <div className="my-6 space-y-5">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="h-3 w-3 rounded-full border-2 border-blue-600" />
                    <span className="h-10 border-l border-dashed border-slate-300" />
                    <span className="h-3 w-3 rounded-full bg-blue-600" />
                  </div>

                  <div className="space-y-5">
                    <div>
                      <p className="text-xs text-slate-400">FROM</p>
                      <p className="font-bold">
                        {startLocation || "Not selected"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">TO</p>
                      <p className="font-bold">
                        {destination || "Not selected"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoBox
                  title="Date"
                  value={rideDate || "Not selected"}
                />

                <InfoBox
                  title="Time"
                  value={departureTime || "Not selected"}
                />

                <InfoBox
                  title="Seats"
                  value={`${availableSeats} ${
                    Number(availableSeats) === 1 ? "Seat" : "Seats"
                  }`}
                />

                <InfoBox
                  title="Fare"
                  value={expectedFare ? `₹${expectedFare}` : "₹ —"}
                />
              </div>
            </div>

            {/* Safety */}
            <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                🛡️
              </div>

              <h3 className="font-bold">Ride safety</h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Verified passengers, ratings and Commuto's safety features
                help make every shared journey more trustworthy.
              </p>

              <div className="mt-4 space-y-2 text-xs font-semibold text-slate-600">
                <p>✓ Verified profiles</p>
                <p>✓ Passenger ratings</p>
                <p>✓ Emergency SOS</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InputField({
  label,
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  icon: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-500 focus-within:bg-white">
        <span className="mr-3 text-lg">{icon}</span>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}