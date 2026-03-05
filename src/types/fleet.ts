export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  type: string;
  fuelType: string;
  avgConsumption: number; // km/l
  status: 'active' | 'maintenance' | 'inactive';
  totalKm: number;
  missions: number;
}

export interface MissionPoint {
  lat: number;
  lng: number;
  label?: string;
  order: number;
}

export interface Mission {
  id: string;
  name: string;
  vehicleId: string;
  vehicleName: string;
  points: MissionPoint[];
  status: 'planned' | 'in_progress' | 'completed';
  distanceKm: number;
  durationMinutes: number;
  fuelConsumed: number; // liters
  avgSpeed: number; // km/h
  createdAt: string;
  completedAt?: string;
  notes?: string;
}
