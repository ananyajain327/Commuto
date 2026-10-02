"use client";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

interface Ride {
  id: number;
  driverId: number;
  driverName: string;
  startLocation: string;
  destination: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
}

type ConnectionState = "loading" | "connecting" | "connected" | "offline";

export default function DriverTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const [ride, setRide] = useState<Ride | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [connection, setConnection] = useState<ConnectionState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [sosStatusMessage, setSosStatusMessage] = useState("");
  const [sosContacts, setSosContacts] = useState<string[]>([]);
  const [showSosModal, setShowSosModal] = useState(false);

  const handleTriggerSos = async () => {
    if (!ride) return;
    setSosLoading(true);
    setSosStatusMessage("");
    setSosContacts([]);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(apiUrl(`/api/rides/${ride.id}/sos`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rideId: ride.id,
          latitude: coordinates?.latitude || null,
          longitude: coordinates?.longitude || null,
          message: "Driver triggered emergency SOS during live ride tracking",
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || "Failed to trigger Emergency SOS");
      }

      const data = (await response.json().catch(() => null)) as {
        message?: string;
        notifiedContacts?: string[];
      } | null;

      const contacts = data?.notifiedContacts || [];
      setSosContacts(contacts);

      if (contacts.length > 0) {
        setSosStatusMessage(
          "🚨 Emergency SOS broadcasted! SMS alert & live GPS coordinates dispatched to your emergency contacts."
        );
      } else {
        setSosStatusMessage(
          "🚨 Emergency SOS broadcasted! Emergency services and Commuto Safety team have been alerted."
        );
      }
      setShowSosModal(false);
    } catch (err) {
      setSosStatusMessage(err instanceof Error ? err.message : "Error triggering SOS.");
    } finally {
      setSosLoading(false);
    }
  };

  useEffect(() => {
    let isCurrent = true;
    const token = localStorage.getItem("token");
    if (!token) {
      queueMicrotask(() => {
        setErrorMessage("Please login as the ride driver to share your location.");
        setConnection("offline");
      });
      return () => {
        isCurrent = false;
      };
    }

    const loadRide = async () => {
      try {
        const response = await fetch(apiUrl(`/api/rides/${id}`), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Unable to load this ride.");
        }
        const result: Ride = await response.json();
        if (isCurrent) {
          setRide(result);
          setConnection(result.status === "ACTIVE" ? "connecting" : "offline");
        }
      } catch (err) {
        if (isCurrent) {
          setErrorMessage(err instanceof Error ? err.message : "Unable to load this ride.");
          setConnection("offline");
        }
      }
    };

    void loadRide();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  useEffect(() => {
    if (!ride || ride.status !== "ACTIVE") {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      queueMicrotask(() => {
        setErrorMessage("Please login again to share your location.");
        setConnection("offline");
      });
      return;
    }
    if (!navigator.geolocation) {
      queueMicrotask(() => {
        setErrorMessage("Location sharing is not supported by this browser.");
        setConnection("offline");
      });
      return;
    }

    let lastPublishedAt = 0;
    const client = new Client({
      webSocketFactory: () => new SockJS(apiUrl("/ws")) as unknown as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 3000,
      onConnect: () => setConnection("connected"),
      onWebSocketClose: () => setConnection("connecting"),
      onStompError: () => {
        setErrorMessage("The live location connection was rejected. Please sign in again.");
        setConnection("offline");
      },
    });
    client.activate();

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, heading, speed } = position.coords;
        setCoordinates({ latitude, longitude });
        setErrorMessage("");
        if (client.connected) {
          setConnection("connected");
        }
        if (!client.connected || Date.now() - lastPublishedAt < 5000) {
          return;
        }

        client.publish({
          destination: `/app/ride/${ride.id}/location`,
          body: JSON.stringify({
            rideId: ride.id,
            driverId: ride.driverId,
            latitude,
            longitude,
            heading: heading ?? 0,
            speed: speed ?? 0,
            timestamp: position.timestamp,
          }),
        });
        lastPublishedAt = Date.now();
        setLastUpdate(new Date().toLocaleTimeString());
      },
      (error) => {
        setErrorMessage(error.message || "Location permission is required to share your trip.");
        setConnection("offline");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      void client.deactivate();
    };
  }, [ride]);

  const handleRideLifecycle = async (action: "start" | "complete") => {
    const token = localStorage.getItem("token");
    if (!token || !ride) {
      setErrorMessage("Please login as the ride driver to update ride status.");
      return;
    }

    try {
      if (action === "start") {
        setIsStarting(true);
      } else {
        setIsCompleting(true);
      }
      setErrorMessage("");

      const response = await fetch(apiUrl(`/api/rides/${ride.id}/${action}`), {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(action === "start" ? "Unable to start this ride." : "Unable to complete this ride.");
      }

      const nextRide: Ride = await response.json();
      setRide(nextRide);
      setConnection(nextRide.status === "ACTIVE" ? "connecting" : "offline");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unable to update ride status.");
    } finally {
      setIsStarting(false);
      setIsCompleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Share Live Location</h1>
            <p className="mt-1 text-sm text-slate-500">Location sharing is available only while your ride is active.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSosModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700 active:scale-95 animate-pulse"
            >
              <span>🚨</span> Emergency SOS
            </button>
            <a href="/rides" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">My Rides</a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl space-y-5 px-6 py-8">
        {sosStatusMessage && (
          <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-900 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-pulse">🚨</span>
                <div>
                  <p className="font-bold text-red-900">{sosStatusMessage}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSosStatusMessage("");
                  setSosContacts([]);
                }}
                className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 shrink-0"
              >
                Dismiss
              </button>
            </div>
            {sosContacts.length > 0 && (
              <div className="pt-2 border-t border-red-200 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider">SMS & GPS Sent To:</span>
                {sosContacts.map((contact, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-red-700 shadow-xs border border-red-200"
                  >
                    <span>📱</span>
                    <span>{contact}</span>
                    <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">DISPATCHED</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {ride && (
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Ride CM-{String(ride.id).padStart(4, "0")}</p>
            <h2 className="mt-2 text-xl font-bold">{ride.startLocation} <span className="text-slate-400">→</span> {ride.destination}</h2>
            <p className="mt-2 text-sm text-slate-500">Status: {ride.status}</p>
          </article>
        )}

        {ride && ride.status === "UPCOMING" && (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-600">The ride is ready to begin. Start it when you are at the pickup point.</p>
            <button
              type="button"
              onClick={() => void handleRideLifecycle("start")}
              disabled={isStarting || isCompleting}
              className="mt-4 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isStarting ? "Starting ride..." : "Start ride"}
            </button>
          </div>
        )}

        {ride?.status === "ACTIVE" ? (
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${connection === "connected" ? "bg-emerald-500" : "bg-amber-500"}`} />
              <p className="font-semibold">{connection === "connected" ? "Sharing location" : "Connecting to live tracking"}</p>
            </div>
            {coordinates && <p className="mt-4 text-sm text-slate-600">{coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}</p>}
            {lastUpdate && <p className="mt-2 text-xs text-slate-400">Last update: {lastUpdate}</p>}
            <button
              type="button"
              onClick={() => void handleRideLifecycle("complete")}
              disabled={isStarting || isCompleting}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCompleting ? "Completing ride..." : "Complete ride"}
            </button>
          </article>
        ) : ride && ride.status === "COMPLETED" ? (
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-indigo-50 p-6 border border-indigo-200 sm:flex-row shadow-sm">
            <div>
              <h2 className="text-base font-bold text-indigo-900">Trip Completed Successfully!</h2>
              <p className="mt-0.5 text-xs text-indigo-700">Check passenger feedback, rate passengers, and track your overall rating score.</p>
            </div>
            <Link
              href="/ratings"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              ★ View Ratings Center
            </Link>
          </div>
        ) : ride && ride.status !== "UPCOMING" ? (
          <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-700">This ride is no longer active for live tracking.</p>
        ) : null}

        {errorMessage && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{errorMessage}</p>}
      </section>

      {/* SOS Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl font-bold">🚨</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Trigger Emergency SOS</h3>
                <p className="text-xs text-slate-500">Driver emergency broadcast & safety dispatch</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              This will immediately broadcast an urgent emergency alert to the <strong>Commuto Safety Response Team</strong> and your registered <strong>Emergency Contacts</strong> with your vehicle and location details.
            </p>

            <div className="mt-5 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs font-semibold text-slate-700">
              <p className="text-slate-400 uppercase tracking-wider text-[10px]">National Emergency Contacts</p>
              <div className="flex justify-between items-center py-1">
                <span>🚓 Police Control Room:</span>
                <a href="tel:112" className="text-indigo-600 font-bold hover:underline">Dial 112</a>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>🚑 Medical Emergency:</span>
                <a href="tel:108" className="text-indigo-600 font-bold hover:underline">Dial 108</a>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>🛣️ National Highway Helpline:</span>
                <a href="tel:1033" className="text-indigo-600 font-bold hover:underline">Dial 1033</a>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowSosModal(false)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sosLoading}
                onClick={() => void handleTriggerSos()}
                className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 hover:bg-red-700 disabled:opacity-60"
              >
                {sosLoading ? "Sending SOS..." : "Confirm SOS Alert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}