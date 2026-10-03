"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

// ── types ──────────────────────────────────────────────────────────────────────

type NotifCategory = "RIDE_REQUEST" | "RIDE_UPDATE" | "SAFETY" | "SYSTEM" | "RATING";

interface AppNotification {
  id: number;
  category: NotifCategory;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// ── helpers ────────────────────────────────────────────────────────────────────

function categoryMeta(cat: NotifCategory) {
  switch (cat) {
    case "RIDE_REQUEST":
      return { icon: "🚗", label: "Ride Request", bg: "bg-indigo-50", text: "text-[#5b5ce2]" };
    case "RIDE_UPDATE":
      return { icon: "📍", label: "Ride Update", bg: "bg-sky-50", text: "text-sky-600" };
    case "SAFETY":
      return { icon: "🛡️", label: "Safety", bg: "bg-red-50", text: "text-red-600" };
    case "RATING":
      return { icon: "⭐", label: "Rating", bg: "bg-amber-50", text: "text-amber-600" };
    default:
      return { icon: "🔔", label: "System", bg: "bg-slate-100", text: "text-slate-600" };
  }
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ── mock data (used when backend has no notifications endpoint) ───────────────

const MOCK: AppNotification[] = [
  {
    id: 1,
    category: "RIDE_REQUEST",
    title: "Ride Request Accepted",
    body: "Your request for the Jaipur → Ajmer ride on 12 Sep has been accepted by the driver.",
    timestamp: new Date(Date.now() - 5 * 60_000).toISOString(),
    read: false,
    actionUrl: "/rides/my-requests",
  },
  {
    id: 2,
    category: "RIDE_UPDATE",
    title: "Driver is on the way",
    body: "Rajesh K. is 4 minutes away from your pickup point at Vaishali Nagar.",
    timestamp: new Date(Date.now() - 18 * 60_000).toISOString(),
    read: false,
    actionUrl: "/rides/tracking",
  },
  {
    id: 3,
    category: "RATING",
    title: "New rating received",
    body: "You received a ⭐ 5-star rating from your Jaipur → Kishangarh ride. Keep it up!",
    timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
    read: false,
    actionUrl: "/ratings",
  },
  {
    id: 4,
    category: "RIDE_REQUEST",
    title: "Ride Request Rejected",
    body: "Sorry, your request for the Jaipur → Delhi ride was not accepted by the driver.",
    timestamp: new Date(Date.now() - 6 * 3600_000).toISOString(),
    read: true,
    actionUrl: "/rides/search",
  },
  {
    id: 5,
    category: "SAFETY",
    title: "SOS alert resolved",
    body: "Your SOS alert from 2 Sep has been reviewed. Our safety team thanks you for your report.",
    timestamp: new Date(Date.now() - 24 * 3600_000).toISOString(),
    read: true,
    actionUrl: "/safety",
  },
  {
    id: 6,
    category: "SYSTEM",
    title: "Welcome to Commuto!",
    body: "Your account is set up and ready. Explore rides near you and enjoy smarter commuting.",
    timestamp: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    read: true,
    actionUrl: "/dashboard",
  },
];

// ── component ──────────────────────────────────────────────────────────────────

const FILTER_TABS = ["All", "Unread", "Ride", "Safety", "System"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("All");

  // ── load ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;

    const load = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        if (alive) { setNotifs(MOCK); setLoading(false); }
        return;
      }

      try {
        // Attempt to hit a real backend notifications endpoint
        const res = await fetch(apiUrl("/api/notifications"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data: AppNotification[] = await res.json();
          if (alive) setNotifs(data.length ? data : MOCK);
        } else {
          // Fallback to mock if endpoint not yet implemented
          if (alive) setNotifs(MOCK);
        }
      } catch {
        if (alive) setNotifs(MOCK);
      } finally {
        if (alive) setLoading(false);
      }
    };

    void load();
    return () => { alive = false; };
  }, []);

  // ── helpers ────────────────────────────────────────────────────────────────
  const unreadCount = notifs.filter((n) => !n.read).length;

  const filtered = notifs.filter((n) => {
    if (filter === "Unread") return !n.read;
    if (filter === "Ride") return n.category === "RIDE_REQUEST" || n.category === "RIDE_UPDATE";
    if (filter === "Safety") return n.category === "SAFETY";
    if (filter === "System") return n.category === "SYSTEM" || n.category === "RATING";
    return true;
  });

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const markOneRead = (id: number) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#172033]">

      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            >
              ←
            </Link>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Notifications
              </p>
              <h1 className="mt-0.5 text-lg font-black">Your alerts</h1>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Mark all as read
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* SUMMARY CHIPS */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-[#5b5ce2]" />
            <span className="text-xs font-bold text-[#5b5ce2]">{unreadCount} unread</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5">
            <span className="text-xs font-bold text-slate-500">{notifs.length} total</span>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition ${
                filter === tab
                  ? "bg-[#172033] text-white"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center py-20 text-slate-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#5b5ce2]" />
            <p className="mt-4 text-sm font-semibold">Loading notifications…</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
              🔔
            </div>
            <h2 className="mt-5 text-xl font-black">No notifications</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
              {filter === "Unread"
                ? "You're all caught up. No unread notifications."
                : "Updates about your rides, requests and safety will appear here."}
            </p>
            <Link
              href="/dashboard"
              className="mt-6 rounded-2xl bg-[#172033] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800"
            >
              Go to Dashboard →
            </Link>
          </div>
        )}

        {/* LIST */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((notif) => {
              const meta = categoryMeta(notif.category);
              return (
                <NotifCard
                  key={notif.id}
                  notif={notif}
                  meta={meta}
                  onRead={() => markOneRead(notif.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

// ── sub-components ─────────────────────────────────────────────────────────────

function NotifCard({
  notif,
  meta,
  onRead,
}: {
  notif: AppNotification;
  meta: { icon: string; label: string; bg: string; text: string };
  onRead: () => void;
}) {
  const Wrapper = notif.actionUrl ? Link : "div";
  const wrapperProps = notif.actionUrl
    ? { href: notif.actionUrl, onClick: onRead }
    : {};

  return (
    // @ts-expect-error – dynamic tag props
    <Wrapper
      {...wrapperProps}
      className={`group flex items-start gap-4 rounded-3xl border bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        notif.read
          ? "border-slate-200"
          : "border-indigo-200 ring-1 ring-indigo-100"
      }`}
    >
      {/* Icon */}
      <div
        className={`mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${meta.bg}`}
      >
        {meta.icon}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              {!notif.read && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#5b5ce2]" />
              )}
              <p className="text-sm font-extrabold leading-tight">
                {notif.title}
              </p>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500 line-clamp-2">
              {notif.body}
            </p>
          </div>
          {/* Time + category */}
          <div className="shrink-0 text-right">
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${meta.bg} ${meta.text}`}
            >
              {meta.label}
            </span>
            <p className="mt-1.5 text-[10px] font-semibold text-slate-400">
              {relativeTime(notif.timestamp)}
            </p>
          </div>
        </div>

        {/* CTA arrow */}
        {notif.actionUrl && (
          <p className="mt-3 text-xs font-bold text-[#5b5ce2] transition group-hover:underline">
            View details →
          </p>
        )}
      </div>
    </Wrapper>
  );
}
