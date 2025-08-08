import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plane, 
  Battery, 
  Zap, 
  Settings, 
  MapPin, 
  Clock, 
  Wrench, 
  Activity,
  Filter,
  Search,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Drone as DroneType, Mission } from '@shared/schema';

export default function FleetDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: drones = [], isLoading: dronesLoading, refetch: refetchDrones } = useQuery<DroneType[]>({
    queryKey: ['/api/drones'],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time data
  });

  const { data: missions = [], isLoading: missionsLoading } = useQuery<Mission[]>({
    queryKey: ['/api/missions'],
    refetchInterval: 30000,
  });

  const updateDroneMutation = useMutation({
    mutationFn: async ({ droneId, status }: { droneId: string; status: string }) => {
      return apiRequest(`/api/drones/${droneId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/drones'] });
      toast({
        title: 'Drone Status Updated',
        description: 'Drone status has been successfully updated.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update drone status.',
        variant: 'destructive',
      });
    },
  });

  // Filter drones based on status and search
  const filteredDrones = drones.filter(drone => {
    const matchesStatus = statusFilter === 'all' || drone.status === statusFilter;
    const matchesSearch = drone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drone.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate fleet statistics
  const fleetStats = {
    total: drones.length,
    available: drones.filter(d => d.status === 'available').length,
    inMission: drones.filter(d => d.status === 'in-mission').length,
    charging: drones.filter(d => d.status === 'charging').length,
    maintenance: drones.filter(d => d.status === 'maintenance').length,
    offline: drones.filter(d => d.status === 'offline').length,
    avgBattery: Math.round(drones.reduce((sum, d) => sum + d.batteryLevel, 0) / (drones.length || 1)),
    totalFlightHours: drones.reduce((sum, d) => sum + d.flightHours, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'in-mission': return 'bg-blue-500';
      case 'charging': return 'bg-yellow-500';
      case 'maintenance': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-mission': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'charging': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 75) return 'text-green-600';
    if (level > 50) return 'text-yellow-600';
    if (level > 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const getDroneActiveMission = (droneId: string) => {
    return missions.find(m => m.droneId === droneId && m.status === 'in-progress');
  };

  if (dronesLoading || missionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading fleet data...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fleet Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time drone fleet management and monitoring
          </p>
        </div>
        <Button 
          onClick={() => { refetchDrones(); }}
          variant="outline"
          data-testid="button-refresh-fleet"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Fleet
        </Button>
      </div>

      {/* Fleet Overview Statistics */}
      <div>
        <h3 className="text-xl font-semibold text-high-contrast mb-4">Fleet Performance Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 grid-comfortable">
          <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-total-drones">
            <Plane className="h-10 w-10 text-blue-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">Total Drones</h4>
            <span className="text-3xl font-bold text-high-contrast">{fleetStats.total}</span>
          </div>

          <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-available-drones">
            <Activity className="h-10 w-10 text-green-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">Available</h4>
            <span className="text-3xl font-bold text-green-400">{fleetStats.available}</span>
          </div>

          <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-active-missions">
            <Activity className="h-10 w-10 text-blue-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">Active Missions</h4>
            <span className="text-3xl font-bold text-blue-400">{fleetStats.inMission}</span>
          </div>

          <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-charging">
            <Zap className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">Charging</h4>
            <span className="text-3xl font-bold text-yellow-400">{fleetStats.charging}</span>
          </div>

          <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-avg-battery">
            <Battery className="h-10 w-10 text-purple-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">Avg Battery</h4>
            <span className="text-3xl font-bold text-purple-400">{fleetStats.avgBattery}%</span>
          </div>

          <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-flight-hours">
            <Clock className="h-10 w-10 text-orange-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">Total Flight Hours</h4>
            <span className="text-3xl font-bold text-orange-400">{Math.round(fleetStats.totalFlightHours)}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <Card>
        <CardHeader className="card-header">
          <CardTitle className="card-title">Fleet Management</CardTitle>
          <CardDescription className="card-description">Monitor and manage your drone fleet inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drones by name, model, or serial..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="input-search-drones"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status-filter" className="select-trigger-solid">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="select-content-solid">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in-mission">In Mission</SelectItem>
                  <SelectItem value="charging">Charging</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Drone Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrones.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' ? 'No drones match your filters' : 'No drones found'}
                </p>
              </div>
            ) : (
              filteredDrones.map((drone) => {
                const activeMission = getDroneActiveMission(drone.id);
                return (
                  <Card 
                    key={drone.id} 
                    className="relative overflow-hidden"
                    data-testid={`drone-card-${drone.id}`}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 ${getStatusColor(drone.status)}`} />
                    
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{drone.name}</CardTitle>
                          <CardDescription>{drone.model}</CardDescription>
                        </div>
                        <Badge 
                          className={`capitalize ${getStatusBadgeColor(drone.status)} px-3 py-1 rounded-full text-xs font-medium ml-4 flex-shrink-0`}
                          data-testid={`badge-status-${drone.id}`}
                        >
                          {drone.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Battery Level */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <Battery className="h-4 w-4 mr-1" />
                            Battery Level
                          </span>
                          <span className={`font-semibold ${getBatteryColor(drone.batteryLevel)}`}>
                            {drone.batteryLevel}%
                          </span>
                        </div>
                        <Progress 
                          value={drone.batteryLevel} 
                          className="h-2"
                          data-testid={`battery-progress-${drone.id}`}
                        />
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>
                          {drone.location.lat.toFixed(4)}, {drone.location.lng.toFixed(4)}
                        </span>
                      </div>

                      {/* Flight Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Flight Hours</span>
                          <p className="font-semibold">{drone.flightHours.toFixed(1)}h</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Max Flight Time</span>
                          <p className="font-semibold">{drone.maxFlightTime}min</p>
                        </div>
                      </div>

                      {/* Sensors */}
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Sensors</span>
                        <div className="flex flex-wrap gap-1">
                          {drone.sensors.slice(0, 3).map((sensor, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs px-2 py-0"
                            >
                              {sensor}
                            </Badge>
                          ))}
                          {drone.sensors.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              +{drone.sensors.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Active Mission */}
                      {activeMission && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Active Mission
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            {activeMission.name}
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 mb-1">
                              <span>Progress</span>
                              <span>{activeMission.progress}%</span>
                            </div>
                            <Progress value={activeMission.progress} className="h-1" />
                          </div>
                        </div>
                      )}

                      {/* Last Maintenance */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-muted-foreground">
                          <Wrench className="h-4 w-4 mr-1" />
                          Last Maintenance
                        </span>
                        <span className="font-medium">
                          {new Date(drone.lastMaintenance).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {drone.status === 'available' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDroneMutation.mutate({ 
                              droneId: drone.id, 
                              status: 'maintenance' 
                            })}
                            data-testid={`button-maintenance-${drone.id}`}
                            disabled={updateDroneMutation.isPending}
                          >
                            <Wrench className="h-3 w-3 mr-1" />
                            Maintenance
                          </Button>
                        )}
                        
                        {drone.status === 'maintenance' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDroneMutation.mutate({ 
                              droneId: drone.id, 
                              status: 'available' 
                            })}
                            data-testid={`button-available-${drone.id}`}
                            disabled={updateDroneMutation.isPending}
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Set Available
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          data-testid={`button-details-${drone.id}`}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}