import type { Drone, Mission, InsertMission, Organization } from '@shared/schema';

// Mock data for frontend-only deployment
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
    model: 'Parrot ANAFI USA',
    serialNumber: 'PR004ANFUSA',
    status: 'maintenance',
    batteryLevel: 0,
    location: { lat: 37.7549, lng: -122.4394 },
    flightHours: 98.3,
    lastMaintenance: '2024-01-05',
    maxFlightTime: 32,
    sensors: ['RGB Camera', 'Zoom', 'Thermal']
  },
  {
    id: 'drone-005',
    name: 'Scout Echo',
    model: 'Skydio 2+',
    serialNumber: 'SK005SkyD2P',
    status: 'available',
    batteryLevel: 95,
    location: { lat: 37.7449, lng: -122.4494 },
    flightHours: 67.1,
    lastMaintenance: '2024-01-25',
    maxFlightTime: 23,
    sensors: ['RGB Camera', 'Obstacle Avoidance']
  },
  {
    id: 'drone-006',
    name: 'Patrol Zeta',
    model: 'DJI Mini 3 Pro',
    serialNumber: 'DJ006Min3Pro',
    status: 'maintenance',
    batteryLevel: 0,
    location: { lat: 37.7349, lng: -122.4594 },
    flightHours: 34.7,
    lastMaintenance: '2024-01-18',
    maxFlightTime: 34,
    sensors: ['RGB Camera', '4K Video']
  }
];

const mockMissions: Mission[] = [
  {
    id: 'mission-001',
    name: 'Weekly Security Patrol',
    type: 'security-patrol',
    status: 'in-progress',
    droneId: 'drone-002',
    area: {
      name: 'North Perimeter',
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
      captureFrequency: 2,
      sensors: ['RGB Camera', 'Thermal']
    },
    progress: 65,
    estimatedDuration: 25,
    actualDuration: null,
    priority: 'high',
    createdAt: new Date('2024-01-28T10:00:00Z'),
    scheduledAt: new Date('2024-01-28T14:00:00Z'),
    startedAt: new Date('2024-01-28T14:05:00Z'),
    completedAt: null,
    stats: {
      distanceCovered: 1.2,
      areasCovered: 0.8,
      dataPointsCollected: 245
    }
  },
  {
    id: 'mission-002',
    name: 'Facility Roof Inspection',
    type: 'facility-inspection',
    status: 'completed',
    droneId: 'drone-001',
    area: {
      name: 'Building A Roof',
      bounds: [
        { lat: 37.7749, lng: -122.4194 },
        { lat: 37.7759, lng: -122.4184 },
        { lat: 37.7769, lng: -122.4204 },
        { lat: 37.7759, lng: -122.4214 }
      ]
    },
    flightPath: [
      { lat: 37.7749, lng: -122.4194, altitude: 30 },
      { lat: 37.7759, lng: -122.4184, altitude: 30 },
      { lat: 37.7769, lng: -122.4204, altitude: 30 },
      { lat: 37.7759, lng: -122.4214, altitude: 30 }
    ],
    pattern: 'crosshatch',
    parameters: {
      altitude: 30,
      speed: 6,
      overlapPercentage: 80,
      captureFrequency: 3,
      sensors: ['RGB Camera', 'Thermal', 'LiDAR']
    },
    progress: 100,
    estimatedDuration: 18,
    actualDuration: 19,
    priority: 'medium',
    createdAt: new Date('2024-01-27T09:00:00Z'),
    scheduledAt: new Date('2024-01-27T11:00:00Z'),
    startedAt: new Date('2024-01-27T11:02:00Z'),
    completedAt: new Date('2024-01-27T11:21:00Z'),
    stats: {
      distanceCovered: 2.1,
      areasCovered: 1.5,
      dataPointsCollected: 428,
      averageSpeed: 6.2,
      batteryUsed: 35
    }
  },
  {
    id: 'mission-003',
    name: 'Site Mapping Survey',
    type: 'site-mapping',
    status: 'planned',
    droneId: 'drone-005',
    area: {
      name: 'Construction Zone C',
      bounds: [
        { lat: 37.7449, lng: -122.4494 },
        { lat: 37.7459, lng: -122.4484 },
        { lat: 37.7469, lng: -122.4504 },
        { lat: 37.7459, lng: -122.4514 }
      ]
    },
    flightPath: [
      { lat: 37.7449, lng: -122.4494, altitude: 75 },
      { lat: 37.7459, lng: -122.4484, altitude: 75 },
      { lat: 37.7469, lng: -122.4504, altitude: 75 },
      { lat: 37.7459, lng: -122.4514, altitude: 75 }
    ],
    pattern: 'grid',
    parameters: {
      altitude: 75,
      speed: 10,
      overlapPercentage: 70,
      captureFrequency: 1.5,
      sensors: ['RGB Camera', 'Obstacle Avoidance']
    },
    progress: 0,
    estimatedDuration: 35,
    actualDuration: null,
    priority: 'low',
    createdAt: new Date('2024-01-28T08:00:00Z'),
    scheduledAt: new Date('2024-01-29T09:00:00Z'),
    startedAt: null,
    completedAt: null,
    stats: null
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  private static drones = new Map(mockDrones.map(d => [d.id, { ...d }]));
  private static missions = new Map(mockMissions.map(m => [m.id, { ...m }]));

  static async getDrones(): Promise<Drone[]> {
    await delay(200);
    return Array.from(this.drones.values());
  }

  static async getDrone(id: string): Promise<Drone | undefined> {
    await delay(100);
    return this.drones.get(id);
  }

  static async updateDrone(id: string, updates: Partial<Drone>): Promise<Drone | undefined> {
    await delay(150);
    const drone = this.drones.get(id);
    if (drone) {
      const updated = { ...drone, ...updates };
      this.drones.set(id, updated);
      return updated;
    }
    return undefined;
  }

  static async getMissions(): Promise<Mission[]> {
    await delay(200);
    return Array.from(this.missions.values());
  }

  static async getMission(id: string): Promise<Mission | undefined> {
    await delay(100);
    return this.missions.get(id);
  }

  static async createMission(missionData: InsertMission): Promise<Mission> {
    await delay(300);
    const id = `mission-${Date.now()}`;
    
    const mission: Mission = {
      id,
      name: missionData.name,
      type: missionData.type,
      status: 'planned',
      droneId: missionData.droneId || null,
      area: missionData.area,
      flightPath: missionData.flightPath || [],
      pattern: missionData.pattern,
      parameters: missionData.parameters,
      progress: 0,
      estimatedDuration: missionData.estimatedDuration,
      actualDuration: null,
      priority: missionData.priority || 'medium',
      createdAt: new Date(),
      scheduledAt: missionData.scheduledAt || null,
      startedAt: null,
      completedAt: null,
      stats: null
    };
    
    this.missions.set(id, mission);
    return mission;
  }

  static async updateMission(id: string, updates: Partial<Mission>): Promise<Mission | undefined> {
    await delay(150);
    const mission = this.missions.get(id);
    if (mission) {
      const updated = { ...mission, ...updates };
      
      // Update drone status based on mission status changes
      if (updated.droneId && updates.status) {
        const drone = this.drones.get(updated.droneId);
        if (drone) {
          let newDroneStatus = drone.status;
          switch (updates.status) {
            case 'in-progress':
              newDroneStatus = 'in-mission';
              updated.startedAt = updated.startedAt || new Date();
              break;
            case 'completed':
              newDroneStatus = 'available';
              updated.completedAt = updated.completedAt || new Date();
              updated.progress = 100;
              break;
            case 'aborted':
              newDroneStatus = 'available';
              updated.completedAt = updated.completedAt || new Date();
              break;
            case 'paused':
              newDroneStatus = 'in-mission'; // Keep as in-mission when paused
              break;
          }
          this.drones.set(updated.droneId, { ...drone, status: newDroneStatus });
        }
      }
      
      this.missions.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Helper method to start a mission (demonstrate mission lifecycle)
  static async startMission(missionId: string): Promise<Mission | undefined> {
    const mission = await this.updateMission(missionId, { 
      status: 'in-progress', 
      startedAt: new Date(),
      progress: 0 
    });
    return mission;
  }

  static async getOrganizationStats(): Promise<Organization> {
    await delay(250);
    const missions = Array.from(this.missions.values());
    const drones = Array.from(this.drones.values());
    
    return {
      totalSurveys: missions.filter(m => m.status === 'completed').length,
      totalFlightHours: drones.reduce((sum, d) => sum + d.flightHours, 0),
      activeDrones: drones.filter(d => d.status === 'available').length,
      completedMissions: missions.filter(m => m.status === 'completed').length,
    };
  }
}