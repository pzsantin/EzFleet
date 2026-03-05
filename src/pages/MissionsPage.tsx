import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Mission } from '@/types/fleet';
import { computeDistanceKm } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, MapPin, Clock, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebase } from '@/hooks/useFirebase';

const statusLabel = (s: Mission['status']) =>
  s === 'completed' ? 'Concluída' : s === 'in_progress' ? 'Em andamento' : 'Planejada';

const statusColor = (s: Mission['status']) =>
  s === 'completed' ? 'bg-success/10 text-success' :
  s === 'in_progress' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground';

const MissionsPage = () => {
  const { user } = useAuth();
  const { missions, loading } = useFirebase(user?.uid);
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | Mission['status']>('all');

  const filtered = missions.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.vehicleName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Missões</h1>
              <p className="text-muted-foreground text-sm">Trajetos e percursos registrados</p>
            </div>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <p>Carregando missões...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Missões</h1>
            <p className="text-muted-foreground text-sm">Trajetos e percursos registrados</p>
          </div>
          <Link to="/missions/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Nova Missão
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar missão..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {(['all', 'planned', 'in_progress', 'completed'] as const).map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  filter === s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground'
                }`}>
                {s === 'all' ? 'Todas' : statusLabel(s)}
              </button>
            ))}
          </div>
        </div>

        {/* Mission List */}
        <div className="space-y-3">
          {filtered.map(mission => (
            <Link to={`/missions/${mission.id}`} key={mission.id}
              className="stat-card flex items-center gap-4 animate-fade-in cursor-pointer">
              <div className={`h-3 w-3 rounded-full flex-shrink-0 ${
                mission.status === 'completed' ? 'bg-success' :
                mission.status === 'in_progress' ? 'bg-warning' : 'bg-muted-foreground'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-sm">{mission.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(mission.status)}`}>
                    {statusLabel(mission.status)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{mission.vehicleName} • {mission.points.length} pontos</p>
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{
                    mission.distanceKm && mission.distanceKm > 0
                      ? `${mission.distanceKm} km`
                      : mission.points.length > 1
                      ? `${computeDistanceKm(mission.points)} km`
                      : '—'
                  }</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{mission.durationMinutes > 0 ? `${mission.durationMinutes} min` : '—'}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Fuel className="h-3.5 w-3.5" />
                  <span>{mission.fuelConsumed > 0 ? `${mission.fuelConsumed} L` : '—'}</span>
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Nenhuma missão encontrada</p>
              {missions.length === 0 && (
                <p className="text-sm">Clique em "Nova Missão" para criar</p>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MissionsPage;
