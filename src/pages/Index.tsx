import DashboardLayout from '@/components/DashboardLayout';
import { Truck, Navigation, Fuel, Clock, TrendingUp, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebase } from '@/hooks/useFirebase';

const StatCard = ({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color?: string }) => (
  <div className="stat-card animate-fade-in">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color || 'bg-primary/10 text-primary'}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);

const Index = () => {
  const { user } = useAuth();
  const { vehicles, missions, loading } = useFirebase(user?.uid);

  // compute derived stats from firebase data
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const completedMissions = missions.filter(m => m.status === 'completed').length;
  const totalDistance = missions.reduce((acc, m) => acc + (m.distanceKm || 0), 0);
  const totalFuel = missions.reduce((acc, m) => acc + (m.fuelConsumed || 0), 0);
  const recentMissions = [...missions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Visão geral da frota e missões</p>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <p>Carregando dados...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Visão geral da frota e missões</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Truck} label="Veículos Ativos" value={`${activeVehicles}/${vehicles.length}`} sub="Em operação" />
          <StatCard icon={Navigation} label="Missões Concluídas" value={String(completedMissions)} sub={`${missions.length} total`} color="bg-success/10 text-success" />
          <StatCard icon={MapPin} label="Distância Total" value={`${totalDistance.toFixed(1)} km`} sub="Todas as missões" color="bg-info/10 text-info" />
          <StatCard icon={Fuel} label="Combustível Usado" value={`${totalFuel.toFixed(1)} L`} sub="Total consumido" color="bg-warning/10 text-warning" />
        </div>

        {/* Recent Missions */}
        <div className="bg-card rounded-lg border" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-semibold">Missões Recentes</h2>
            <Link to="/missions" className="text-sm text-primary hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y">
            {recentMissions.map(mission => (
              <Link to={`/missions/${mission.id}`} key={mission.id} className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors">
                <div className={`h-3 w-3 rounded-full flex-shrink-0 ${
                  mission.status === 'completed' ? 'bg-success' :
                  mission.status === 'in_progress' ? 'bg-warning' : 'bg-muted-foreground'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{mission.name}</p>
                  <p className="text-xs text-muted-foreground">{mission.vehicleName}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{mission.distanceKm > 0 ? `${mission.distanceKm} km` : '—'}</p>
                  <p className="text-xs text-muted-foreground">
                    {mission.status === 'completed' ? 'Concluída' : mission.status === 'in_progress' ? 'Em andamento' : 'Planejada'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Vehicles Quick View */}
        <div className="bg-card rounded-lg border" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-semibold">Frota</h2>
            <Link to="/vehicles" className="text-sm text-primary hover:underline">Gerenciar</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="p-4 text-center">
                <div className={`inline-flex h-10 w-10 rounded-full items-center justify-center mb-2 ${
                  vehicle.status === 'active' ? 'bg-success/10 text-success' :
                  vehicle.status === 'maintenance' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                }`}>
                  <Truck className="h-5 w-5" />
                </div>
                <p className="font-medium text-sm">{vehicle.name}</p>
                <p className="text-xs text-muted-foreground">{vehicle.plate}</p>
                <p className="text-xs mt-1 font-medium">
                  {vehicle.status === 'active' ? 'Ativo' : vehicle.status === 'maintenance' ? 'Manutenção' : 'Inativo'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
