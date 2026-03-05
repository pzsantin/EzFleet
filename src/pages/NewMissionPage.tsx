import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import RouteMapInteractive from '@/components/RouteMapInteractive';
import { MissionPoint } from '@/types/fleet';
import { computeDistanceKm, computeAvgSpeed } from '@/lib/utils';
import { getRouteDirections } from '@/integrations/google-maps/directionsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MapPin, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebase } from '@/hooks/useFirebase';

const NewMissionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles, addMission } = useFirebase(user?.uid);
  
  const [name, setName] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [notes, setNotes] = useState('');
  const [points, setPoints] = useState<MissionPoint[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [fuelConsumed, setFuelConsumed] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Atualizar rota quando pontos mudam
  useEffect(() => {
    if (points.length < 2) {
      setDistanceKm(0);
      setDurationMinutes(0);
      setFuelConsumed(0);
      return;
    }

    const updateRoute = async () => {
      setIsLoadingRoute(true);
      const result = await getRouteDirections(points);
      if (result) {
        setDistanceKm(result.distanceKm);
        setDurationMinutes(result.durationMinutes);

        // Calcular combustível = distância × consumo médio do veículo
        const selectedVehicle = vehicles.find(v => v.id === vehicleId);
        if (selectedVehicle) {
          const fuel = parseFloat((result.distanceKm / selectedVehicle.avgConsumption).toFixed(2));
          setFuelConsumed(fuel);
        }
      }
      setIsLoadingRoute(false);
    };

    updateRoute();
  }, [points, vehicleId, vehicles]);

  const addPoint = (lat: number, lng: number) => {
    setPoints(prev => [...prev, { lat, lng, label: `Ponto ${prev.length + 1}`, order: prev.length }]);
  };

  const removePoint = (index: number) => {
    setPoints(prev => prev.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i })));
  };

  const updatePointLabel = (index: number, label: string) => {
    setPoints(prev => prev.map((p, i) => i === index ? { ...p, label } : p));
  };

  const save = async () => {
    if (!name || !vehicleId || points.length < 2) {
      toast.error('Preencha o nome, selecione um veículo e adicione pelo menos 2 pontos');
      return;
    }

    setIsSaving(true);
    try {
      const selectedVehicle = vehicles.find(v => v.id === vehicleId);
      if (!selectedVehicle) {
        toast.error('Veículo selecionado não encontrado');
        return;
      }

      const avgSpeed = computeAvgSpeed(distanceKm, durationMinutes);

      await addMission({
        name,
        vehicleId,
        vehicleName: selectedVehicle.name,
        points,
        notes,
        status: 'planned',
        distanceKm,
        durationMinutes,
        fuelConsumed,
        avgSpeed,
        createdAt: new Date().toISOString(),
      });

      toast.success('Missão criada com sucesso!');
      navigate('/missions');
    } catch (error) {
      toast.error('Erro ao criar missão');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/missions')} className="h-10 w-10 rounded-lg border flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Nova Missão</h1>
            <p className="text-sm text-muted-foreground">Defina o trajeto clicando no mapa</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg border p-4 space-y-4" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="space-y-2">
                <Label>Nome da Missão</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Patrulha Norte" />
              </div>
              <div className="space-y-2">
                <Label>Veículo</Label>
                <Select value={vehicleId} onValueChange={setVehicleId}>
                  <SelectTrigger><SelectValue placeholder="Selecionar veículo" /></SelectTrigger>
                  <SelectContent>
                    {vehicles.filter(v => v.status === 'active').map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.name} ({v.plate})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas sobre a missão..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Duração (min)</Label>
                <Input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  placeholder="Ex: 90"
                />
              </div>
              <div className="space-y-2">
                <Label>Combustível (L)</Label>
                <Input
                  type="number"
                  value={fuelConsumed}
                  onChange={(e) => setFuelConsumed(Number(e.target.value))}
                  placeholder="Ex: 3.5"
                />
              </div>
              <div className="space-y-2">
                <Label>Distância estimada</Label>
                <p className="text-sm font-medium">{computeDistanceKm(points)} km</p>
              </div>
              <div className="space-y-2">
                <Label>Velocidade média estimada</Label>
                <p className="text-sm font-medium">
                  {computeAvgSpeed(computeDistanceKm(points), Number(durationMinutes))} km/h
                </p>
              </div>
            </div>

            {/* Points List */}
            <div className="bg-card rounded-lg border" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="p-4 border-b">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Pontos ({points.length})
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Clique no mapa para adicionar pontos</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y">
                {points.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 p-3">
                    <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <Input
                      value={p.label || ''}
                      onChange={e => updatePointLabel(i, e.target.value)}
                      className="h-8 text-xs flex-1"
                    />
                    <button onClick={() => removePoint(i)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {points.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground text-xs">
                    Nenhum ponto adicionado
                  </div>
                )}
              </div>
            </div>

            <Button className="w-full gap-2" onClick={save} disabled={!name || !vehicleId || points.length < 2 || isSaving}>
              <Save className="h-4 w-4" /> {isSaving ? 'Salvando...' : 'Salvar Missão'}
            </Button>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 bg-card rounded-lg border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
            <RouteMapInteractive 
              points={points} 
              onPointAdd={addPoint}
              onPointRemove={removePoint}
              interactive={true}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewMissionPage;
