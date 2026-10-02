"use client";

import { Client } from "@stomp/stompjs";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

const RideMap = dynamic(() => import("../RideMap"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading map...</div>,
});

type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
type RideStatus = "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
type Point = [number, number];

interface Ride {
  id: number;
  driverId?: number;
  driver?: { id: number };
  driverName: string;
  startLocation: string;
  destination: string;
  rideDate: string;
  departureTime: string;
  vehicleModel: string;
  vehicleNumber: string;
  status: RideStatus;
}

interface RideRequest {
  id: number;
  status: RequestStatus;
  ride: Ride;
}

interface RideLocation {
  rideId: number;
  driverId: number;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  timestamp: string;
}

export default function PassengerTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState("");
  const [ride, setRide] = useState<Ride | null>(null);
  const [location, setLocation] = useState<RideLocation | null>(null);
  const [pickup, setPickup] = useState<Point | null>(null);
  const [destination, setDestination] = useState<Point | null>(null);
  const [route, setRoute] = useState<Point[]>([]);
  const [connection, setConnection] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [sosLoading, setSosLoading] = useState(false);
  const [sosStatusMessage, setSosStatusMessage] = useState("");
  const [sosContacts, setSosContacts] = useState<string[]>([]);
  const [showSosModal, setShowSosModal] = useState(false);

  const handleTriggerSos = async () => {
    if (!ride) return;
    setSosLoading(true);
    setSosStatusMessage("");
    setSosContacts([]);
    try {
      const lat = location ? location.latitude : null;
      const lon = location ? location.longitude : null;

      const response = await fetch(apiUrl(`/api/rides/${ride.id}/sos`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rideId: ride.id,
          latitude: lat,
          longitude: lon,
          message: "Passenger triggered emergency SOS during live trip tracking",
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
          "🚨 Emergency SOS broadcasted! Commuto Safety team and national emergency helplines alerted."
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
    const loadAcceptedRide = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        await Promise.resolve();
        if (isCurrent) {
          setErrorMessage("Please login to track your ride.");
          setConnection("offline");
        }
        return;
      }

      try {
        const response = await fetch(apiUrl("/api/ride-requests/my-requests"), {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!response.ok) {
          throw new Error("Unable to load your ride requests.");
        }
        const requests: RideRequest[] = await response.json();
        const acceptedRequest = requests.find(
          (request) => request.ride.id === Number(id) && request.status === "ACCEPTED"
        );
        if (!acceptedRequest) {
          throw new Error("Live tracking is available only for accepted rides.");
        }
        if (isCurrent) {
          setToken(storedToken);
          setRide(acceptedRequest.ride);
          setConnection(
            acceptedRequest.ride.status === "ACTIVE"
              ? "connecting"
              : acceptedRequest.ride.status === "COMPLETED"
                ? "completed"
                : acceptedRequest.ride.status === "CANCELLED"
                  ? "cancelled"
                : "waiting"
          );
        }
      } catch (err) {
        if (isCurrent) {
          setErrorMessage(err instanceof Error ? err.message : "Unable to load your ride.");
          setConnection("offline");
        }
      }
    };

    void loadAcceptedRide();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  useEffect(() => {
    if (!token || !ride || (ride.status !== "UPCOMING" && ride.status !== "ACTIVE")) {
      return;
    }

    let isCurrent = true;
    const refreshRideStatus = async () => {
      try {
        const response = await fetch(apiUrl("/api/ride-requests/my-requests"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          return;
        }

        const requests: RideRequest[] = await response.json();
        const acceptedRequest = requests.find(
          (request) => request.ride.id === Number(id) && request.status === "ACCEPTED"
        );
        if (isCurrent && acceptedRequest && acceptedRequest.ride.status !== ride.status) {
          setRide(acceptedRequest.ride);
          setConnection(
            acceptedRequest.ride.status === "ACTIVE"
              ? "connecting"
              : acceptedRequest.ride.status === "COMPLETED"
                ? "completed"
                : "cancelled"
          );
        }
      } catch {
        // Keep the current ride state; the next refresh can recover from transient network errors.
      }
    };

    const intervalId = window.setInterval(() => void refreshRideStatus(), 5000);
    return () => {
      isCurrent = false;
      window.clearInterval(intervalId);
    };
  }, [id, ride, token]);

  useEffect(() => {
    if (!ride || ride.status !== "ACTIVE" || !token) {
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(apiUrl("/ws")) as unknown as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 3000,
      onConnect: () => {
        setConnection("live");
        client.subscribe(`/topic/ride/${ride.id}/location`, (message) => {
          try {
            const update = JSON.parse(message.body) as RideLocation;
            const driverId = ride.driverId ?? ride.driver?.id;
            if (update.rideId === ride.id && update.driverId === driverId) {
              setLocation(update);
            }
          } catch {
            setErrorMessage("Received an invalid location update.");
          }
        });
      },
      onWebSocketClose: () => setConnection("reconnecting"),
      onStompError: () => {
        setConnection("offline");
        setErrorMessage("Live tracking could not be authorized. Sign in with the passenger account for this ride.");
      },
    });
    client.activate();
    return () => {
      void client.deactivate();
    };
  }, [ride, token]);

  useEffect(() => {
    if (!ride) {
      return;
    }

    let isCurrent = true;
    const geocode = async (place: string): Promise<Point | null> => {
      const query = new URLSearchParams({ format: "jsonv2", limit: "1", q: place });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`);
      if (!response.ok) {
        return null;
      }
      const results = await response.json() as Array<{ lat: string; lon: string }>;
      return results[0] ? [Number(results[0].lat), Number(results[0].lon)] : null;
    };

    const loadRoute = async () => {
      let pickupPoint: Point | null = null;
      let destinationPoint: Point | null = null;
      try {
        pickupPoint = await geocode(ride.startLocation);
        destinationPoint = await geocode(ride.destination);
        if (!isCurrent) {
          return;
        }
        setPickup(pickupPoint);
        setDestination(destinationPoint);

        if (pickupPoint && destinationPoint) {
          const coordinates = `${pickupPoint[1]},${pickupPoint[0]};${destinationPoint[1]},${destinationPoint[0]}`;
          const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`);
          const data = await response.json() as { routes?: Array<{ geometry: { coordinates: [number, number][] } }> };
          const routeCoordinates = data.routes?.[0]?.geometry.coordinates;
          if (isCurrent) {
            setRoute(routeCoordinates
              ? routeCoordinates.map(([longitude, latitude]) => [latitude, longitude])
              : [pickupPoint, destinationPoint]);
          }
        }
      } catch {
        if (isCurrent && pickupPoint && destinationPoint) {
          setRoute([pickupPoint, destinationPoint]);
        }
      }
    };

    void loadRoute();
    return () => {
      isCurrent = false;
    };
  }, [ride]);

  const driverPoint: Point | null = location ? [location.latitude, location.longitude] : null;
  const isLive = ride?.status === "ACTIVE" && connection === "live";
  const connectionLabel = ride?.status === "COMPLETED"
    ? "COMPLETED"
    : ride?.status === "CANCELLED"
      ? "CANCELLED"
      : connection.toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Live Ride Tracking</h1>
            <p className="mt-1 text-sm text-slate-500">{ride ? `${ride.startLocation} → ${ride.destination}` : "Ride location"}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSosModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-red-200 transition hover:bg-red-700 active:scale-95 animate-pulse"
            >
              <span>🚨</span> Emergency SOS
            </button>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isLive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
              {isLive ? "LIVE" : connectionLabel}
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl space-y-5 px-6 py-8">
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

        {ride && ride.status === "COMPLETED" && (
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-indigo-50 p-5 border border-indigo-200 sm:flex-row shadow-sm">
            <div>
              <h2 className="text-base font-bold text-indigo-900">Trip Completed! How was your ride with {ride.driverName}?</h2>
              <p className="mt-0.5 text-xs text-indigo-700">Submit your rating and feedback to help keep the Commuto community reliable and safe.</p>
            </div>
            <Link
              href="/ratings"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              ★ Rate Driver Now
            </Link>
          </div>
        )}

        {ride && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-semibold">{ride.driverName} · {ride.vehicleModel} · {ride.vehicleNumber}</p>
            <p className="text-sm text-slate-500">{ride.status === "COMPLETED" ? "This ride has been completed" : ride.status === "CANCELLED" ? "This ride has been cancelled" : location ? `Updated ${new Date(location.timestamp).toLocaleTimeString()}` : ride.status === "ACTIVE" ? "Waiting for the driver's first location update" : "Tracking starts when the driver starts the ride"}</p>
          </div>
        )}

        {errorMessage && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{errorMessage}</p>}

        <div className="h-[min(68vh,640px)] min-h-[400px] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
          <RideMap pickup={pickup} destination={destination} driver={driverPoint} route={route} />
        </div>
      </section>

      {/* SOS Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl font-bold">🚨</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Trigger Emergency SOS</h3>
                <p className="text-xs text-slate-500">Immediate response and emergency broadcast</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              This will immediately broadcast an urgent emergency alert to the <strong>Commuto Safety Response Team</strong> and your registered <strong>Emergency Contacts</strong> with your live GPS location and trip details.
            </p>

            <div className="mt-5 space-y-2 rounded-2xl bg-slate-50 p-4 text-xs font-semibold text-slate-700">
              <p className="text-slate-400 uppercase tracking-wider text-[10px]">National Helplines (Toll-Free)</p>
              <div className="flex justify-between items-center py-1">
                <span>🚓 Police Control Room:</span>
                <a href="tel:112" className="text-indigo-600 font-bold hover:underline">Dial 112</a>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>👩 Women Safety Helpline:</span>
                <a href="tel:1091" className="text-indigo-600 font-bold hover:underline">Dial 1091</a>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>🚑 Ambulance / Medical:</span>
                <a href="tel:108" className="text-indigo-600 font-bold hover:underline">Dial 108</a>
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