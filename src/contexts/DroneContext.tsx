import React, { createContext, useContext, useState, useEffect } from 'react';
import { Drone, Mission, Organization } from '../types';

interface DroneContextType {
  drones: Drone[];
  missions: Mission[];
  organization: Organization;
  addMission: (mission: Omit<Mission, 'id' | 'createdAt'>) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  updateDroneStatus: (id: string, status: Drone['status']) => void;
  deleteMission: (id: string) => void;
}

const DroneContext = createContext<DroneContextType | undefined>(undefined);

// Mock data
const mockDrones: Drone[] = [
  {
    id: 'drone-001',
    name: 'Surveyor Alpha',
    model: 'DJI Matrice 300 RTK',
    serialNumber: 'DJ001MAT300',
    status: 'available',
    batteryLevel: 85,
    location: { lat: 37.7749, lng: -122.4194 },
    flightHours: 245.5,
    lastMaintenance: '2024-01-15',
    maxFlightTime: 55,
    sensors: ['RGB Camera', 'Thermal', 'LiDAR']
  },
  {
    id: 'drone-002',
    name: 'Inspector Beta',
    model: 'DJI Phantom 4 RTK',
    serialNumber: 'DJ002PH4RTK',
    status: 'in-mission',
    batteryLevel: 72,
    location: { lat: 37.7849, lng: -122.4094 },
    flightHours: 189.2,
    lastMaintenance: '2024-01-20',
    maxFlightTime: 30,
    sensors: ['RGB Camera', 'Multispectral']
  },
  {
    id: 'drone-003',
    name: 'Guardian Gamma',
    model: 'Autel EVO Max 4T',
    serialNumber: 'AU003EVMax4T',
    status: 'charging',
    batteryLevel: 15,
    location: { lat: 37.7649, lng: -122.4294 },
    flightHours: 156.8,
    lastMaintenance: '2024-01-10',
    maxFlightTime: 42,
    sensors: ['RGB Camera', 'Thermal', 'Night Vision']
  },
  {
    id: 'drone-004',
    name: 'Mapper Delta',
    model: 'Skydio X2D',
    serialNumber: 'SK004X2D',
    status: 'available',
    batteryLevel: 95,
    location: { lat: 37.7549, lng: -122.4394 },
    flightHours: 312.1,
    lastMaintenance: '2024-01-25',
    maxFlightTime: 35,
    sensors: ['RGB Camera', 'Thermal', '3D Mapping']
  }
];

const mockMissions: Mission[] = [
  {
    id: 'mission-001',
    name: 'Weekly Security Patrol - North Wing',
    type: 'security',
    status: 'in-progress',
    droneId: 'drone-002',
    area: {
      name: 'North Wing Perimeter',
      bounds: [
        { lat: 37.7849, lng: -122.4094 },
        { lat: 37.7859, lng: -122.4084 },
        { lat: 37.7869, lng: -122.4104 },
        { lat: 37.7859, lng: -122.4114 }
      ]
    },
    flightPath: [
      { lat: 37.7849, lng: -122.4094, altitude: 50 },
      { lat: 37.7859, lng: -122.4084, altitude: 50 },
      { lat: 37.7869, lng: -122.4104, altitude: 50 },
      { lat: 37.7859, lng: -122.4114, altitude: 50 }
    ],
    pattern: 'perimeter',
    parameters: {
      altitude: 50,
      speed: 8,
      overlapPercentage: 60,
      captureFrequency: 2
    },
    progress: 65,
    estimatedDuration: 25,
    createdAt: '2024-01-28T10:00:00Z',
    startedAt: '2024-01-28T10:15:00Z',
    stats: {
      distanceCovered: 2.1,
      areasCovered: 0.8,
      dataPointsCollected: 156
    }
  },
  {
    id: 'mission-002',
    name: 'Infrastructure Inspection - Main Building',
    type: 'inspection',
    status: 'completed',
    droneId: 'drone-001',
    area: {
      name: 'Main Building Complex',
      bounds: [
        { lat: 37.7749, lng: -122.4194 },
        { lat: 37.7759, lng: -122.4184 },
        { lat: 37.7769, lng: -122.4204 },
        { lat: 37.7759, lng: -122.4214 }
      ]
    },
    flightPath: [
      { lat: 37.7749, lng: -122.4194, altitude: 75 },
      { lat: 37.7759, lng: -122.4184, altitude: 75 },
      { lat: 37.7769, lng: -122.4204, altitude: 75 },
      { lat: 37.7759, lng: -122.4214, altitude: 75 }
    ],
    pattern: 'crosshatch',
    parameters: {
      altitude: 75,
      speed: 6,
      overlapPercentage: 80,
      captureFrequency: 1
    },
    progress: 100,
    estimatedDuration: 35,
    actualDuration: 32,
    createdAt: '2024-01-27T14:00:00Z',
    startedAt: '2024-01-27T14:30:00Z',
    completedAt: '2024-01-27T15:02:00Z',
    stats: {
      distanceCovered: 4.2,
      areasCovered: 1.5,
      dataPointsCollected: 284
    }
  }
];

const mockOrganization: Organization = {
  totalSurveys: 156,
  totalFlightHours: 2847.3,
  activeDrones: 4,
  completedMissions: 142
};

export const DroneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drones, setDrones] = useState<Drone[]>(mockDrones);
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  const [organization, setOrganization] = useState<Organization>(mockOrganization);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMissions(prev => prev.map(mission => {
        if (mission.status === 'in-progress') {
          const newProgress = Math.min(mission.progress + Math.random() * 5, 100);
          return {
            ...mission,
            progress: newProgress,
            status: newProgress >= 100 ? 'completed' : 'in-progress'
          };
        }
        return mission;
      }));

      setDrones(prev => prev.map(drone => {
        if (drone.status === 'in-mission') {
          const newBattery = Math.max(drone.batteryLevel - Math.random() * 2, 10);
          return {
            ...drone,
            batteryLevel: newBattery
          };
        }
        return drone;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const addMission = (mission: Omit<Mission, 'id' | 'createdAt'>) => {
    const newMission: Mission = {
      ...mission,
      id: `mission-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setMissions(prev => [newMission, ...prev]);
  };

  const updateMission = (id: string, updates: Partial<Mission>) => {
    setMissions(prev => prev.map(mission => 
      mission.id === id ? { ...mission, ...updates } : mission
    ));
  };

  const updateDroneStatus = (id: string, status: Drone['status']) => {
    setDrones(prev => prev.map(drone => 
      drone.id === id ? { ...drone, status } : drone
    ));
  };

  const deleteMission = (id: string) => {
    setMissions(prev => prev.filter(mission => mission.id !== id));
  };

  return (
    <DroneContext.Provider value={{
      drones,
      missions,
      organization,
      addMission,
      updateMission,
      updateDroneStatus,
      deleteMission
    }}>
      {children}
    </DroneContext.Provider>
  );
};

export const useDrone = () => {
  const context = useContext(DroneContext);
  if (context === undefined) {
    throw new Error('useDrone must be used within a DroneProvider');
  }
  return context;
};