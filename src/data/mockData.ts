import { Vehicle, Mission } from '@/types/fleet';

export const mockVehicles: Vehicle[] = [
  { id: '1', name: 'Hilux Alpha', plate: 'ABC-1234', type: 'SUV', fuelType: 'Diesel', avgConsumption: 10.5, status: 'active', totalKm: 45230, missions: 12 },
  { id: '2', name: 'Ranger Bravo', plate: 'DEF-5678', type: 'Pickup', fuelType: 'Diesel', avgConsumption: 9.8, status: 'active', totalKm: 32100, missions: 8 },
  { id: '3', name: 'Frontier Charlie', plate: 'GHI-9012', type: 'Pickup', fuelType: 'Gasolina', avgConsumption: 8.2, status: 'maintenance', totalKm: 67800, missions: 22 },
  { id: '4', name: 'Duster Delta', plate: 'JKL-3456', type: 'SUV', fuelType: 'Flex', avgConsumption: 11.0, status: 'active', totalKm: 15400, missions: 5 },
];

export const mockMissions: Mission[] = [
  {
    id: '1', name: 'Patrulha Norte - Setor A', vehicleId: '1', vehicleName: 'Hilux Alpha',
    points: [
      { lat: -23.5505, lng: -46.6333, label: 'Base', order: 0 },
      { lat: -23.5400, lng: -46.6200, label: 'Ponto 1', order: 1 },
      { lat: -23.5300, lng: -46.6100, label: 'Ponto 2', order: 2 },
      { lat: -23.5200, lng: -46.6000, label: 'Ponto 3', order: 3 },
    ],
    status: 'completed', distanceKm: 45.2, durationMinutes: 120, fuelConsumed: 4.3, avgSpeed: 22.6,
    createdAt: '2026-02-28T08:00:00', completedAt: '2026-02-28T10:00:00', notes: 'Missão concluída sem incidentes'
  },
  {
    id: '2', name: 'Ronda Sul - Perímetro B', vehicleId: '2', vehicleName: 'Ranger Bravo',
    points: [
      { lat: -23.5700, lng: -46.6500, label: 'Início', order: 0 },
      { lat: -23.5800, lng: -46.6600, label: 'Checkpoint 1', order: 1 },
      { lat: -23.5900, lng: -46.6700, label: 'Checkpoint 2', order: 2 },
    ],
    status: 'completed', distanceKm: 32.8, durationMinutes: 90, fuelConsumed: 3.3, avgSpeed: 21.9,
    createdAt: '2026-03-01T06:00:00', completedAt: '2026-03-01T07:30:00',
  },
  {
    id: '3', name: 'Inspeção Leste - Área C', vehicleId: '1', vehicleName: 'Hilux Alpha',
    points: [
      { lat: -23.5505, lng: -46.6333, label: 'Base', order: 0 },
      { lat: -23.5450, lng: -46.6100, label: 'Ponto A', order: 1 },
    ],
    status: 'planned', distanceKm: 0, durationMinutes: 0, fuelConsumed: 0, avgSpeed: 0,
    createdAt: '2026-03-04T10:00:00',
  },
  {
    id: '4', name: 'Transporte Logístico', vehicleId: '3', vehicleName: 'Frontier Charlie',
    points: [
      { lat: -23.5600, lng: -46.6400, label: 'Depósito', order: 0 },
      { lat: -23.5100, lng: -46.5800, label: 'Destino', order: 1 },
    ],
    status: 'in_progress', distanceKm: 18.5, durationMinutes: 45, fuelConsumed: 2.3, avgSpeed: 24.7,
    createdAt: '2026-03-04T07:00:00',
  },
];
