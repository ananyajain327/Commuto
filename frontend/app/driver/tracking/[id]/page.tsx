"use client";

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [connection, setConnection] = useState<ConnectionState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const refreshRide = async (token: string) => {
    const response = await fetch(`http://localhost:8080/api/rides/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Unable to load this ride.");
    }
    const result: Ride = await response.json();
    setRide(result);
    setConnection(result.status === "ACTIVE" ? "connecting" : "offline");
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
        const response = await fetch(`http://localhost:8080/api/rides/${id}`, {
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
      webSocketFactory: () => new SockJS("http://localhost:8080/ws") as unknown as WebSocket,
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

      const response = await fetch(`http://localhost:8080/api/rides/${ride.id}/${action}`, {
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
          <a href="/rides" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50">My Rides</a>
        </div>
      </header>

      <section className="mx-auto max-w-4xl space-y-5 px-6 py-8">
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
        ) : ride && ride.status !== "UPCOMING" ? (
          <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-700">This ride is no longer active for live tracking.</p>
        ) : null}

        {errorMessage && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{errorMessage}</p>}
      </section>
    </main>
  );
}