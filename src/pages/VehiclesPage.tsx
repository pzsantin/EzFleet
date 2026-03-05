import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Vehicle } from '@/types/fleet';
import { Plus, Edit, Trash2, Truck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebase } from '@/hooks/useFirebase';

const VehiclesPage = () => {
  const { user } = useAuth();
  const { vehicles, loading, addVehicle, updateVehicle, deleteVehicle } = useFirebase(user?.uid);
  
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ name: '', plate: '', type: 'SUV', fuelType: 'Diesel', avgConsumption: '' });

  const openNew = () => {
    setEditVehicle(null);
    setForm({ name: '', plate: '', type: 'SUV', fuelType: 'Diesel', avgConsumption: '' });
    setDialogOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditVehicle(v);
    setForm({ name: v.name, plate: v.plate, type: v.type, fuelType: v.fuelType, avgConsumption: String(v.avgConsumption) });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.name || !form.plate || !form.avgConsumption) { 
      toast.error('Preencha todos os campos'); 
      return; 
    }
    
    setIsSaving(true);
    try {
      if (editVehicle) {
        await updateVehicle(editVehicle.id, {
          name: form.name,
          plate: form.plate,
          type: form.type,
          fuelType: form.fuelType,
          avgConsumption: Number(form.avgConsumption),
        });
        toast.success('Veículo atualizado');
      } else {
        const newV: Omit<Vehicle, 'id'> = {
          name: form.name,
          plate: form.plate,
          type: form.type,
          fuelType: form.fuelType,
          avgConsumption: Number(form.avgConsumption),
          status: 'active',
          totalKm: 0,
          missions: 0,
        };
        await addVehicle(newV);
        toast.success('Veículo adicionado');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('Erro ao salvar veículo');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Deseja remover este veículo?')) return;
    
    try {
      await deleteVehicle(id);
      toast.success('Veículo removido');
    } catch (error) {
      toast.error('Erro ao remover veículo');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Veículos</h1>
              <p className="text-muted-foreground text-sm">Gerencie sua frota</p>
            </div>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <p>Carregando veículos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Veículos</h1>
            <p className="text-muted-foreground text-sm">Gerencie sua frota</p>
          </div>
          <Button onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" /> Novo Veículo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map(v => (
            <div key={v.id} className="stat-card animate-fade-in">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                    v.status === 'active' ? 'bg-success/10 text-success' :
                    v.status === 'maintenance' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{v.name}</h3>
                    <p className="text-sm text-muted-foreground">{v.plate}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  v.status === 'active' ? 'bg-success/10 text-success' :
                  v.status === 'maintenance' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                }`}>
                  {v.status === 'active' ? 'Ativo' : v.status === 'maintenance' ? 'Manutenção' : 'Inativo'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Tipo</p>
                  <p className="text-sm font-medium">{v.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Consumo</p>
                  <p className="text-sm font-medium">{v.avgConsumption} km/l</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total km</p>
                  <p className="text-sm font-medium">{v.totalKm.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(v)}>
                  <Edit className="h-3 w-3 mr-1" /> Editar
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => remove(v.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {vehicles.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Nenhum veículo registered</p>
            <p className="text-sm">Clique em "Novo Veículo" para adicionar</p>
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editVehicle ? 'Editar Veículo' : 'Novo Veículo'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Hilux Alpha" />
              </div>
              <div className="space-y-2">
                <Label>Placa</Label>
                <Input value={form.plate} onChange={e => setForm(f => ({ ...f, plate: e.target.value }))} placeholder="ABC-1234" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Pickup">Pickup</SelectItem>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Combustível</Label>
                  <Select value={form.fuelType} onValueChange={v => setForm(f => ({ ...f, fuelType: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Gasolina">Gasolina</SelectItem>
                      <SelectItem value="Etanol">Etanol</SelectItem>
                      <SelectItem value="Flex">Flex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Consumo Médio (km/l)</Label>
                <Input type="number" value={form.avgConsumption} onChange={e => setForm(f => ({ ...f, avgConsumption: e.target.value }))} placeholder="10.5" />
              </div>
              <Button className="w-full" onClick={save} disabled={isSaving}>
                {isSaving ? 'Salvando...' : editVehicle ? 'Salvar Alterações' : 'Adicionar Veículo'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default VehiclesPage;
