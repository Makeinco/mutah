import { Link } from "@tanstack/react-router";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { decideFor, VERDICT_LABEL } from "@/lib/mutah/decision";
import { useLang } from "@/lib/mutah/i18n";
import { loadMapLibre } from "@/lib/mutah/maplibre-client";
import type { AccessNeed, Facility } from "@/lib/mutah/types";

const TILE_URL =
  import.meta.env["VITE_MAP_TILE_URL"] || "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const VERDICT_MARK = {
  available: "✓",
  partial: "≈",
  not_available: "!",
  insufficient: "?",
} as const;
const VERDICT_CLASS = {
  available: "bg-access text-white",
  partial: "bg-primary text-white",
  not_available: "bg-caution text-black",
  insufficient: "bg-unknown text-foreground",
} as const;

export function SchematicMap({
  facilities,
  needs,
  selectedId,
  onSelect,
}: {
  facilities: Facility[];
  needs: AccessNeed[];
  selectedId?: string | undefined;
  onSelect?: (id: string) => void;
}) {
  const { pick, lang } = useLang();
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    if (!host.current) return;
    let cancelled = false;
    const markers: Marker[] = [];
    void loadMapLibre().then(({ Map, Marker, NavigationControl }) => {
      if (cancelled || !host.current) return;
      const located = facilities.filter((f) => f.coordinates);
      const first = located[0]?.coordinates;
      const map = new Map({
        container: host.current,
        center: first ? [first.longitude, first.latitude] : [46.6753, 24.7136],
        zoom: located.length ? 11 : 9,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: [TILE_URL],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
        attributionControl: { compact: true },
      });
      mapRef.current = map;
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      for (const facility of located) {
        const verdict = decideFor(facility, needs).verdict;
        const button = document.createElement("button");
        button.type = "button";
        button.className = `flex size-10 items-center justify-center rounded-full border-2 border-white font-black shadow-md ${VERDICT_CLASS[verdict]}`;
        button.textContent = VERDICT_MARK[verdict];
        button.setAttribute(
          "aria-label",
          `${pick(facility.name)} — ${pick(VERDICT_LABEL[verdict])}`,
        );
        button.onclick = () => selectRef.current?.(facility.id);
        markers.push(
          new Marker({ element: button })
            .setLngLat([facility.coordinates!.longitude, facility.coordinates!.latitude])
            .addTo(map),
        );
      }
    });
    return () => {
      cancelled = true;
      markers.forEach((marker) => marker.remove());
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [facilities, needs, pick]);

  const selected = facilities.find((facility) => facility.id === selectedId);
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div
        ref={host}
        className="h-[22rem] w-full"
        aria-label={lang === "ar" ? "خريطة المرافق" : "Facilities map"}
      />
      <p className="border-t border-border bg-background px-4 py-2 text-xs text-muted-foreground">
        {lang === "ar"
          ? "الخريطة والقائمة تعرضان قرار الوصول نفسه. بيانات الخريطة © مساهمو OpenStreetMap."
          : "Map and list use the same access verdict. Map data © OpenStreetMap contributors."}
      </p>
      {selected ? (
        <div className="border-t border-border bg-background p-4">
          <p className="font-bold">{pick(selected.name)}</p>
          <p className="text-sm text-muted-foreground">
            {pick(VERDICT_LABEL[decideFor(selected, needs).verdict])}
          </p>
          <div className="mt-2 flex gap-4 text-sm font-semibold text-primary">
            <Link to="/facility/$id" params={{ id: selected.id }}>
              {lang === "ar" ? "التفاصيل" : "Details"}
            </Link>
            <Link to="/contribute/$facilityId" params={{ facilityId: selected.id }}>
              {lang === "ar" ? "ساهم" : "Contribute"}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
