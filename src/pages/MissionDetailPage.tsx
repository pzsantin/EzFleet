import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import RouteMapInteractive from '@/components/RouteMapInteractive';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, MapPin, Clock, Fuel, Gauge, Truck, Edit, Trash2, Calendar, Plus, X } from 'lucide-react';
import { computeDistanceKm, computeAvgSpeed } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebase } from '@/hooks/useFirebase';
import { MissionPoint } from '@/types/fleet';

const MissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { missions, vehicles, deleteMission, updateMission } = useFirebase(user?.uid);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    vehicleName: '', 
    notes: '', 
    status: 'planned' as const,
    points: [] as MissionPoint[],
    durationMinutes: 0,
    fuelConsumed: 0,
  });
  const [newPointForm, setNewPointForm] = useState({ lat: '', lng: '', label: '' });
  
  const mission = missions.find(m => m.id === id);

  const openEditDialog = () => {
    if (mission) {
      setEditForm({
        name: mission.name,
        vehicleName: mission.vehicleName,
        notes: mission.notes || '',
        status: mission.status,
        points: [...mission.points],
        durationMinutes: mission.durationMinutes || 0,
        fuelConsumed: mission.fuelConsumed || 0,
      });
      setNewPointForm({ lat: '', lng: '', label: '' });
      setEditDialogOpen(true);
    }
  };

  const handleAddPoint = () => {
    if (!newPointForm.lat || !newPointForm.lng) {
      toast.error('Preencha latitude e longitude');
      return;
    }

    const lat = parseFloat(newPointForm.lat);
    const lng = parseFloat(newPointForm.lng);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Latitude e longitude devem ser números válidos');
      return;
    }

    const newPoint: MissionPoint = {
      lat,
      lng,
      label: newPointForm.label || `Ponto ${editForm.points.length + 1}`,
      order: editForm.points.length,
    };

    setEditForm({
      ...editForm,
      points: [...editForm.points, newPoint],
    });
    setNewPointForm({ lat: '', lng: '', label: '' });
    toast.success('Ponto adicionado');
  };

  const handleRemovePoint = (index: number) => {
    setEditForm({
      ...editForm,
      points: editForm.points.filter((_, i) => i !== index).map((p, i) => ({ ...p, order: i })),
    });
    toast.success('Ponto removido');
  };

  const handleSaveEdit = async () => {
    if (!editForm.name || !editForm.vehicleName) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (editForm.points.length === 0) {
      toast.error('A missão deve ter pelo menos um ponto de rota');
      return;
    }

    setIsSaving(true);
    try {
      const distanceKm = computeDistanceKm(editForm.points);
      const durationNum = Number(editForm.durationMinutes) || 0;
      const fuelNum = Number(editForm.fuelConsumed) || 0;
      const avgSpeed = computeAvgSpeed(distanceKm, durationNum);

      const updates: any = {
        name: editForm.name,
        vehicleName: editForm.vehicleName,
        notes: editForm.notes,
        status: editForm.status,
        points: editForm.points,
        distanceKm,
        durationMinutes: durationNum,
        fuelConsumed: fuelNum,
        avgSpeed,
      };
      if (editForm.status === 'completed' && mission && !mission.completedAt) {
        updates.completedAt = new Date().toISOString();
      }

      await updateMission(id!, updates);
      toast.success('Missão atualizada com sucesso');
      setEditDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao atualizar missão');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Deseja realmente remover esta missão?')) return;
    try {
      await deleteMission(id!);
      toast.success('Missão removida');
      navigate('/missions');
    } catch (error) {
      toast.error('Erro ao remover missão');
      console.error(error);
    }
  };

  if (!mission) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Missão não encontrada</p>
          <Link to="/missions"><Button variant="outline" className="mt-4">Voltar</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  const statusLabel = mission.status === 'completed' ? 'Concluída' : mission.status === 'in_progress' ? 'Em andamento' : 'Planejada';
  const statusColor = mission.status === 'completed' ? 'bg-success/10 text-success' :
    mission.status === 'in_progress' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/missions')} className="h-10 w-10 rounded-lg border flex items-center justify-center hover:bg-secondary transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{mission.name}</h1>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>{statusLabel}</span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Truck className="h-3.5 w-3.5" /> {mission.vehicleName}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1" onClick={openEditDialog}>
              <Edit className="h-3.5 w-3.5" /> Editar
            </Button>
            <Button variant="outline" size="sm" className="gap-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleDelete}>
              <Trash2 className="h-3.5 w-3.5" /> Excluir
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="stat-card text-center">
            <MapPin className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-xl font-bold">
              {mission.distanceKm && mission.distanceKm > 0
                ? `${mission.distanceKm} km`
                : mission.points.length > 1
                ? `${computeDistanceKm(mission.points)} km`
                : '—'}
            </p>
            <p className="text-xs text-muted-foreground">Distância</p>
          </div>
          <div className="stat-card text-center">
            <Clock className="h-5 w-5 mx-auto text-info mb-1" />
            <p className="text-xl font-bold">{mission.durationMinutes > 0 ? `${mission.durationMinutes} min` : '—'}</p>
            <p className="text-xs text-muted-foreground">Duração</p>
          </div>
          <div className="stat-card text-center">
            <Fuel className="h-5 w-5 mx-auto text-warning mb-1" />
            <p className="text-xl font-bold">{mission.fuelConsumed > 0 ? `${mission.fuelConsumed} L` : '—'}</p>
            <p className="text-xs text-muted-foreground">Combustível</p>
          </div>
          <div className="stat-card text-center">
            <Gauge className="h-5 w-5 mx-auto text-success mb-1" />
            <p className="text-xl font-bold">
              {mission.avgSpeed && mission.avgSpeed > 0
                ? `${mission.avgSpeed} km/h`
                : mission.durationMinutes > 0
                ? `${computeAvgSpeed(
                    mission.distanceKm > 0 ? mission.distanceKm : computeDistanceKm(mission.points),
                    mission.durationMinutes
                  )} km/h`
                : '—'}
            </p>
            <p className="text-xs text-muted-foreground">Vel. Média</p>
          </div>
        </div>

        {/* Map */}
        <div className="bg-card rounded-lg border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <RouteMapInteractive 
            points={mission.points} 
            interactive={false}
            className="w-full" 
          />
        </div>

        {/* Points List */}
        <div className="bg-card rounded-lg border" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="p-4 border-b">
            <h2 className="font-semibold">Pontos do Percurso</h2>
          </div>
          <div className="divide-y">
            {mission.points.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{p.label || `Ponto ${i + 1}`}</p>
                  <p className="text-xs text-muted-foreground">{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        {mission.notes && (
          <div className="bg-card rounded-lg border p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h2 className="font-semibold mb-2">Observações</h2>
            <p className="text-sm text-muted-foreground">{mission.notes}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Criada em {new Date(mission.createdAt).toLocaleDateString('pt-BR')}
          {mission.completedAt && ` • Concluída em ${new Date(mission.completedAt).toLocaleDateString('pt-BR')}`}
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Missão</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4 pb-4">
                <div className="space-y-2">
                  <Label>Nome da Missão</Label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    placeholder="Ex: Entrega em São Paulo"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Veículo</Label>
                  <Select value={editForm.vehicleName} onValueChange={(val) => setEditForm({ ...editForm, vehicleName: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(v => (
                        <SelectItem key={v.id} value={v.name}>
                          {v.name} ({v.plate})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editForm.status} onValueChange={(val: any) => setEditForm({ ...editForm, status: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planejada</SelectItem>
                      <SelectItem value="in_progress">Em andamento</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Adicione observações sobre a missão"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duração (min)</Label>
                  <Input
                    type="number"
                    value={editForm.durationMinutes}
                    onChange={(e) => setEditForm({ ...editForm, durationMinutes: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Combustível (L)</Label>
                  <Input
                    type="number"
                    value={editForm.fuelConsumed}
                    onChange={(e) => setEditForm({ ...editForm, fuelConsumed: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Distância calculada</Label>
                  <p className="text-sm font-medium">{computeDistanceKm(editForm.points)} km</p>
                </div>
                <div className="space-y-2">
                  <Label>Velocidade média</Label>
                  <p className="text-sm font-medium">
                    {computeAvgSpeed(computeDistanceKm(editForm.points), editForm.durationMinutes)} km/h
                  </p>
                </div>

                {/* Pontos da Rota */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">Pontos da Rota</Label>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {editForm.points.length} ponto{editForm.points.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Lista de Pontos Existentes */}
                  {editForm.points.length > 0 && (
                    <div className="bg-secondary/30 rounded-lg p-3 mb-4 space-y-2">
                      {editForm.points.map((point, index) => (
                        <div key={index} className="flex items-center justify-between gap-2 bg-background rounded p-2 text-sm">
                          <div className="flex-1">
                            <p className="font-medium">{point.label}</p>
                            <p className="text-xs text-muted-foreground">{point.lat.toFixed(4)}, {point.lng.toFixed(4)}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePoint(index)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulário para Adicionar Novo Ponto */}
                  <div className="bg-secondary/20 rounded-lg p-3 space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Adicionar Ponto
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="lat" className="text-xs">Latitude</Label>
                        <Input
                          id="lat"
                          type="number"
                          step="0.0001"
                          value={newPointForm.lat}
                          onChange={(e) => setNewPointForm({ ...newPointForm, lat: e.target.value })}
                          placeholder="-23.5505"
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="lng" className="text-xs">Longitude</Label>
                        <Input
                          id="lng"
                          type="number"
                          step="0.0001"
                          value={newPointForm.lng}
                          onChange={(e) => setNewPointForm({ ...newPointForm, lng: e.target.value })}
                          placeholder="-46.6333"
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="label" className="text-xs">Rótulo (opcional)</Label>
                      <Input
                        id="label"
                        value={newPointForm.label}
                        onChange={(e) => setNewPointForm({ ...newPointForm, label: e.target.value })}
                        placeholder="Ex: Destino Final"
                        className="h-8 text-sm"
                      />
                    </div>

                    <Button
                      onClick={handleAddPoint}
                      size="sm"
                      className="w-full text-sm"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar Ponto
                    </Button>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEdit} disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MissionDetailPage;
