"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerMapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
}

export default function LocationPickerMap({
  onLocationSelect,
  initialLat = 26.9124,
  initialLng = 75.7873,
  height = "300px",
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Fix Leaflet default icon issue with Next.js/webpack
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`
      );
      if (res.ok) {
        const data = await res.json();
        const road = data.address?.road || "";
        const area =
          data.address?.suburb ||
          data.address?.neighbourhood ||
          data.address?.city ||
          data.address?.town ||
          "";
        const addr =
          road && area
            ? `${road}, ${area}`
            : data.display_name?.split(",").slice(0, 3).join(",") ||
              `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        onLocationSelect(lat, lng, addr.trim());
      } else {
        onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch {
      onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      void reverseGeocode(pos.lat, pos.lng);
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      void reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;
    setMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDetectLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([latitude, longitude], 16);
          markerRef.current.setLatLng([latitude, longitude]);
        }
        reverseGeocode(latitude, longitude);
        setDetecting(false);
      },
      (err) => {
        setDetecting(false);
        alert(
          err.code === 1
            ? "Location permission denied. Please allow location access."
            : "Could not retrieve your location."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Map controls bar */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-sm">🗺️</span>
          <span className="text-xs font-bold text-slate-700">
            {mapReady ? "Tap on map or drag marker to set location" : "Loading map..."}
          </span>
        </div>

        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={detecting}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        >
          {detecting ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Detecting...</span>
            </>
          ) : (
            <>
              <span>📍</span>
              <span>My Location</span>
            </>
          )}
        </button>
      </div>

      {/* Map */}
      <div ref={mapContainerRef} style={{ height, width: "100%" }} />
    </div>
  );
}
