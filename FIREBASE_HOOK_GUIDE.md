# Guia de Uso - Hook useFirebase

Este documento explica como usar o hook `useFirebase` para gerenciar dados de veículos e missões.

## 📋 Índice

1. [Instalação](#instalação)
2. [Uso Básico](#uso-básico)
3. [Operações com Veículos](#operações-com-veículos)
4. [Operações com Missões](#operações-com-missões)
5. [Exemplos Completos](#exemplos-completos)

## Instalação

O hook já está criado em `src/hooks/useFirebase.ts` e pronto para usar!

## Uso Básico

```tsx
import { useFirebase } from '@/hooks/useFirebase';
import { useAuth } from '@/contexts/AuthContext';

function MeuComponente() {
  const { user } = useAuth(); // Obter o usuário autenticado
  const { vehicles, missions, loading, error, ...operacoes } = useFirebase(user?.id);
  
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <p>Veículos: {vehicles.length}</p>
      <p>Missões: {missions.length}</p>
    </div>
  );
}
```

## Operações com Veículos

### 1. Adicionar um novo veículo

```tsx
const { vehicles, addVehicle } = useFirebase(user?.id);

const handleAddVehicle = async () => {
  try {
    const newVehicle = await addVehicle({
      name: 'Hilux Alpha',
      plate: 'ABC-1234',
      type: 'SUV',
      fuelType: 'Diesel',
      avgConsumption: 10.5,
      status: 'active',
      totalKm: 0,
      missions: 0,
    });
    
    console.log('Veículo adicionado:', newVehicle);
    toast.success('Veículo adicionado!');
  } catch (error) {
    toast.error('Erro ao adicionar veículo');
  }
};
```

### 2. Atualizar um veículo

```tsx
const { updateVehicle } = useFirebase(user?.id);

const handleUpdateVehicle = async (vehicleId: string) => {
  try {
    await updateVehicle(vehicleId, {
      status: 'maintenance',
      totalKm: 15000,
    });
    
    toast.success('Veículo atualizado!');
  } catch (error) {
    toast.error('Erro ao atualizar veículo');
  }
};
```

### 3. Deletar um veículo

```tsx
const { deleteVehicle } = useFirebase(user?.id);

const handleDeleteVehicle = async (vehicleId: string) => {
  if (!confirm('Tem certeza?')) return;
  
  try {
    await deleteVehicle(vehicleId);
    toast.success('Veículo removido!');
  } catch (error) {
    toast.error('Erro ao remover veículo');
  }
};
```

## Operações com Missões

### 1. Adicionar uma nova missão

```tsx
const { addMission } = useFirebase(user?.id);

const handleAddMission = async () => {
  try {
    const newMission = await addMission({
      name: 'Patrulha Norte',
      vehicleId: 'vehicle-123',
      vehicleName: 'Hilux Alpha',
      points: [
        { lat: -23.5505, lng: -46.6333, label: 'Base', order: 0 },
        { lat: -23.5400, lng: -46.6200, label: 'Ponto 1', order: 1 },
      ],
      status: 'planned',
      distanceKm: 0,
      durationMinutes: 0,
      fuelConsumed: 0,
      avgSpeed: 0,
      createdAt: new Date().toISOString(),
      notes: 'Missão de patrulha',
    });
    
    console.log('Missão criada:', newMission);
    toast.success('Missão criada!');
  } catch (error) {
    toast.error('Erro ao criar missão');
  }
};
```

### 2. Atualizar uma missão

```tsx
const { updateMission } = useFirebase(user?.id);

const handleUpdateMission = async (missionId: string) => {
  try {
    await updateMission(missionId, {
      status: 'in_progress',
      distanceKm: 45.2,
      durationMinutes: 120,
      fuelConsumed: 4.3,
    });
    
    toast.success('Missão atualizada!');
  } catch (error) {
    toast.error('Erro ao atualizar missão');
  }
};
```

### 3. Finalizar uma missão

```tsx
const { updateMission } = useFirebase(user?.id);

const handleCompleteMission = async (missionId: string) => {
  try {
    await updateMission(missionId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
    
    toast.success('Missão concluída!');
  } catch (error) {
    toast.error('Erro ao finalizar missão');
  }
};
```

### 4. Deletar uma missão

```tsx
const { deleteMission } = useFirebase(user?.id);

const handleDeleteMission = async (missionId: string) => {
  if (!confirm('Tem certeza?')) return;
  
  try {
    await deleteMission(missionId);
    toast.success('Missão removida!');
  } catch (error) {
    toast.error('Erro ao remover missão');
  }
};
```

## Exemplos Completos

### Exemplo 1: Listar todos os veículos

```tsx
import { useFirebase } from '@/hooks/useFirebase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';

function VehiclesList() {
  const { user } = useAuth();
  const { vehicles, loading } = useFirebase(user?.id);

  if (loading) return <p>Carregando veículos...</p>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {vehicles.map(vehicle => (
        <Card key={vehicle.id} className="p-4">
          <h3 className="font-bold">{vehicle.name}</h3>
          <p className="text-sm text-gray-500">{vehicle.plate}</p>
          <p className="text-sm">Consumo: {vehicle.avgConsumption} km/l</p>
          <p className="text-sm">Status: {vehicle.status}</p>
        </Card>
      ))}
    </div>
  );
}

export default VehiclesList;
```

### Exemplo 2: Listar todas as missões

```tsx
import { useFirebase } from '@/hooks/useFirebase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';

function MissionsList() {
  const { user } = useAuth();
  const { missions, loading } = useFirebase(user?.id);

  if (loading) return <p>Carregando missões...</p>;

  return (
    <div className="space-y-4">
      {missions.map(mission => (
        <Card key={mission.id} className="p-4">
          <h3 className="font-bold">{mission.name}</h3>
          <p className="text-sm text-gray-500">{mission.vehicleName}</p>
          <p className="text-sm">Status: {mission.status}</p>
          <p className="text-sm">Distância: {mission.distanceKm} km</p>
          <p className="text-sm">Pontos: {mission.points.length}</p>
        </Card>
      ))}
    </div>
  );
}

export default MissionsList;
```

### Exemplo 3: Componente completo de gerenciamento

```tsx
import { useState } from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

function VehicleManager() {
  const { user } = useAuth();
  const { vehicles, addVehicle, deleteVehicle, loading } = useFirebase(user?.id);
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddVehicle = async () => {
    if (!name || !plate) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsSaving(true);
    try {
      await addVehicle({
        name,
        plate,
        type: 'SUV',
        fuelType: 'Diesel',
        avgConsumption: 10,
        status: 'active',
        totalKm: 0,
        missions: 0,
      });

      setName('');
      setPlate('');
      toast.success('Veículo adicionado!');
    } catch (error) {
      toast.error('Erro ao adicionar veículo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Tem certeza?')) return;

    try {
      await deleteVehicle(vehicleId);
      toast.success('Veículo removido!');
    } catch (error) {
      toast.error('Erro ao remover veículo');
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Gerenciar Veículos</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Nome do veículo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Placa"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
          />
          <Button onClick={handleAddVehicle} disabled={isSaving}>
            {isSaving ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <p className="font-bold">{vehicle.name}</p>
              <p className="text-sm text-gray-500">{vehicle.plate}</p>
            </div>
            <Button
              variant="destructive"
              onClick={() => handleDeleteVehicle(vehicle.id)}
            >
              Remover
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleManager;
```

## 🎯 Dicas e boas práticas

1. **Sempre verifique o `loading`** antes de renderizar:
   ```tsx
   if (loading) return <LoadingSpinner />;
   ```

2. **Trate erros apropriadamente**:
   ```tsx
   try {
     await addVehicle(...);
   } catch (error) {
     console.error('Erro:', error);
     toast.error('Falha na operação');
   }
   ```

3. **Use o `userId` corretamente**:
   ```tsx
   // ✅ Correto
   const { user } = useAuth();
   const data = useFirebase(user?.id);

   // ❌ Errado
   const data = useFirebase(user.id); // Pode ser undefined!
   ```

4. **Não esqueça de adicionar o loader `loading`**:
   ```tsx
   const { vehicles, loading } = useFirebase(user?.id);
   if (loading) return <Spinner />;
   ```

---

**Precisa de ajuda?** Consulte a documentação do Firebase ou os exemplos no código.
