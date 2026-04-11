'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

export const DEFAULT_MAP_CENTER: [number, number] = [24.7136, 46.6753];

function MapClickHandler({
  onPosition,
  disabled,
}: {
  onPosition: (lat: number, lng: number) => void;
  disabled?: boolean;
}) {
  useMapEvents(
    disabled
      ? {}
      : {
          click(e) {
            onPosition(e.latlng.lat, e.latlng.lng);
          },
        },
  );
  return null;
}

function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      map.invalidateSize();
    });
    const t = window.setTimeout(() => map.invalidateSize(), 200);
    return () => {
      window.cancelAnimationFrame(id);
      window.clearTimeout(t);
    };
  }, [map]);
  return null;
}

function RecenterWhenPositionChanges({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

function usePinIcon() {
  return useMemo(
    () =>
      L.divIcon({
        className: 'store-settings-map-pin',
        html: '<span class="block size-3 rounded-full border-2 border-white bg-primary shadow-md ring-2 ring-primary/30"></span>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      }),
    [],
  );
}

export type LeafletPickMapProps = {
  latitude: string;
  longitude: string;
  onMapClick: (lat: number, lng: number) => void;
  disabled?: boolean;
  className?: string;
  /** When true, map is not rendered (e.g. dialog closed) */
  active?: boolean;
};

export function parseLatLngStrings(latitude: string, longitude: string) {
  const lat = Number.parseFloat(latitude);
  const lng = Number.parseFloat(longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng } as const;
  }
  return null;
}

/**
 * Clickable map with a single draggable pin (click to move). Used inline on settings and inside the location dialog.
 */
export function LeafletPickMap({
  latitude,
  longitude,
  onMapClick,
  disabled,
  className,
  active = true,
}: LeafletPickMapProps) {
  const pinIcon = usePinIcon();
  const position = useMemo(() => {
    const parsed = parseLatLngStrings(latitude, longitude);
    if (parsed) {
      return parsed;
    }
    return { lat: DEFAULT_MAP_CENTER[0], lng: DEFAULT_MAP_CENTER[1] };
  }, [latitude, longitude]);

  const handleClick = useCallback(
    (lat: number, lng: number) => {
      if (!disabled) {
        onMapClick(lat, lng);
      }
    },
    [disabled, onMapClick],
  );

  if (!active) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg border border-border bg-muted/30 [&_.leaflet-container]:z-0',
        className,
      )}
    >
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={13}
        className="h-[min(280px,45vh)] w-full min-h-[200px]"
        scrollWheelZoom={!disabled}
        dragging={!disabled}
        doubleClickZoom={!disabled}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <InvalidateSizeOnMount />
        <RecenterWhenPositionChanges lat={position.lat} lng={position.lng} />
        <MapClickHandler onPosition={handleClick} disabled={disabled} />
        <Marker position={[position.lat, position.lng]} icon={pinIcon} />
      </MapContainer>
    </div>
  );
}

type StoreLocationMapProps = {
  latitude: string;
  longitude: string;
  onPick: (latitude: string, longitude: string) => void;
  disabled?: boolean;
};

/**
 * Inline map for store settings: click to set coordinates (strings fixed to 6 decimals).
 */
export function StoreLocationMap({ latitude, longitude, onPick, disabled }: StoreLocationMapProps) {
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      onPick(lat.toFixed(6), lng.toFixed(6));
    },
    [onPick],
  );

  return (
    <LeafletPickMap
      latitude={latitude}
      longitude={longitude}
      onMapClick={handleMapClick}
      disabled={disabled}
    />
  );
}
