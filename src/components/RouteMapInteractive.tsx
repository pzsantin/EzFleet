import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { ExternalLink, Trash2 } from 'lucide-react';
import { MissionPoint } from '@/types/fleet';
import { Button } from '@/components/ui/button';

interface RouteMapInteractiveProps {
  points: MissionPoint[];
  onPointAdd?: (lat: number, lng: number) => void;
  onPointRemove?: (index: number) => void;
  interactive?: boolean;
  className?: string;
  skipLoadScript?: boolean;
}

const RouteMapInteractive = ({
  points,
  onPointAdd,
  onPointRemove,
  interactive = false,
  className = '',
  skipLoadScript = false,
}: RouteMapInteractiveProps) => {
  const [tempPoints, setTempPoints] = useState<MissionPoint[]>(points);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    setTempPoints(points);
  }, [points]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (interactive && event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const newPoint: MissionPoint = {
        lat,
        lng,
        label: `Ponto ${tempPoints.length + 1}`,
        order: tempPoints.length + 1,
      };
      const updated = [...tempPoints, newPoint];
      setTempPoints(updated);
      if (onPointAdd) {
        onPointAdd(lat, lng);
      }
    }
  };

  const handleRemovePoint = (index: number) => {
    const newPoints = tempPoints.filter((_, i) => i !== index);
    setTempPoints(newPoints);
    if (onPointRemove) {
      onPointRemove(index);
    }
  };

  const centerLat = tempPoints.length > 0 ? tempPoints[0].lat : -23.5505;
  const centerLng = tempPoints.length > 0 ? tempPoints[0].lng : -46.6333;

  const directionsUrl =
    tempPoints.length >= 2
      ? `https://www.google.com/maps/dir/${tempPoints.map((p) => `${p.lat},${p.lng}`).join('/')}`
      : `https://www.google.com/maps?q=${centerLat},${centerLng}&z=13`;

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const defaultCenter = {
    lat: centerLat,
    lng: centerLng,
  };

  const polylineOptions = {
    strokeColor: '#2563eb',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#2563eb',
    fillOpacity: 0.35,
  };

  if (!apiKey) {
    return (
      <div className={`rounded-lg border overflow-hidden ${className}`} style={{ minHeight: '400px' }}>
        <div className="h-full flex flex-col bg-white">
          <div className="bg-red-50 border-b p-4">
            <p className="text-sm font-medium text-red-700">⚠️ Chave de API do Google Maps não configurada</p>
            <p className="text-xs text-red-600 mt-1">Adicione VITE_GOOGLE_MAPS_API_KEY ao arquivo .env.local</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border overflow-hidden ${className}`} style={{ minHeight: '400px' }}>
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="font-semibold text-sm">Mapa da Rota</h3>
              <p className="text-xs text-gray-600">
                {interactive ? '📍 Clique no mapa para adicionar pontos' : 'Rota com ' + tempPoints.length + ' ponto(s)'}
              </p>
            </div>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <ExternalLink className="h-3 w-3" />
              Abrir no Google Maps
            </a>
          </div>
        </div>

        {/* Google Map */}
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          {skipLoadScript ? (
            // Se o LoadScript foi carregado no nível superior, apenas renderizar GoogleMap
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={defaultCenter}
              zoom={14}
              onClick={handleMapClick}
              options={{
                fullscreenControl: true,
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
              }}
            >
              {/* Polyline connecting all points */}
              {tempPoints.length > 1 && (
                <Polyline
                  path={tempPoints.map((p) => ({ lat: p.lat, lng: p.lng }))}
                  options={polylineOptions}
                />
              )}

              {/* Markers for each point */}
              {tempPoints.map((point, index) => (
                <Marker
                  key={index}
                  position={{ lat: point.lat, lng: point.lng }}
                  title={point.label || `Ponto ${index + 1}`}
                  label={{
                    text: String(index + 1),
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  icon={
                    // guard against google being undefined before the script loads
                    (window as any).google && (window as any).google.maps
                      ? {
                        path: (window as any).google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor:
                          index === 0
                            ? '#10b981'
                            : index === tempPoints.length - 1
                              ? '#ef4444'
                              : '#2563eb',
                        fillOpacity: 1,
                        strokeColor: 'white',
                        strokeWeight: 2,
                      }
                      : undefined
                  }
                />
              ))}
            </GoogleMap>
          ) : (
            // Se o LoadScript não foi carregado, envolver GoogleMap com LoadScript
            <LoadScript googleMapsApiKey={apiKey}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={14}
                onClick={handleMapClick}
                options={{
                  fullscreenControl: true,
                  zoomControl: true,
                  mapTypeControl: true,
                  streetViewControl: true,
                }}
              >
                {/* Polyline connecting all points */}
                {tempPoints.length > 1 && (
                  <Polyline
                    path={tempPoints.map((p) => ({ lat: p.lat, lng: p.lng }))}
                    options={polylineOptions}
                  />
                )}

                {/* Markers for each point */}
                {tempPoints.map((point, index) => (
                  <Marker
                    key={index}
                    position={{ lat: point.lat, lng: point.lng }}
                    title={point.label || `Ponto ${index + 1}`}
                    label={{
                      text: String(index + 1),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                    }}
                    icon={
                      // guard against google being undefined before the script loads
                      (window as any).google && (window as any).google.maps
                        ? {
                          path: (window as any).google.maps.SymbolPath.CIRCLE,
                          scale: 10,
                          fillColor:
                            index === 0
                              ? '#10b981'
                              : index === tempPoints.length - 1
                                ? '#ef4444'
                                : '#2563eb',
                          fillOpacity: 1,
                          strokeColor: 'white',
                          strokeWeight: 2,
                        }
                        : undefined
                    }
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          )}
        </div>

        {/* Pontos da Rota */}
        <div className="flex-1 overflow-y-auto p-4 border-t bg-gray-50">
          {tempPoints.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">
                {interactive ? 'Clique no mapa para adicionar pontos' : 'Nenhum ponto adicionado'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-medium text-sm mb-3">Pontos da Rota ({tempPoints.length})</h4>
              {tempPoints.map((point, index) => (
                <div key={index} className="bg-white rounded p-3 border hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        {point.label || `Ponto ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        <code className="bg-gray-200 px-2 py-0.5 rounded text-xs">
                          {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                        </code>
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <a
                        href={`https://www.google.com/maps?q=${point.lat},${point.lng}&z=15`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Abrir no Google Maps"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      {interactive && (
                        <button
                          onClick={() => handleRemovePoint(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remover ponto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-blue-50 p-3 text-xs text-blue-700">
          ℹ️ {interactive ? 'Clique no mapa para adicionar, arraste para navegar' : 'Use "Abrir no Google Maps" para detalhes'}{' '}
        </div>
      </div>
    </div>
  );
};

export default RouteMapInteractive;
