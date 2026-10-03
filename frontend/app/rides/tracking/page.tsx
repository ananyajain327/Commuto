"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function RideTrackingPage() {
  const [sosOpen, setSosOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const getShareDetails = () => {
    const trackingUrl = typeof window !== "undefined"
      ? `${window.location.origin}/rides/tracking/1`
      : "http://localhost:3000/rides/tracking/1";
    const text = `🚗 Track my live Commuto journey!\n• Route: Vaishali Nagar → Malviya Nagar\n• Driver: Rajesh Kumar (Honda City - RJ 14 AB 1234)\n• Live Tracking Link: ${trackingUrl}`;
    return { trackingUrl, text };
  };

  const handleCopyLink = () => {
    const { trackingUrl } = getShareDetails();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(trackingUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    const { trackingUrl, text } = getShareDetails();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Commuto Live Ride Tracking",
          text: text,
          url: trackingUrl,
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    handleCopyLink();
  };

  const handleWhatsAppShare = () => {
    const { text } = getShareDetails();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleSmsShare = () => {
    const { text } = getShareDetails();
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 sticky top-0 z-20 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Live Ride Tracking</h1>

              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>

            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Your driver is on the way to the pickup point.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/rides"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              ← My Rides
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Trip Status */}
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Current Trip
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Jaipur → Ajmer
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <StatusBadge text="Driver Verified" />
              <StatusBadge text="Trip Protected" />
            </div>
          </div>

          {/* Progress */}
          <div className="mt-7">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Jaipur Railway Station</span>
              <span>Ajmer Bus Stand</span>
            </div>

            <div className="relative mt-3 h-2 rounded-full bg-slate-100">
              <div className="h-full w-[42%] rounded-full bg-indigo-600" />

              <div className="absolute left-[42%] top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-indigo-600 shadow">
                🚗
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <div>
                <p className="text-sm font-semibold">Pickup completed</p>
                <p className="text-xs text-slate-400">6:28 PM</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold">Destination</p>
                <p className="text-xs text-slate-400">8:40 PM</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Map */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="font-semibold">Live Map</h2>
                <p className="text-xs text-slate-400">
                  Driver location updates in real time
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                ● Location Active
              </span>
            </div>

            {/* Demo Map */}
            <div className="relative h-125 overflow-hidden bg-slate-100">
              {/* Map Grid */}
              <div className="absolute inset-0 opacity-40">
                <div className="absolute left-[15%] top-0 h-full w-px bg-slate-300" />
                <div className="absolute left-[35%] top-0 h-full w-px rotate-12 bg-slate-300" />
                <div className="absolute left-[60%] top-0 h-full w-px rotate-[-8deg] bg-slate-300" />
                <div className="absolute left-[82%] top-0 h-full w-px bg-slate-300" />

                <div className="absolute left-0 top-[20%] h-px w-full bg-slate-300" />
                <div className="absolute left-0 top-[42%] h-px w-full rotate-[-5deg] bg-slate-300" />
                <div className="absolute left-0 top-[68%] h-px w-full rotate-[7deg] bg-slate-300" />
                <div className="absolute left-0 top-[86%] h-px w-full bg-slate-300" />
              </div>

              {/* Roads */}
              <div className="absolute left-[-10%] top-[50%] h-10 w-[120%] rotate-[-8deg] bg-white shadow-sm" />

              <div className="absolute left-[45%] top-[-10%] h-[120%] w-10 rotate-18 bg-white shadow-sm" />

              <div className="absolute left-[10%] top-[25%] h-6 w-[80%] rotate-18 bg-white shadow-sm" />

              {/* Route */}
              <div className="absolute left-[20%] top-[65%] h-1 w-[60%] rotate-[-18deg] rounded-full bg-indigo-500" />

              {/* Pickup */}
              <div className="absolute bottom-[22%] left-[18%]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-white shadow-lg">
                  ●
                </div>

                <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold shadow-md">
                  Pickup
                </div>
              </div>

              {/* Driver */}
              <div className="absolute left-[48%] top-[46%]">
                <div className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-xl shadow-xl">
                  🚗
                </div>

                <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold shadow-md">
                  Rahul • Driver
                </div>
              </div>

              {/* Destination */}
              <div className="absolute right-[14%] top-[18%]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white shadow-lg">
                  ●
                </div>

                <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold shadow-md">
                  Destination
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute right-5 top-5 flex flex-col overflow-hidden rounded-xl bg-white shadow-md">
                <button className="px-4 py-3 text-lg hover:bg-slate-50">
                  +
                </button>

                <div className="border-t border-slate-100" />

                <button className="px-4 py-3 text-lg hover:bg-slate-50">
                  −
                </button>
              </div>

              {/* Recenter */}
              <button className="absolute bottom-5 right-5 rounded-xl bg-white px-4 py-3 text-sm font-semibold shadow-md hover:bg-slate-50">
                ◎ Recenter
              </button>
            </div>
          </section>

          {/* Trip Info */}
          <aside className="space-y-6">
            {/* ETA */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">
                Estimated Arrival
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-bold">12</span>
                <span className="mb-1 text-sm text-slate-500">
                  min
                </span>
              </div>

              <p className="mt-1 text-sm text-emerald-600">
                Driver is approaching
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Metric label="Distance" value="8.4 km" />
                <Metric label="Speed" value="42 km/h" />
              </div>
            </section>

            {/* Driver */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="font-semibold">Your Driver</h2>

              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                  RS
                </div>

                <div className="flex-1">
                  <p className="font-semibold">Rahul Sharma</p>

                  <p className="mt-1 text-xs text-slate-500">
                    ★ 4.9 • 186 rides
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">Vehicle</p>

                <p className="mt-1 text-sm font-semibold">
                  Hyundai Creta
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  RJ14 AB 1234
                </p>
              </div>

              <button className="mt-4 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold hover:bg-slate-50">
                📞 Contact Driver
              </button>
            </section>

            {/* Safety Actions */}
            <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="font-semibold">Safety Actions</h2>

              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                📤 Share Live Trip
              </button>

              <button
                onClick={() => setSosOpen(true)}
                className="mt-3 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
              >
                🚨 SOS Emergency
              </button>

              <a
                href="/safety"
                className="mt-3 block text-center text-xs font-semibold text-indigo-600 hover:underline"
              >
                Open Safety Center →
              </a>
            </section>
          </aside>
        </div>

        {/* Trip Timeline */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Trip Timeline</h2>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Timeline
              icon="✓"
              title="Ride Started"
              description="Driver started the trip."
              time="6:28 PM"
              completed
            />

            <Timeline
              icon="🚗"
              title="On the Way"
              description="Heading towards destination."
              time="6:42 PM"
              completed
            />

            <Timeline
              icon="🏁"
              title="Arriving Soon"
              description="Estimated arrival at 8:40 PM."
              time="ETA 8:40 PM"
              active
            />
          </div>
        </section>

        {/* Safety Banner */}
        <section className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <div className="flex gap-4">
            <span className="text-2xl">🛡️</span>

            <div>
              <h2 className="font-semibold text-emerald-900">
                Commuto Safety Protection is Active
              </h2>

              <p className="mt-1 text-sm leading-6 text-emerald-700">
                Your trip is being monitored for safety. You can share your
                live location or use SOS at any time.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* SOS Modal */}
      {sosOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
              🚨
            </div>

            <h2 className="mt-5 text-center text-xl font-bold">
              Emergency Assistance
            </h2>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              This is a demo SOS interface. In the production version,
              emergency services and saved emergency contacts will be
              contacted.
            </p>

            <div className="mt-6 space-y-3">
              <button className="w-full rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700">
                🚨 Confirm Emergency
              </button>

              <button
                onClick={() => setSosOpen(false)}
                className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl font-bold">
                  📤
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Share Live Trip</h3>
                  <p className="text-xs text-slate-500">Keep family and friends informed in real time</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Live Trip Details</p>
              <p className="text-sm font-bold text-slate-900">
                Vaishali Nagar → Malviya Nagar
              </p>
              <p className="text-xs text-slate-600">
                🚗 Driver: Rajesh Kumar · Honda City (RJ 14 AB 1234)
              </p>
            </div>

            <div className="mt-5 space-y-2.5">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 transition"
              >
                <span>💬</span> Share via WhatsApp
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5b5ce2] py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-[#4a4bcf] transition"
              >
                <span>📱</span> Device Share Options
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSmsShare}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  📨 SMS / Text
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  {shareCopied ? "✓ Link Copied!" : "📋 Copy Link"}
                </button>
              </div>
            </div>

            {shareCopied && (
              <p className="mt-3 text-center text-xs font-bold text-emerald-600">
                ✓ Live tracking URL copied to clipboard!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


/* ---------- Components ---------- */

function StatusBadge({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
      ✓ {text}
    </span>
  );
}


function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}


function Timeline({
  icon,
  title,
  description,
  time,
  completed,
  active,
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
  completed?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm ${
          completed
            ? "bg-emerald-100 text-emerald-700"
            : active
              ? "bg-indigo-100 text-indigo-700"
              : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </div>

      <div>
        <p className="font-semibold">{title}</p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

        <p className="mt-2 text-xs font-medium text-slate-400">
          {time}
        </p>
      </div>
    </div>
  );
}