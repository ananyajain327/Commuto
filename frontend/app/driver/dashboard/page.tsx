"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api";

interface DriverRequestSummary {
  requestId: number;
  rideId: number;
  passengerName: string;
  passengerPhone: string;
  passengerRating: number;
  route: string;
  rideDate: string;
  departureTime: string;
  fare: number;
  status: string;
}

interface DriverRideSummary {
  id: number;
  startLocation: string;
  destination: string;
  rideDate: string;
  departureTime: string;
  availableSeats: number;
  expectedFare: number;
  status: string;
}

interface DriverAnalytics {
  driverName: string;
  isVerified: boolean;
  todayEarnings: number;
  todayRides: number;
  todayCompletedRides: number;
  totalRating: number;
  totalRatingCount: number;
  totalDistanceKm: number;
  weekEarnings: number;
  monthEarnings: number;
  averagePerRide: number;
  activeRides: number;
  upcomingRides: number;
  totalCompletedRides: number;
  totalRides: number;
  pendingRequests: DriverRequestSummary[];
  nextUpcomingRide: DriverRideSummary | null;
}

export default function DriverDashboard() {
  const [online, setOnline] = useState(false);
  const [analytics, setAnalytics] = useState<DriverAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    const loadAnalytics = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (isCurrent) setLoading(false);
        return;
      }

      try {
        const response = await fetch(apiUrl("/api/driver/analytics"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok && isCurrent) {
          const data = (await response.json()) as DriverAnalytics;
          setAnalytics(data);
        }
      } catch {
        // Keep fallback values gracefully if not authenticated
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    void loadAnalytics();
    return () => {
      isCurrent = false;
    };
  }, []);

  const driverName = analytics?.driverName || "Driver Partner";
  const initials = driverName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "DP";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Driver Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your rides, earnings and driver activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{driverName}</p>
              <p className="text-xs text-slate-500">
                {analytics?.isVerified ? "✓ Verified Driver" : "Verification Pending"}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Online Status */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  online ? "bg-emerald-100" : "bg-slate-100"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full ${
                    online ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
              </div>

              <div>
                <p className="text-lg font-semibold">
                  {online ? "You are Online" : "You are Offline"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {online
                    ? "You can now receive ride requests in real time."
                    : "Go online when you're ready to accept rides."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setOnline(!online)}
              className={`rounded-xl px-6 py-3 text-sm font-semibold text-white transition ${
                online
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {online ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </section>

        {/* Dynamic Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Today's Earnings"
            value={analytics ? `₹${analytics.todayEarnings.toFixed(0)}` : "₹0"}
            subtitle={
              analytics && analytics.todayEarnings > 0
                ? `${analytics.todayCompletedRides} trip(s) completed today`
                : "No rides completed today"
            }
            icon="₹"
          />

          <StatCard
            title="Today's Rides"
            value={analytics ? `${analytics.todayRides}` : "0"}
            subtitle={
              analytics
                ? `${analytics.todayCompletedRides} completed · ${analytics.upcomingRides} upcoming`
                : "0 scheduled"
            }
            icon="🚗"
          />

          <StatCard
            title="Total Rating"
            value={analytics ? analytics.totalRating.toFixed(1) : "5.0"}
            subtitle={
              analytics
                ? `Based on ${analytics.totalRatingCount} review${
                    analytics.totalRatingCount === 1 ? "" : "s"
                  }`
                : "New driver rating"
            }
            icon="★"
          />

          <StatCard
            title="Total Distance"
            value={analytics ? `${analytics.totalDistanceKm.toFixed(0)} km` : "0 km"}
            subtitle={
              analytics
                ? `${analytics.totalCompletedRides} total completed trips`
                : "Active platform tracking"
            }
            icon="📍"
          />
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold">Quick Actions</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              icon="➕"
              title="Offer a Ride"
              description="Publish a new commute route"
              href="/rides/create"
            />

            <QuickAction
              icon="📋"
              title="My Rides"
              description="Manage published trips"
              href="/rides"
            />

            <QuickAction
              icon="✅"
              title="Verification"
              description="Review driver credentials"
              href="/driver/verification"
            />

            <QuickAction
              icon="🛡️"
              title="Safety Center"
              description="Emergency contacts & SOS"
              href="/safety"
            />
          </div>
        </section>

        {/* Ride Requests + Upcoming */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Ride Requests */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Pending Ride Requests</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Passengers who requested seats on your published rides.
                </p>
              </div>

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {analytics?.pendingRequests ? analytics.pendingRequests.length : 0} New
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {analytics && analytics.pendingRequests && analytics.pendingRequests.length > 0 ? (
                analytics.pendingRequests.map((req) => (
                  <RequestCard
                    key={req.requestId}
                    initials={req.passengerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                    name={req.passengerName}
                    rating={req.passengerRating.toFixed(1)}
                    route={req.route}
                    time={`${req.rideDate} • ${req.departureTime}`}
                    fare={`₹${req.fare.toFixed(0)}`}
                    requestId={req.requestId}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
                  No pending ride requests at this moment.
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Ride */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold">Next Scheduled Ride</h2>

            {analytics?.nextUpcomingRide ? (
              <div className="mt-5 rounded-xl bg-indigo-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                    {analytics.nextUpcomingRide.rideDate}
                  </span>

                  <span className="text-sm font-bold text-indigo-700">
                    {analytics.nextUpcomingRide.departureTime}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-indigo-600" />
                    <div>
                      <p className="text-xs text-slate-500">Pickup</p>
                      <p className="text-sm font-semibold">
                        {analytics.nextUpcomingRide.startLocation}
                      </p>
                    </div>
                  </div>

                  <div className="ml-1.5 h-5 border-l border-dashed border-indigo-300" />

                  <div className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-xs text-slate-500">Destination</p>
                      <p className="text-sm font-semibold">
                        {analytics.nextUpcomingRide.destination}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-indigo-100 pt-4">
                  <div>
                    <p className="text-xs text-slate-500">Seats Available</p>
                    <p className="text-sm font-semibold">
                      {analytics.nextUpcomingRide.availableSeats}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500">Expected Fare</p>
                    <p className="text-sm font-bold text-indigo-700">
                      ₹{analytics.nextUpcomingRide.expectedFare.toFixed(0)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/driver/tracking/${analytics.nextUpcomingRide.id}`}
                  className="mt-4 block w-full rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700 transition"
                >
                  Start / Track Ride
                </Link>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-8 text-center">
                <p className="text-sm text-slate-500">No active or upcoming rides scheduled.</p>
                <Link
                  href="/rides/create"
                  className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Publish a Ride
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Earnings */}
        <section
          id="earnings"
          className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold">Earnings Overview</h2>
              <p className="mt-1 text-sm text-slate-500">
                Your performance and platform payout metrics.
              </p>
            </div>

            <Link
              href="/rides"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              View Full Ride History
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">This Week</p>
              <p className="mt-2 text-2xl font-bold">
                ₹{analytics ? analytics.weekEarnings.toFixed(0) : "0"}
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                {analytics && analytics.weekEarnings > 0 ? "Active weekly earnings" : "No earnings this week"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">This Month</p>
              <p className="mt-2 text-2xl font-bold">
                ₹{analytics ? analytics.monthEarnings.toFixed(0) : "0"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {analytics ? `${analytics.totalCompletedRides} completed rides total` : "0 completed rides"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Average / Ride</p>
              <p className="mt-2 text-2xl font-bold">
                ₹{analytics ? analytics.averagePerRide.toFixed(0) : "0"}
              </p>
              <p className="mt-1 text-xs text-slate-500">After seat-share calculations</p>
            </div>
          </div>
        </section>

        {/* Driver Verification Status Banner */}
        <section
          className={`mt-8 rounded-2xl border p-6 ${
            analytics?.isVerified
              ? "border-emerald-100 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
          }`}
        >
          <div className="flex gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${
                analytics?.isVerified
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {analytics?.isVerified ? "✓" : "!"}
            </div>

            <div className="flex-1">
              <h2
                className={`font-semibold ${
                  analytics?.isVerified ? "text-emerald-900" : "text-amber-900"
                }`}
              >
                {analytics?.isVerified
                  ? "Driver Verification Complete"
                  : "Driver Verification Required"}
              </h2>

              <p
                className={`mt-1 text-sm leading-6 ${
                  analytics?.isVerified ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {analytics?.isVerified
                  ? "Your identity and vehicle documents have been verified. You can publish rides and accept passengers."
                  : "Submit your Driving Licence, Vehicle RC, and Insurance to receive the verified driver badge and publish trips."}
              </p>

              <Link
                href="/driver/verification"
                className={`mt-4 inline-block text-sm font-semibold underline ${
                  analytics?.isVerified ? "text-emerald-800" : "text-amber-800"
                }`}
              >
                {analytics?.isVerified ? "View Verification Details" : "Complete Verification Now →"}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm text-indigo-700">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold">{title}</h3>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </Link>
  );
}

function RequestCard({
  initials,
  name,
  rating,
  route,
  time,
  fare,
  requestId,
}: {
  initials: string;
  name: string;
  rating: string;
  route: string;
  time: string;
  fare: string;
  requestId: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            {initials}
          </div>

          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-xs text-slate-500">
              ★ {rating} • Commuto Passenger
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-sm font-semibold">{route}</p>
          <p className="mt-1 text-xs text-slate-500">{time}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-indigo-700">{fare}</span>

          <Link
            href="/driver/requests"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Review Request
          </Link>
        </div>
      </div>
    </div>
  );
}