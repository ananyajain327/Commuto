"use client";

import { Client } from "@stomp/stompjs";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";

const RideMap = dynamic(() => import("../RideMap"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-slate-500">Loading map...</div>,
});

type RequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
type RideStatus = "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
type Point = [number, number];

interface Ride {
  id: number;
  driverId: number;
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
        const response = await fetch("http://localhost:8080/api/ride-requests/my-requests", {
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
        const response = await fetch("http://localhost:8080/api/ride-requests/my-requests", {
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
      webSocketFactory: () => new SockJS("http://localhost:8080/ws") as unknown as WebSocket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 3000,
      onConnect: () => {
        setConnection("live");
        client.subscribe(`/topic/ride/${ride.id}/location`, (message) => {
          try {
            const update = JSON.parse(message.body) as RideLocation;
            if (update.rideId === ride.id && update.driverId === ride.driverId) {
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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold">Live Ride Tracking</h1>
            <p className="mt-1 text-sm text-slate-500">{ride ? `${ride.startLocation} → ${ride.destination}` : "Ride location"}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${connection === "live" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
            {connection === "live" ? "LIVE" : connection.toUpperCase()}
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl space-y-5 px-6 py-8">
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
    </main>
  );
}