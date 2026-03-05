import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  getDocs as getDocsFunction,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Vehicle, Mission } from '@/types/fleet';

// Helper function to check if Firebase is configured
const isFirebaseAvailable = () => {
  return !!db;
};

// ============= VEÍCULOS =============

/**
 * Adiciona um novo veículo ao Firestore
 */
export const addVehicle = async (userId: string, vehicle: Omit<Vehicle, 'id'>) => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase não está configurado');
  }

  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'vehicles'), {
      ...vehicle,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, ...vehicle };
  } catch (error) {
    console.error('Erro ao adicionar veículo:', error);
    throw error;
  }
};

/**
 * Busca todos os veículos do usuário
 */
export const getVehicles = async (userId: string): Promise<Vehicle[]> => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase não está configurado - retornando array vazio para veículos');
    return [];
  }

  try {
    const q = query(collection(db, 'users', userId, 'vehicles'));
    const querySnapshot = await getDocs(q);
    const vehicles: Vehicle[] = [];
    querySnapshot.forEach((doc) => {
      vehicles.push({
        id: doc.id,
        ...doc.data(),
      } as Vehicle);
    });
    return vehicles;
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    throw error;
  }
};

/**
 * Atualiza um veículo existente
 */
export const updateVehicle = async (userId: string, vehicleId: string, updates: Partial<Vehicle>) => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase não está configurado');
  }

  try {
    const vehicleRef = doc(db, 'users', userId, 'vehicles', vehicleId);
    await updateDoc(vehicleRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    throw error;
  }
};

/**
 * Deleta um veículo
 */
export const deleteVehicle = async (userId: string, vehicleId: string) => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase não está configurado');
  }

  try {
    await deleteDoc(doc(db, 'users', userId, 'vehicles', vehicleId));
  } catch (error) {
    console.error('Erro ao deletar veículo:', error);
    throw error;
  }
};

// ============= MISSÕES =============

/**
 * Adiciona uma nova missão ao Firestore
 */
export const addMission = async (userId: string, mission: Omit<Mission, 'id'>) => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase não está configurado');
  }

  try {
    const docRef = await addDoc(collection(db, 'users', userId, 'missions'), {
      ...mission,
      createdAt: mission.createdAt || new Date().toISOString(),
      updatedAt: Timestamp.now(),
    });
    return { id: docRef.id, ...mission };
  } catch (error) {
    console.error('Erro ao adicionar missão:', error);
    throw error;
  }
};

/**
 * Busca todas as missões do usuário
 */
export const getMissions = async (userId: string): Promise<Mission[]> => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase não está configurado - retornando array vazio para missões');
    return [];
  }

  try {
    const q = query(collection(db, 'users', userId, 'missions'));
    const querySnapshot = await getDocsFunction(q);
    const missions: Mission[] = [];
    querySnapshot.forEach((doc) => {
      missions.push({
        id: doc.id,
        ...doc.data(),
      } as Mission);
    });
    return missions;
  } catch (error) {
    console.error('Erro ao buscar missões:', error);
    throw error;
  }
};

/**
 * Busca missões de um veículo específico
 */
export const getMissionsByVehicle = async (userId: string, vehicleId: string): Promise<Mission[]> => {
  if (!isFirebaseAvailable()) {
    console.warn('Firebase não está configurado - retornando array vazio para missões do veículo');
    return [];
  }

  try {
    const q = query(
      collection(db, 'users', userId, 'missions'),
      where('vehicleId', '==', vehicleId)
    );
    const querySnapshot = await getDocs(q);
    const missions: Mission[] = [];
    querySnapshot.forEach((doc) => {
      missions.push({
        id: doc.id,
        ...doc.data(),
      } as Mission);
    });
    return missions;
  } catch (error) {
    console.error('Erro ao buscar missões do veículo:', error);
    throw error;
  }
};

/**
 * Atualiza uma missão existente
 */
export const updateMission = async (userId: string, missionId: string, updates: Partial<Mission>) => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase não está configurado');
  }

  try {
    const missionRef = doc(db, 'users', userId, 'missions', missionId);
    await updateDoc(missionRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Erro ao atualizar missão:', error);
    throw error;
  }
};

/**
 * Deleta uma missão
 */
export const deleteMission = async (userId: string, missionId: string) => {
  if (!isFirebaseAvailable()) {
    throw new Error('Firebase não está configurado');
  }

  try {
    await deleteDoc(doc(db, 'users', userId, 'missions', missionId));
  } catch (error) {
    console.error('Erro ao deletar missão:', error);
    throw error;
  }
};
