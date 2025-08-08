import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Square, 
  MapPin, 
  Clock, 
  Route,
  Activity,
  Zap,
  AlertTriangle,
  RefreshCw,
  Radio,
  Target,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Drone, Mission } from '@shared/schema';

export default function LiveMonitoring() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMission, setSelectedMission] = useState<string>('');
  const [mapView, setMapView] = useState<'overview' | 'detailed'>('overview');

  const { data: missions = [], isLoading: missionsLoading } = useQuery<Mission[]>({
    queryKey: ['/api/missions'],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time monitoring
  });

  const { data: drones = [], isLoading: dronesLoading } = useQuery<Drone[]>({
    queryKey: ['/api/drones'],
    refetchInterval: 5000,
  });

  const missionControlMutation = useMutation({
    mutationFn: async ({ missionId, action }: { missionId: string; action: 'pause' | 'resume' | 'abort' }) => {
      let newStatus: string;
      switch (action) {
        case 'pause':
          newStatus = 'paused';
          break;
        case 'resume':
          newStatus = 'in-progress';
          break;
        case 'abort':
          newStatus = 'aborted';
          break;
        default:
          throw new Error('Invalid action');
      }

      return apiRequest(`/api/missions/${missionId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/missions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/drones'] });
      
      let actionText = '';
      switch (variables.action) {
        case 'pause':
          actionText = 'paused';
          break;
        case 'resume':
          actionText = 'resumed';
          break;
        case 'abort':
          actionText = 'aborted';
          break;
      }
      
      toast({
        title: 'Mission Control',
        description: `Mission has been ${actionText} successfully.`,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to control mission. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const activeMissions = missions.filter(m => m.status === 'in-progress');
  const pausedMissions = missions.filter(m => m.status === 'paused');
  const completedMissions = missions.filter(m => m.status === 'completed');
  const completedToday = missions.filter(m => 
    m.status === 'completed' && 
    m.completedAt && 
    new Date(m.completedAt).toDateString() === new Date().toDateString()
  );

  // Get mission details for selected mission
  const currentMission = selectedMission 
    ? missions.find(m => m.id === selectedMission)
    : activeMissions[0];

  const assignedDrone = currentMission?.droneId 
    ? drones.find(d => d.id === currentMission.droneId)
    : null;

  // Calculate estimated completion time
  const getEstimatedCompletion = (mission: Mission) => {
    if (!mission.startedAt || mission.status !== 'in-progress') return null;
    
    const startTime = new Date(mission.startedAt).getTime();
    const now = Date.now();
    const elapsedMinutes = (now - startTime) / (1000 * 60);
    
    if (mission.progress > 0) {
      const totalEstimatedMinutes = (elapsedMinutes / mission.progress) * 100;
      const remainingMinutes = Math.max(0, totalEstimatedMinutes - elapsedMinutes);
      return Math.round(remainingMinutes);
    }
    
    return mission.estimatedDuration - elapsedMinutes;
  };

  // Get mission status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'aborted': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'text-red-600 border-red-200 bg-red-50';
      case 'high': return 'text-orange-600 border-orange-200 bg-orange-50';
      case 'medium': return 'text-blue-600 border-blue-200 bg-blue-50';
      case 'low': return 'text-green-600 border-green-200 bg-green-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  if (missionsLoading || dronesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading mission data...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Mission Monitoring</h1>
          <p className="text-muted-foreground mt-2">
            Real-time flight path visualization and mission control
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Live Data</span>
          </div>
          <Button variant="outline" size="sm" data-testid="button-refresh-monitoring">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Mission Overview Stats */}
      <div>
        <h3 className="text-xl font-semibold text-high-contrast mb-6">Mission Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-active-missions">
          <Activity className="h-10 w-10 text-blue-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-medium-contrast mb-2">Active Missions</h4>
          <span className="text-3xl font-bold text-high-contrast">{activeMissions.length}</span>
        </div>

        <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-paused-missions">
          <Pause className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-medium-contrast mb-2">Paused</h4>
          <span className="text-3xl font-bold text-high-contrast">{pausedMissions.length}</span>
        </div>

        <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-completed-today">
          <Target className="h-10 w-10 text-green-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-medium-contrast mb-2">Completed Today</h4>
          <span className="text-3xl font-bold text-high-contrast">{completedToday.length}</span>
        </div>

        <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-drones-active">
          <Radio className="h-10 w-10 text-purple-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-medium-contrast mb-2">Drones Active</h4>
          <span className="text-3xl font-bold text-high-contrast">{drones.filter(d => d.status === 'in-mission').length}</span>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mission Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission Selection */}
          <Card>
            <CardHeader className="card-header">
              <CardTitle className="card-title">Mission Control Center</CardTitle>
              <CardDescription className="card-description">Monitor and control active drone survey missions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select 
                      value={selectedMission} 
                      onValueChange={setSelectedMission}
                    >
                      <SelectTrigger data-testid="select-mission" className="select-trigger-solid">
                        <SelectValue placeholder="Select mission to monitor" />
                      </SelectTrigger>
                      <SelectContent className="select-content-solid">
                        {[...activeMissions, ...pausedMissions].map((mission) => (
                          <SelectItem key={mission.id} value={mission.id}>
                            {mission.name} - {mission.status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Select value={mapView} onValueChange={(value: any) => setMapView(value)}>
                    <SelectTrigger className="w-32 select-trigger-solid" data-testid="select-map-view">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="select-content-solid">
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Current Mission Details */}
                {currentMission ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">{currentMission.name}</h3>
                        <p className="text-muted-foreground">
                          {currentMission.type.replace('-', ' ')} • {currentMission.area.name}
                        </p>
                      </div>
                      <Badge 
                        className={`${getPriorityColor(currentMission.priority)} capitalize`}
                        data-testid="badge-mission-priority"
                      >
                        {currentMission.priority} Priority
                      </Badge>
                    </div>

                    {/* Mission Progress */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Mission Progress</span>
                        <div className="flex items-center gap-4 text-sm">
                          <span>{currentMission.progress}% Complete</span>
                          {currentMission.status === 'in-progress' && (
                            <span className="text-muted-foreground">
                              ~{getEstimatedCompletion(currentMission)} min remaining
                            </span>
                          )}
                        </div>
                      </div>
                      <Progress 
                        value={currentMission.progress} 
                        className="h-3"
                        data-testid="progress-mission"
                      />
                      <div className={`absolute top-0 left-0 w-full h-1 ${getStatusColor(currentMission.status)}`} />
                    </div>

                    {/* Drone Information */}
                    {assignedDrone && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm text-muted-foreground">Assigned Drone</p>
                          <p className="font-semibold">{assignedDrone.name}</p>
                          <p className="text-xs text-muted-foreground">{assignedDrone.model}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Battery Level</p>
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            <span className="font-semibold">{assignedDrone.batteryLevel}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current Location</p>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="text-xs font-mono">
                              {assignedDrone.location.lat.toFixed(4)}, {assignedDrone.location.lng.toFixed(4)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Flight Time</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-semibold">
                              {currentMission.startedAt 
                                ? Math.round((Date.now() - new Date(currentMission.startedAt).getTime()) / (1000 * 60))
                                : 0
                              }min
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Flight Path Visualization */}
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Route className="h-5 w-5" />
                        Flight Path Visualization
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Pattern</span>
                            <p className="font-semibold capitalize">{currentMission.pattern}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Altitude</span>
                            <p className="font-semibold">{currentMission.parameters.altitude}m</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Speed</span>
                            <p className="font-semibold">{currentMission.parameters.speed} m/s</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Waypoints</span>
                            <p className="font-semibold">{currentMission.flightPath.length}</p>
                          </div>
                        </div>

                        {/* Simulated Map View */}
                        <div className="h-64 bg-white dark:bg-gray-900 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">
                              Interactive map showing real-time flight path
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {mapView === 'detailed' ? 'Detailed view' : 'Overview'} • {currentMission.flightPath.length} waypoints
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mission Control Buttons */}
                    <div className="flex gap-3">
                      {currentMission.status === 'in-progress' && (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => missionControlMutation.mutate({ 
                              missionId: currentMission.id, 
                              action: 'pause' 
                            })}
                            disabled={missionControlMutation.isPending}
                            data-testid="button-pause-mission"
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Mission
                          </Button>
                          
                          <Button
                            variant="destructive"
                            onClick={() => missionControlMutation.mutate({ 
                              missionId: currentMission.id, 
                              action: 'abort' 
                            })}
                            disabled={missionControlMutation.isPending}
                            data-testid="button-abort-mission"
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Abort Mission
                          </Button>
                        </>
                      )}

                      {currentMission.status === 'paused' && (
                        <>
                          <Button
                            onClick={() => missionControlMutation.mutate({ 
                              missionId: currentMission.id, 
                              action: 'resume' 
                            })}
                            disabled={missionControlMutation.isPending}
                            data-testid="button-resume-mission"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Resume Mission
                          </Button>
                          
                          <Button
                            variant="destructive"
                            onClick={() => missionControlMutation.mutate({ 
                              missionId: currentMission.id, 
                              action: 'abort' 
                            })}
                            disabled={missionControlMutation.isPending}
                            data-testid="button-abort-paused-mission"
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Abort Mission
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Mission Statistics */}
                    {currentMission.stats && (
                      <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{currentMission.stats.distanceCovered}</p>
                          <p className="text-sm text-muted-foreground">km covered</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{currentMission.stats.areasCovered}</p>
                          <p className="text-sm text-muted-foreground">km² surveyed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{currentMission.stats.dataPointsCollected}</p>
                          <p className="text-sm text-muted-foreground">data points</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No active missions to monitor
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Create a new mission to start monitoring drone operations
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mission Queue & Alerts */}
        <div className="space-y-6">
          <Card data-testid="mission-queue-card">
            <CardHeader className="card-header">
              <CardTitle className="card-title flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Mission Queue
              </CardTitle>
              <CardDescription className="card-description">Active and pending missions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...activeMissions, ...pausedMissions, ...completedMissions.slice(0, 2)].length === 0 ? (
                  <p className="text-sm text-muted-foreground">No missions</p>
                ) : (
                  [...activeMissions, ...pausedMissions, ...completedMissions.slice(0, 2)].map((mission) => (
                    <div 
                      key={mission.id} 
                      className="p-3 border rounded-lg space-y-2 cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedMission(mission.id)}
                      data-testid={`mission-queue-item-${mission.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{mission.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(mission.status)}`} />
                          <Badge 
                            className={`text-xs text-white ${
                              mission.status === 'in-progress' ? 'bg-blue-500 hover:bg-blue-600' :
                              mission.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                              mission.status === 'paused' ? 'bg-yellow-500 hover:bg-yellow-600' :
                              'bg-gray-500 hover:bg-gray-600'
                            }`}
                          >
                            {mission.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {mission.type.replace('-', ' ')} • {mission.estimatedDuration}min • {mission.priority} priority
                      </p>
                      {mission.progress > 0 && (
                        <Progress value={mission.progress} className="h-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card data-testid="system-alerts-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Low battery alerts */}
                {drones.filter(d => d.batteryLevel < 25 && d.status === 'in-mission').map(drone => (
                  <div key={`battery-${drone.id}`} className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Low Battery Warning</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {drone.name} battery at {drone.batteryLevel}%
                    </p>
                  </div>
                ))}

                {/* High priority missions */}
                {missions.filter(m => m.priority === 'emergency' && m.status === 'planned').map(mission => (
                  <div key={`priority-${mission.id}`} className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Emergency Mission</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mission.name} requires immediate attention
                    </p>
                  </div>
                ))}

                {drones.filter(d => d.batteryLevel < 25 && d.status === 'in-mission').length === 0 &&
                 missions.filter(m => m.priority === 'emergency' && m.status === 'planned').length === 0 && (
                  <p className="text-sm text-muted-foreground">No active alerts</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Collection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Data Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentMission && currentMission.parameters.sensors.map((sensor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{sensor}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-muted-foreground">Active</span>
                    </div>
                  </div>
                ))}
                {!currentMission && (
                  <p className="text-sm text-muted-foreground">
                    Select a mission to view sensor status
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}