import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------- geometry helpers ----------

/**
 * Calculate the great-circle distance between two points using the Haversine formula.
 * Returns kilometers.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Compute the total distance (km) along an ordered list of points.
 */
export function computeDistanceKm(points: {
  lat: number;
  lng: number;
}[]): number {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += haversineDistance(
      points[i].lat,
      points[i].lng,
      points[i + 1].lat,
      points[i + 1].lng
    );
  }
  return parseFloat(total.toFixed(1));
}

/**
 * Average speed (km/h) from distance and duration in minutes.
 */
export function computeAvgSpeed(distanceKm: number, durationMinutes: number): number {
  if (durationMinutes <= 0) return 0;
  return parseFloat((distanceKm / (durationMinutes / 60)).toFixed(1));
}
