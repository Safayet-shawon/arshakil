"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Place } from "@/types";

/** Leaflet map with one mustard pin per place. Popups link down to the place's post. */
export default function TravelMap({ places, world }: { places: Place[]; world: boolean }) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false, worldCopyJump: true });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors", maxZoom: 18,
      }).addTo(map);
      const icon = L.divIcon({ className: "", html: '<span class="map-pin"></span>', iconSize: [22, 22], iconAnchor: [11, 11] });
      places.forEach((p) => {
        L.marker([p.lat, p.lng], { icon, title: p.name })
          .addTo(map!)
          .bindTooltip(p.name, { direction: "top", offset: [0, -10] })
          .bindPopup(`<strong>${p.name}</strong><br/><small>${p.country}</small><br/><a href="#post-${p.slug}">Read the post ↓</a>`);
      });
      if (world) map.setView([25, 20], 2);
      else map.fitBounds(L.latLngBounds(places.map((p) => [p.lat, p.lng] as [number, number])), { padding: [30, 30] });
    })();
    return () => { cancelled = true; map?.remove(); };
  }, [places, world]);

  return <div ref={el} role="region" aria-label="Travel map" className="h-[clamp(320px,60vh,560px)] w-full overflow-hidden rounded-2xl border border-g200" />;
}
