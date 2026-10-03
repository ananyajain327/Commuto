"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { apiUrl } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

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
  const router = useRouter();
  const [online, setOnline] = useState(false);
  const [analytics, setAnalytics] = useState<DriverAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [newRequestNotification, setNewRequestNotification] = useState<string | null>(null);

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

  // Real-time WebSocket connection for instant passenger requests
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(apiUrl("/ws")) as unknown as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/topic/driver/requests", (message) => {
          try {
            const req = JSON.parse(message.body) as DriverRequestSummary;
            if (req && req.requestId) {
              setAnalytics((prev) => {
                if (!prev) return prev;
                const existing = prev.pendingRequests.some((r) => r.requestId === req.requestId);
                if (existing) return prev;
                return {
                  ...prev,
                  pendingRequests: [req, ...prev.pendingRequests],
                };
              });
              setNewRequestNotification(`🔔 New ride request received from ${req.passengerName || "a passenger"} for ${req.route || "your ride"}!`);
            }
          } catch {
            // ignore malformed payloads
          }
        });
      },
    });

    client.activate();
    return () => {
      void client.deactivate();
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
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Driver Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your rides, earnings and driver activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{loading ? "Loading..." : driverName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {analytics?.isVerified ? "✓ Verified Driver" : "Verification Pending"}
              </p>
            </div>

            <Link
              href="/profile"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 transition hover:ring-2 hover:ring-indigo-300 dark:bg-emerald-950/60 dark:text-emerald-400"
              title="My Profile"
            >
              {initials}
            </Link>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Real-time Notification Banner */}
        {newRequestNotification && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-indigo-600 px-6 py-4 text-white shadow-xl animate-bounce"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-xl backdrop-blur-sm">
                🚗
              </span>
              <div>
                <p className="text-sm font-bold">{newRequestNotification}</p>
                <p className="text-xs text-indigo-100">Review and accept the request below to confirm the seat.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNewRequestNotification(null)}
              className="rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold hover:bg-white/20"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Online Status */}
        <section className="rounded-2xl bg-white p-6 shadow-xs ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  online ? "bg-emerald-100 dark:bg-emerald-950/60" : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full ${
                    online ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                  }`}
                />
              </div>

              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {online ? "You are Online" : "You are Offline"}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {online
                    ? "You can now receive ride requests in real time."
                    : "Go online when you're ready to accept rides."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setOnline(!online)}
              className={`rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition ${
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>

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
          <div className="rounded-2xl bg-white p-6 shadow-xs ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pending Ride Requests</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Passengers who requested seats on your published rides.
                </p>
              </div>

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
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
                <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  No pending ride requests at this moment.
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Ride */}
          <div className="rounded-2xl bg-white p-6 shadow-xs ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Next Scheduled Ride</h2>

            {analytics?.nextUpcomingRide ? (
              <div className="mt-5 rounded-xl bg-indigo-50 p-5 dark:bg-indigo-950/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                    {analytics.nextUpcomingRide.rideDate}
                  </span>

                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                    {analytics.nextUpcomingRide.departureTime}
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-indigo-600" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Pickup</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {analytics.nextUpcomingRide.startLocation}
                      </p>
                    </div>
                  </div>

                  <div className="ml-1.5 h-5 border-l border-dashed border-indigo-300 dark:border-indigo-700" />

                  <div className="flex gap-3">
                    <div className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Destination</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {analytics.nextUpcomingRide.destination}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-indigo-100 pt-4 dark:border-indigo-900/60">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Seats Available</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {analytics.nextUpcomingRide.availableSeats}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Expected Fare</p>
                    <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      ₹{analytics.nextUpcomingRide.expectedFare.toFixed(0)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/driver/tracking/${analytics.nextUpcomingRide.id}`}
                  className="mt-4 block w-full rounded-xl bg-indigo-600 py-3 text-center text-sm font-bold text-white hover:bg-indigo-700 transition"
                >
                  Start / Track Ride
                </Link>
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">No active or upcoming rides scheduled.</p>
                <Link
                  href="/rides/create"
                  className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
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
          className="mt-8 rounded-2xl bg-white p-6 shadow-xs ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Earnings Overview</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your performance and platform payout metrics.
              </p>
            </div>

            <Link
              href="/rides"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              View Full Ride History
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/60">
              <p className="text-sm text-slate-500 dark:text-slate-400">This Week</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                ₹{analytics ? analytics.weekEarnings.toFixed(0) : "0"}
              </p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                {analytics && analytics.weekEarnings > 0 ? "Active weekly earnings" : "No earnings this week"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/60">
              <p className="text-sm text-slate-500 dark:text-slate-400">This Month</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                ₹{analytics ? analytics.monthEarnings.toFixed(0) : "0"}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {analytics ? `${analytics.totalCompletedRides} completed rides total` : "0 completed rides"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/60">
              <p className="text-sm text-slate-500 dark:text-slate-400">Average / Ride</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                ₹{analytics ? analytics.averagePerRide.toFixed(0) : "0"}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">After seat-share calculations</p>
            </div>
          </div>
        </section>

        {/* Driver Verification Status Banner */}
        <section
          className={`mt-8 rounded-2xl border p-6 ${
            analytics?.isVerified
              ? "border-emerald-100 bg-emerald-50 dark:border-emerald-950/60 dark:bg-emerald-950/30"
              : "border-amber-200 bg-amber-50 dark:border-amber-950/60 dark:bg-amber-950/30"
          }`}
        >
          <div className="flex gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${
                analytics?.isVerified
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
              }`}
            >
              {analytics?.isVerified ? "✓" : "!"}
            </div>

            <div className="flex-1">
              <h2
                className={`font-bold ${
                  analytics?.isVerified ? "text-emerald-900 dark:text-emerald-200" : "text-amber-900 dark:text-amber-200"
                }`}
              >
                {analytics?.isVerified
                  ? "Driver Verification Complete"
                  : "Driver Verification Required"}
              </h2>

              <p
                className={`mt-1 text-sm leading-6 ${
                  analytics?.isVerified ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"
                }`}
              >
                {analytics?.isVerified
                  ? "Your identity and vehicle documents have been verified. You can publish rides and accept passengers."
                  : "Submit your Driving Licence, Vehicle RC, and Insurance to receive the verified driver badge and publish trips."}
              </p>

              <Link
                href="/driver/verification"
                className={`mt-4 inline-block text-sm font-semibold underline ${
                  analytics?.isVerified ? "text-emerald-800 dark:text-emerald-400" : "text-amber-800 dark:text-amber-400"
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
    <div className="rounded-2xl bg-white p-5 shadow-xs ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>

        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
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
      className="rounded-2xl bg-white p-5 shadow-xs ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-slate-700"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl dark:bg-slate-800">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{title}</h3>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
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
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-800/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 dark:bg-emerald-950/60 dark:text-emerald-400">
            {initials}
          </div>

          <div>
            <p className="font-bold text-slate-900 dark:text-white">{name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ★ {rating} • Commuto Passenger
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{route}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{time}</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-indigo-700 dark:text-indigo-400">{fare}</span>

          <Link
            href={`/driver/requests?requestId=${requestId}`}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            Review Request
          </Link>
        </div>
      </div>
    </div>
  );
}