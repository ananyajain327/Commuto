"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { apiUrl } from "@/lib/api";

interface ActiveRideData {
  id: number;
  seatsRequested: number;
  pickupPreference?: string;
  fare: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  ride: {
    id: number;
    startLocation: string;
    destination: string;
    rideDate: string;
    departureTime: string;
    status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
    vehicleModel?: string;
    vehicleNumber?: string;
    driver?: {
      fullName: string;
      phone?: string;
    };
  };
}

export default function ActiveRideWidget() {
  const pathname = usePathname();
  const [activeBooking, setActiveBooking] = useState<ActiveRideData | null>(null);
  const [minimized, setMinimized] = useState(false);

  const checkActiveRide = useCallback(async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      setActiveBooking(null);
      return;
    }

    try {
      const res = await fetch(apiUrl("/api/ride-requests/my-requests"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: ActiveRideData[] = await res.json();
        // Find ride that is either currently active or accepted & upcoming
        const current = data.find(
          (r) =>
            r.status === "ACCEPTED" &&
            (r.ride.status === "ACTIVE" || r.ride.status === "UPCOMING")
        );
        setActiveBooking(current || null);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchRide = async () => {
      if (isMounted) {
        await checkActiveRide();
      }
    };
    void fetchRide();
    const interval = setInterval(() => {
      if (isMounted) {
        void checkActiveRide();
      }
    }, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pathname, checkActiveRide]);

  // Don't show inside active tracking page itself to avoid duplication
  if (!activeBooking || pathname.includes("/tracking/")) {
    return null;
  }

  const isLive = activeBooking.ride.status === "ACTIVE";

  if (minimized) {
    return (
      <aside aria-label="Active Ride Alert" className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="group flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-slate-950/90 px-4 py-2.5 text-xs font-bold text-white shadow-2xl backdrop-blur-md transition hover:scale-105 active:scale-95 cursor-pointer dark:border-emerald-500/50"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span>{isLive ? "🚗 Ride in Progress" : "📅 Scheduled Ride"}</span>
          <span className="rounded-full bg-emerald-600/30 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
            Open ↑
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside aria-label="Active Ride Widget" className="fixed bottom-5 right-5 z-40 w-84 max-w-[calc(100vw-2.5rem)]">
      <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-white/95 p-4.5 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-emerald-500/40 dark:bg-slate-950/95">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {isLive ? "Live Ride Active" : "Upcoming Trip"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMinimized(true)}
              className="rounded-lg p-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
              title="Minimize"
            >
              −
            </button>
          </div>
        </div>

        {/* Route info */}
        <div className="mt-3">
          <p className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
            {activeBooking.ride.startLocation} → {activeBooking.ride.destination}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            {activeBooking.ride.rideDate} · {activeBooking.ride.departureTime}
          </p>
        </div>

        {/* Driver & Car */}
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 p-2.5 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 font-bold text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              🚗
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {activeBooking.ride.driver?.fullName || "Verified Driver"}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                {activeBooking.ride.vehicleModel || "Vehicle Confirmed"}
              </p>
            </div>
          </div>
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            ₹{Math.round(activeBooking.fare)}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href={`/booking/pass?requestId=${activeBooking.id}`}
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition shadow-2xs"
          >
            🎫 View Pass
          </Link>

          <Link
            href={`/rides/tracking/${activeBooking.ride.id}`}
            className="flex items-center justify-center rounded-xl bg-emerald-600 py-2 text-center text-xs font-bold text-white shadow-md shadow-emerald-900/20 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition"
          >
            📍 Live Track
          </Link>
        </div>
      </div>
    </aside>
  );
}
