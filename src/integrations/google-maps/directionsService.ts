/**
 * Google Maps Directions API service
 * Calcula distância e duração reais entre pontos de rota
 */

export interface DirectionsResult {
  distanceKm: number; // em km
  durationMinutes: number; // em minutos
  distanceMeters: number;
  durationSeconds: number;
}

export async function getRouteDirections(
  points: { lat: number; lng: number }[]
): Promise<DirectionsResult | null> {
  if (points.length < 2) return null;

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn('VITE_GOOGLE_MAPS_API_KEY não configurada');
    return null;
  }

  try {
    // Construir waypoints: primeiro ponto é origin, último é destination, resto é waypoints
    const origin = `${points[0].lat},${points[0].lng}`;
    const destination = `${points[points.length - 1].lat},${points[points.length - 1].lng}`;
    const waypoints =
      points.length > 2
        ? points.slice(1, -1).map((p) => `${p.lat},${p.lng}`).join('|')
        : '';

    const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
    url.searchParams.append('origin', origin);
    url.searchParams.append('destination', destination);
    if (waypoints) {
      url.searchParams.append('waypoints', waypoints);
    }
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error('Erro ao chamar Google Maps API:', response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.status !== 'OK' || !data.routes || data.routes.length === 0) {
      console.warn('Google Maps retornou status:', data.status);
      return null;
    }

    const route = data.routes[0];
    let totalDistanceMeters = 0;
    let totalDurationSeconds = 0;

    if (route.legs && Array.isArray(route.legs)) {
      for (const leg of route.legs) {
        totalDistanceMeters += leg.distance?.value || 0;
        totalDurationSeconds += leg.duration?.value || 0;
      }
    }

    return {
      distanceKm: parseFloat((totalDistanceMeters / 1000).toFixed(1)),
      durationMinutes: Math.ceil(totalDurationSeconds / 60),
      distanceMeters: totalDistanceMeters,
      durationSeconds: totalDurationSeconds,
    };
  } catch (error) {
    console.error('Erro ao calcular rota:', error);
    return null;
  }
}
