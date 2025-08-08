import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Plane, Settings, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/frontendQueryClient';
import type { Drone, Mission, InsertMission } from '@shared/schema';

// Mission planning form schema
const missionPlanningSchema = z.object({
  name: z.string().min(1, 'Mission name is required'),
  type: z.enum(['facility-inspection', 'security-patrol', 'site-mapping', 'perimeter-survey']),
  priority: z.enum(['low', 'medium', 'high', 'emergency']).default('medium'),
  droneId: z.string().optional(),
  areaName: z.string().min(1, 'Area name is required'),
  areaDescription: z.string().optional(),
  pattern: z.enum(['crosshatch', 'perimeter', 'grid', 'spiral', 'custom']),
  altitude: z.number().min(10).max(400),
  speed: z.number().min(1).max(15),
  overlapPercentage: z.number().min(0).max(100),
  captureFrequency: z.number().min(0.1).max(10),
  sensors: z.array(z.string()).min(1, 'At least one sensor must be selected'),
  estimatedDuration: z.number().min(5),
  scheduledAt: z.string().optional(),
});

type MissionPlanningFormData = z.infer<typeof missionPlanningSchema>;

export default function MissionPlanning() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedArea, setSelectedArea] = useState<{lat: number, lng: number}[]>([]);
  const [flightPath, setFlightPath] = useState<{lat: number, lng: number, altitude: number}[]>([]);

  const { data: drones = [], isLoading: dronesLoading } = useQuery<Drone[]>({
    queryKey: ['/api/drones'],
  });

  const { data: missions = [], isLoading: missionsLoading } = useQuery<Mission[]>({
    queryKey: ['/api/missions'],
  });

  const form = useForm<MissionPlanningFormData>({
    resolver: zodResolver(missionPlanningSchema),
    defaultValues: {
      name: '',
      type: 'facility-inspection',
      priority: 'medium',
      areaName: '',
      areaDescription: '',
      pattern: 'crosshatch',
      altitude: 75,
      speed: 8,
      overlapPercentage: 70,
      captureFrequency: 2,
      sensors: [],
      estimatedDuration: 30,
      scheduledAt: '',
    },
  });

  const createMissionMutation = useMutation({
    mutationFn: async (data: MissionPlanningFormData) => {
      // Generate flight path based on pattern and area
      const generatedFlightPath = generateFlightPath(selectedArea, data.pattern, data.altitude);
      
      const missionData: InsertMission = {
        name: data.name,
        type: data.type,
        priority: data.priority,
        droneId: data.droneId || null,
        area: {
          name: data.areaName,
          bounds: selectedArea,
        },
        flightPath: generatedFlightPath,
        pattern: data.pattern,
        parameters: {
          altitude: data.altitude,
          speed: data.speed,
          overlapPercentage: data.overlapPercentage,
          captureFrequency: data.captureFrequency,
          sensors: data.sensors,
        },
        estimatedDuration: data.estimatedDuration,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      };

      return apiRequest('/api/missions', {
        method: 'POST',
        body: JSON.stringify(missionData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/missions'] });
      toast({
        title: 'Mission Created',
        description: 'Survey mission has been successfully planned and saved.',
      });
      form.reset();
      setSelectedArea([]);
      setFlightPath([]);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create mission. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const availableDrones = drones.filter(drone => drone.status === 'available');
  const availableSensors = [
    'RGB Camera', 'Thermal Imaging', 'LiDAR', 'Multispectral', 
    'Night Vision', '360° Camera', '3D Mapping', 'Obstacle Avoidance'
  ];

  // Generate flight path based on pattern
  function generateFlightPath(bounds: {lat: number, lng: number}[], pattern: string, altitude: number) {
    if (bounds.length < 3) return [];
    
    switch (pattern) {
      case 'perimeter':
        return bounds.map(point => ({ ...point, altitude }));
      case 'crosshatch':
        return generateCrosshatchPath(bounds, altitude);
      case 'grid':
        return generateGridPath(bounds, altitude);
      case 'spiral':
        return generateSpiralPath(bounds, altitude);
      default:
        return bounds.map(point => ({ ...point, altitude }));
    }
  }

  function generateCrosshatchPath(bounds: {lat: number, lng: number}[], altitude: number) {
    // Simplified crosshatch pattern generation
    const path = [];
    const steps = 5;
    const latStep = (Math.max(...bounds.map(b => b.lat)) - Math.min(...bounds.map(b => b.lat))) / steps;
    const lngStep = (Math.max(...bounds.map(b => b.lng)) - Math.min(...bounds.map(b => b.lng))) / steps;
    
    for (let i = 0; i <= steps; i++) {
      const lat = Math.min(...bounds.map(b => b.lat)) + (latStep * i);
      path.push(
        { lat, lng: Math.min(...bounds.map(b => b.lng)), altitude },
        { lat, lng: Math.max(...bounds.map(b => b.lng)), altitude }
      );
    }
    return path;
  }

  function generateGridPath(bounds: {lat: number, lng: number}[], altitude: number) {
    // Simplified grid pattern
    return bounds.map(point => ({ ...point, altitude }));
  }

  function generateSpiralPath(bounds: {lat: number, lng: number}[], altitude: number) {
    // Simplified spiral pattern  
    return bounds.map(point => ({ ...point, altitude }));
  }

  function handleAreaClick() {
    // Simulate area selection - in real implementation, this would be a map interface
    const demoArea = [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7759, lng: -122.4184 },
      { lat: 37.7769, lng: -122.4204 },
      { lat: 37.7759, lng: -122.4214 }
    ];
    setSelectedArea(demoArea);
    const pattern = form.getValues('pattern');
    const altitude = form.getValues('altitude');
    setFlightPath(generateFlightPath(demoArea, pattern, altitude));
  }

  if (dronesLoading || missionsLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mission Planning & Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Plan autonomous drone surveys with precision flight paths and data collection parameters
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {availableDrones.length} drones available
        </Badge>
      </div>

      {/* Planning Overview Stats */}
      <div>
        <h3 className="text-xl font-semibold text-high-contrast mb-6">Planning Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-total-missions">
            <Calendar className="h-10 w-10 text-blue-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">Total Missions</h4>
            <span className="text-3xl font-bold text-high-contrast">{missions.length}</span>
          </div>

          <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-pending-missions">
            <AlertCircle className="h-10 w-10 text-orange-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">Pending</h4>
            <span className="text-3xl font-bold text-high-contrast">{missions.filter(m => m.status === 'planned').length}</span>
          </div>

          <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-available-drones">
            <Plane className="h-10 w-10 text-green-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">Available Drones</h4>
            <span className="text-3xl font-bold text-high-contrast">{availableDrones.length}</span>
          </div>

          <div className="card-premium rounded-xl p-6 text-center" data-testid="stat-sensors-available">
            <Settings className="h-10 w-10 text-purple-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-medium-contrast mb-2">Sensor Types</h4>
            <span className="text-3xl font-bold text-high-contrast">{availableSensors.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" style={{ marginTop: '60px' }}>
        {/* Mission Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="mission-config-card" className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/20 border-2 border-blue-200 dark:border-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="card-header bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-blue-200 dark:border-blue-800">
              <CardTitle className="card-title flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <Settings className="h-5 w-5 text-blue-500" />
                Mission Configuration
              </CardTitle>
              <CardDescription className="card-description">Define survey parameters and flight specifications</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(data => createMissionMutation.mutate(data))} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Mission Name</Label>
                    <Input
                      id="name"
                      data-testid="input-mission-name"
                      {...form.register('name')}
                      placeholder="e.g. Weekly Facility Inspection"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="type">Mission Type</Label>
                    <Select
                      value={form.watch('type')}
                      onValueChange={(value) => form.setValue('type', value as any)}
                    >
                      <SelectTrigger data-testid="select-mission-type" className="select-trigger-solid">
                        <SelectValue placeholder="Select mission type" />
                      </SelectTrigger>
                      <SelectContent className="select-content-solid">
                        <SelectItem value="facility-inspection">Facility Inspection</SelectItem>
                        <SelectItem value="security-patrol">Security Patrol</SelectItem>
                        <SelectItem value="site-mapping">Site Mapping</SelectItem>
                        <SelectItem value="perimeter-survey">Perimeter Survey</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Priority and Drone Assignment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select
                      value={form.watch('priority')}
                      onValueChange={(value) => form.setValue('priority', value as any)}
                    >
                      <SelectTrigger data-testid="select-priority" className="select-trigger-solid">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent className="select-content-solid">
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="droneId">Assign Drone (Optional)</Label>
                    <Select
                      value={form.watch('droneId') || ''}
                      onValueChange={(value) => form.setValue('droneId', value || undefined)}
                    >
                      <SelectTrigger data-testid="select-drone" className="select-trigger-solid">
                        <SelectValue placeholder="Auto-assign or select drone" />
                      </SelectTrigger>
                      <SelectContent className="select-content-solid">
                        <SelectItem value="auto">Auto-assign best available</SelectItem>
                        {availableDrones.map((drone) => (
                          <SelectItem key={drone.id} value={drone.id}>
                            {drone.name} - {drone.batteryLevel}% battery
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Survey Area Definition */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <Label className="text-base font-semibold">Survey Area Definition</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="areaName">Area Name</Label>
                      <Input
                        id="areaName"
                        data-testid="input-area-name"
                        {...form.register('areaName')}
                        placeholder="e.g. North Wing Building Complex"
                      />
                      {form.formState.errors.areaName && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.areaName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="pattern">Flight Pattern</Label>
                      <Select
                        value={form.watch('pattern')}
                        onValueChange={(value) => {
                          form.setValue('pattern', value as any);
                          if (selectedArea.length > 0) {
                            setFlightPath(generateFlightPath(selectedArea, value, form.getValues('altitude')));
                          }
                        }}
                      >
                        <SelectTrigger data-testid="select-pattern" className="select-trigger-solid">
                          <SelectValue placeholder="Select flight pattern" />
                        </SelectTrigger>
                        <SelectContent className="select-content-solid">
                          <SelectItem value="crosshatch">Crosshatch (Optimal Coverage)</SelectItem>
                          <SelectItem value="perimeter">Perimeter (Border Inspection)</SelectItem>
                          <SelectItem value="grid">Grid (Systematic Survey)</SelectItem>
                          <SelectItem value="spiral">Spiral (Efficient Path)</SelectItem>
                          <SelectItem value="custom">Custom Path</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="areaDescription">Area Description (Optional)</Label>
                    <Textarea
                      id="areaDescription"
                      data-testid="textarea-area-description"
                      {...form.register('areaDescription')}
                      placeholder="Additional details about the survey area..."
                      className="resize-none h-20"
                    />
                  </div>

                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAreaClick}
                    data-testid="button-select-area"
                    className="w-full"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedArea.length > 0 ? 'Area Selected - Click to Redefine' : 'Click to Define Survey Area'}
                  </Button>

                  {selectedArea.length > 0 && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Survey area defined with {selectedArea.length} boundary points. 
                        Flight path generated with {flightPath.length} waypoints.
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Flight Parameters */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5" />
                    <Label className="text-base font-semibold">Flight Parameters</Label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="altitude">Altitude (m)</Label>
                      <Input
                        id="altitude"
                        type="number"
                        min="10"
                        max="400"
                        data-testid="input-altitude"
                        {...form.register('altitude', { valueAsNumber: true })}
                      />
                      {form.formState.errors.altitude && (
                        <p className="text-xs text-destructive mt-1">{form.formState.errors.altitude.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="speed">Speed (m/s)</Label>
                      <Input
                        id="speed"
                        type="number"
                        min="1"
                        max="15"
                        step="0.1"
                        data-testid="input-speed"
                        {...form.register('speed', { valueAsNumber: true })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="overlapPercentage">Overlap (%)</Label>
                      <Input
                        id="overlapPercentage"
                        type="number"
                        min="0"
                        max="100"
                        data-testid="input-overlap"
                        {...form.register('overlapPercentage', { valueAsNumber: true })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="captureFrequency">Capture (sec)</Label>
                      <Input
                        id="captureFrequency"
                        type="number"
                        min="0.1"
                        max="10"
                        step="0.1"
                        data-testid="input-capture-freq"
                        {...form.register('captureFrequency', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Sensor Configuration */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Sensor Configuration</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableSensors.map((sensor) => (
                      <label key={sensor} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          data-testid={`checkbox-sensor-${sensor.toLowerCase().replace(/\s+/g, '-')}`}
                          value={sensor}
                          checked={form.watch('sensors')?.includes(sensor) || false}
                          onChange={(e) => {
                            const currentSensors = form.getValues('sensors') || [];
                            if (e.target.checked) {
                              form.setValue('sensors', [...currentSensors, sensor]);
                            } else {
                              form.setValue('sensors', currentSensors.filter(s => s !== sensor));
                            }
                          }}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{sensor}</span>
                      </label>
                    ))}
                  </div>
                  {form.formState.errors.sensors && (
                    <p className="text-sm text-destructive">{form.formState.errors.sensors.message}</p>
                  )}
                </div>

                <Separator />

                {/* Schedule and Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      min="5"
                      data-testid="input-duration"
                      {...form.register('estimatedDuration', { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="scheduledAt">Schedule Mission (Optional)</Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      data-testid="input-scheduled-time"
                      {...form.register('scheduledAt')}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={createMissionMutation.isPending || selectedArea.length === 0}
                    data-testid="button-create-mission"
                    className="w-full"
                  >
                    {createMissionMutation.isPending ? 'Creating Mission...' : 'Create Survey Mission'}
                  </Button>
                  
                  {selectedArea.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Please define a survey area before creating the mission
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Mission Queue & Status */}
        <div className="space-y-6">
          <Card data-testid="mission-queue-card" className="bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-green-950/20 border-2 border-green-200 dark:border-green-800 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="card-header bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b border-green-200 dark:border-green-800">
              <CardTitle className="card-title flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                <Calendar className="h-5 w-5 text-green-500" />
                Mission Queue
              </CardTitle>
              <CardDescription className="card-description">Upcoming and active missions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {missions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No missions planned</p>
                ) : (
                  missions.slice(0, 5).map((mission) => (
                    <div key={mission.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{mission.name}</h4>
                        <Badge 
                          className={`text-xs text-white ${
                            mission.status === 'in-progress' ? 'bg-blue-500 hover:bg-blue-600' :
                            mission.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                            mission.status === 'paused' ? 'bg-yellow-500 hover:bg-yellow-600' :
                            mission.status === 'aborted' ? 'bg-red-500 hover:bg-red-600' :
                            'bg-gray-500 hover:bg-gray-600'
                          }`}
                        >
                          {mission.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {mission.type} • {mission.estimatedDuration}min • {mission.priority} priority
                      </p>
                      {mission.progress > 0 && (
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full" 
                            style={{ width: `${mission.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="card-header">
              <CardTitle className="card-title">Available Drones</CardTitle>
              <CardDescription className="card-description">Fleet status for mission assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableDrones.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No drones available</p>
                ) : (
                  availableDrones.map((drone) => (
                    <div key={drone.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">{drone.name}</p>
                        <p className="text-xs text-muted-foreground">{drone.model}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{drone.batteryLevel}%</p>
                        <p className="text-xs text-muted-foreground">{drone.maxFlightTime}min max</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}