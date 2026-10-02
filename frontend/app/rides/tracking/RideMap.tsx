"use client";

import L, { type LatLngExpression } from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

type Point = [number, number];

const pickupIcon = L.divIcon({
  className: "",
  html: '<span class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-xs font-bold text-white shadow">P</span>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const destinationIcon = L.divIcon({
  className: "",
  html: '<span class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-xs font-bold text-white shadow">D</span>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const driverIcon = L.divIcon({
  className: "",
  html: '<span class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-lg shadow-lg">🚗</span>',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function FitRoute({ pickup, destination, driver }: {
  pickup: Point | null;
  destination: Point | null;
  driver: Point | null;
}) {
  const map = useMap();
  const pickupLatitude = pickup?.[0];
  const pickupLongitude = pickup?.[1];
  const destinationLatitude = destination?.[0];
  const destinationLongitude = destination?.[1];
  const driverLatitude = driver?.[0];
  const driverLongitude = driver?.[1];

  useEffect(() => {
    const points: Point[] = [];
    if (pickupLatitude !== undefined && pickupLongitude !== undefined) {
      points.push([pickupLatitude, pickupLongitude]);
    }
    if (destinationLatitude !== undefined && destinationLongitude !== undefined) {
      points.push([destinationLatitude, destinationLongitude]);
    }
    if (driverLatitude !== undefined && driverLongitude !== undefined) {
      points.push([driverLatitude, driverLongitude]);
    }
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 13 });
    } else if (points.length === 1) {
      map.setView(points[0], 14);
    }
  }, [map, pickupLatitude, pickupLongitude, destinationLatitude, destinationLongitude, driverLatitude, driverLongitude]);

  return null;
}

export default function RideMap({
  pickup,
  destination,
  driver,
  route,
}: {
  pickup: Point | null;
  destination: Point | null;
  driver: Point | null;
  route: Point[];
}) {
  const center: LatLngExpression = driver || pickup || destination || [20.5937, 78.9629];

  return (
    <MapContainer center={center} zoom={5} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pickup && <Marker position={pickup} icon={pickupIcon} />}
      {destination && <Marker position={destination} icon={destinationIcon} />}
      {driver && <Marker position={driver} icon={driverIcon} />}
      {route.length > 1 && <Polyline positions={route as LatLngExpression[]} pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.85 }} />}
      <FitRoute pickup={pickup} destination={destination} driver={driver} />
    </MapContainer>
  );
}