import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { ExternalLink, MapPin as MapPinIcon, Trash2, Plus } from 'lucide-react';
import { MissionPoint } from '@/types/fleet';

interface RouteMapProps {
  points: MissionPoint[];
  onPointAdd?: (lat: number, lng: number) => void;
  onPointRemove?: (index: number) => void;
  interactive?: boolean;
  className?: string;
}

const RouteMap = ({ points, onPointAdd, onPointRemove, interactive = false, className = '' }: RouteMapProps) => {
  const [inputLat, setInputLat] = useState('');
  const [inputLng, setInputLng] = useState('');
  const [tempPoints, setTempPoints] = useState<MissionPoint[]>(points);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
      setTempPoints([...tempPoints, newPoint]);
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

  const handleAddPoint = () => {
    if (inputLat && inputLng) {
      const lat = parseFloat(inputLat);
      const lng = parseFloat(inputLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        const newPoint: MissionPoint = {
          lat,
          lng,
          label: `Ponto ${tempPoints.length + 1}`,
          order: tempPoints.length + 1,
        };
        setTempPoints([...tempPoints, newPoint]);
        if (onPointAdd) {
          onPointAdd(lat, lng);
        }
        setInputLat('');
        setInputLng('');
      }
    }
  };

  const centerLat = tempPoints.length > 0 ? tempPoints[0].lat : -23.5505;
  const centerLng = tempPoints.length > 0 ? tempPoints[0].lng : -46.6333;
  // optional link to external directions (Google)
  const directionsUrl =
    points.length >= 2
      ? `https://www.google.com/maps/dir/${points.map((p) => `${p.lat},${p.lng}`).join('/')}`
      : `https://www.google.com/maps?q=${centerLat},${centerLng}&z=13`;

  if (!points) {
    console.error('RouteMap received no points!');
  }
  return (
    <div className={`rounded-lg border overflow-hidden ${className}`} style={{ minHeight: '400px' }}>
      <div className="h-full flex flex-col bg-white">
        {/* Header com links */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-sm">Mapa da Rota</h3>
              <p className="text-xs text-gray-600">Clique no link abaixo para visualizar no Google Maps</p>
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

        {/* Google Maps */}
        {googleMapsApiKey ? (
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
              mapContainerClassName="w-full h-64 border-b"
              center={{ lat: centerLat, lng: centerLng }}
              zoom={13}
              onClick={handleMapClick}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
              }}
            >
              {/* Polyline conectando os pontos */}
              {tempPoints.length > 1 && (
                <Polyline
                  path={tempPoints.map(p => ({ lat: p.lat, lng: p.lng }))}
                  options={{
                    strokeColor: '#2563eb',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                  }}
                />
              )}

              {/* Markers */}
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
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: index === 0 ? '#dc2626' : index === tempPoints.length - 1 ? '#16a34a' : '#2563eb',
                    fillOpacity: 0.9,
                    strokeColor: 'white',
                    strokeWeight: 2,
                  }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <MapPinIcon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Chave de API não configurada</p>
              <p className="text-xs text-gray-500 mt-1">Adicione VITE_GOOGLE_MAPS_API_KEY no arquivo .env</p>
            </div>
          </div>
        )}

        {/* Lista de pontos */}
        <div className="flex-1 overflow-y-auto p-4">
          {points.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">Nenhum ponto adicionado</p>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-medium text-sm mb-3">Pontos da Rota ({points.length})</h4>
              {points.map((point, index) => (
                <div key={index} className="bg-gray-50 rounded p-3 border">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 rounded-full bg-red-500 text-white items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        {point.label || `Ponto ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        <code className="bg-gray-200 px-2 py-0.5 rounded">
                          {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                        </code>
                      </p>
                    </div>
                    <a
                      href={`https://www.google.com/maps?q=${point.lat},${point.lng}&z=15`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      title="Abrir ponto no Google Maps"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulário para adicionar pontos */}
          {interactive && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-sm mb-3">Adicionar Ponto</h4>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Latitude (ex: -23.5505)"
                  value={inputLat}
                  onChange={(e) => setInputLat(e.target.value)}
                  step="0.0001"
                  className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Longitude (ex: -46.6333)"
                  value={inputLng}
                  onChange={(e) => setInputLng(e.target.value)}
                  step="0.0001"
                  className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddPoint}
                  className="w-full px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-3 text-xs text-gray-600">
          ℹ️ Clique em "Abrir no Google Maps" acima para visualizar a rota completa
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
