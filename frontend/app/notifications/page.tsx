"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import {
  AppNotification,
  NotifCategory,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  saveUserNotifications,
} from "@/lib/notifications";

// ── helpers ────────────────────────────────────────────────────────────────────

function categoryMeta(cat: NotifCategory) {
  switch (cat) {
    case "RIDE_REQUEST":
      return { icon: "🚗", label: "Ride Request", bg: "bg-emerald-50 dark:bg-emerald-950/50", text: "text-emerald-700 dark:text-emerald-300" };
    case "RIDE_UPDATE":
      return { icon: "📍", label: "Ride Update", bg: "bg-sky-50 dark:bg-sky-950/50", text: "text-sky-600 dark:text-sky-300" };
    case "SAFETY":
      return { icon: "🛡️", label: "Safety", bg: "bg-rose-50 dark:bg-rose-950/50", text: "text-rose-600 dark:text-rose-300" };
    case "RATING":
      return { icon: "⭐", label: "Rating", bg: "bg-amber-50 dark:bg-amber-950/50", text: "text-amber-600 dark:text-amber-300" };
    default:
      return { icon: "🔔", label: "System", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300" };
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

// ── component ──────────────────────────────────────────────────────────────────

const FILTER_TABS = ["All", "Unread", "Ride", "Safety", "System"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("All");

  // ── load real notifications ───────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;

    const load = async () => {
      const localData = getUserNotifications();
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        if (alive) {
          setNotifs(localData);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch(apiUrl("/api/notifications"), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const backendData: AppNotification[] = await res.json();
          if (alive) {
            // Combine backend & local events if both exist, avoiding duplicates
            const combined = [...backendData, ...localData.filter((l) => !backendData.some((b) => b.id === l.id))];
            setNotifs(combined);
          }
        } else {
          if (alive) setNotifs(localData);
        }
      } catch {
        if (alive) setNotifs(localData);
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

  const markAllRead = () => {
    markAllNotificationsAsRead();
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id: number) => {
    markNotificationAsRead(id);
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    saveUserNotifications([]);
    setNotifs([]);
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">

      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-6 py-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              ←
            </Link>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                Notifications
              </p>
              <h1 className="mt-0.5 text-lg font-black text-slate-900 dark:text-slate-100">Your alerts</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 cursor-pointer"
              >
                Mark all as read
              </button>
            )}
            {notifs.length > 0 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/60 cursor-pointer"
              >
                Clear all
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* SUMMARY CHIPS */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <span className={`h-2 w-2 rounded-full ${unreadCount > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{unreadCount} unread</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{notifs.length} total</span>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                filter === tab
                  ? "bg-slate-900 text-white dark:bg-violet-600 dark:text-white"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center py-20 text-slate-400 dark:text-slate-500">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-violet-500" />
            <p className="mt-4 text-sm font-semibold">Loading notifications…</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-4xl">
              🔔
            </div>
            <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-slate-100">No notifications</h2>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400 dark:text-slate-500">
              {filter === "Unread"
                ? "You're all caught up. No unread notifications."
                : "Real-time updates about your rides, bookings and safety alerts will appear here."}
            </p>
            <Link
              href="/dashboard"
              className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-violet-500 shadow-md"
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
      className={`group flex items-start gap-4 rounded-3xl border bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900 ${
        notif.read
          ? "border-slate-200 dark:border-slate-800"
          : "border-violet-300 ring-1 ring-violet-200/50 dark:border-violet-800 dark:ring-violet-900/50"
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
                <span className="h-2 w-2 shrink-0 rounded-full bg-violet-500" />
              )}
              <p className="text-sm font-extrabold leading-tight text-slate-900 dark:text-slate-100">
                {notif.title}
              </p>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400 line-clamp-2">
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
            <p className="mt-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              {relativeTime(notif.timestamp)}
            </p>
          </div>
        </div>

        {/* CTA arrow */}
        {notif.actionUrl && (
          <p className="mt-3 text-xs font-bold text-violet-600 dark:text-violet-400 transition group-hover:underline">
            View details →
          </p>
        )}
      </div>
    </Wrapper>
  );
}
