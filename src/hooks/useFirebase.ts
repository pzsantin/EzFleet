import { useState, useEffect } from 'react';
import { Vehicle, Mission } from '@/types/fleet';
import {
  getVehicles,
  getMissions,
  addVehicle as fbAddVehicle,
  updateVehicle as fbUpdateVehicle,
  deleteVehicle as fbDeleteVehicle,
  addMission as fbAddMission,
  updateMission as fbUpdateMission,
  deleteMission as fbDeleteMission,
} from '@/integrations/firebase/firebaseService';

/**
 * Hook customizado para gerenciar dados de veículos e missões com Firebase
 */
export const useFirebase = (userId: string | undefined) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ============= CARREGAMENTO INICIAL =============
  useEffect(() => {
    console.log('📦 useFirebase - useEffect executado com userId:', userId);
    
    if (!userId) {
      console.log('📦 useFirebase - Sem userId, limpando dados');
      setVehicles([]);
      setMissions([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        console.log('📦 useFirebase - Carregando dados para userId:', userId);
        setLoading(true);
        const [vehiclesData, missionsData] = await Promise.all([
          getVehicles(userId),
          getMissions(userId),
        ]);
        console.log('📦 useFirebase - Dados carregados:', { vehicles: vehiclesData.length, missions: missionsData.length });
        setVehicles(vehiclesData);
        setMissions(missionsData);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar dados';
        console.error('❌ Erro ao carregar dados do Firebase:', err);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  // ============= OPERAÇÕES COM VEÍCULOS =============
  const addVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
    if (!userId) throw new Error('Usuário não autenticado');
    try {
      const newVehicle = await fbAddVehicle(userId, vehicle);
      setVehicles([...vehicles, newVehicle]);
      return newVehicle;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar veículo');
      throw err;
    }
  };

  const updateVehicle = async (vehicleId: string, updates: Partial<Vehicle>) => {
    if (!userId) throw new Error('Usuário não autenticado');
    try {
      await fbUpdateVehicle(userId, vehicleId, updates);
      setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, ...updates } : v));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar veículo');
      throw err;
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    if (!userId) throw new Error('Usuário não autenticado');
    try {
      await fbDeleteVehicle(userId, vehicleId);
      setVehicles(vehicles.filter(v => v.id !== vehicleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar veículo');
      throw err;
    }
  };

  // ============= OPERAÇÕES COM MISSÕES =============
  const addMission = async (mission: Omit<Mission, 'id'>) => {
    if (!userId) throw new Error('Usuário não autenticado');
    try {
      const newMission = await fbAddMission(userId, mission);
      setMissions([...missions, newMission]);
      return newMission;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar missão');
      throw err;
    }
  };

  const updateMission = async (missionId: string, updates: Partial<Mission>) => {
    if (!userId) throw new Error('Usuário não autenticado');
    try {
      await fbUpdateMission(userId, missionId, updates);
      setMissions(missions.map(m => m.id === missionId ? { ...m, ...updates } : m));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar missão');
      throw err;
    }
  };

  const deleteMission = async (missionId: string) => {
    if (!userId) throw new Error('Usuário não autenticado');
    try {
      await fbDeleteMission(userId, missionId);
      setMissions(missions.filter(m => m.id !== missionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar missão');
      throw err;
    }
  };

  return {
    vehicles,
    missions,
    loading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    addMission,
    updateMission,
    deleteMission,
  };
};
