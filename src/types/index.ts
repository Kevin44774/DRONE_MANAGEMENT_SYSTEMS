export interface Drone {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  status: 'available' | 'in-mission' | 'maintenance' | 'charging';
  batteryLevel: number;
  location: {
    lat: number;
    lng: number;
  };
  flightHours: number;
  lastMaintenance: string;
  maxFlightTime: number;
  sensors: string[];
}

export interface Mission {
  id: string;
  name: string;
  type: 'inspection' | 'security' | 'mapping';
  status: 'planned' | 'in-progress' | 'completed' | 'aborted' | 'paused';
  droneId: string;
  area: {
    name: string;
    bounds: Array<{ lat: number; lng: number }>;
  };
  flightPath: Array<{ lat: number; lng: number; altitude: number }>;
  pattern: 'crosshatch' | 'perimeter' | 'custom';
  parameters: {
    altitude: number;
    speed: number;
    overlapPercentage: number;
    captureFrequency: number;
  };
  progress: number;
  estimatedDuration: number;
  actualDuration?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  stats?: {
    distanceCovered: number;
    areasCovered: number;
    dataPointsCollected: number;
  };
}

export interface Organization {
  totalSurveys: number;
  totalFlightHours: number;
  activeDrones: number;
  completedMissions: number;
}