import { drones, missions, type Drone, type Mission, type InsertDrone, type InsertMission, type Organization } from "@shared/schema";

export interface IStorage {
  // Drone operations
  getDrones(): Promise<Drone[]>;
  getDrone(id: string): Promise<Drone | undefined>;
  createDrone(drone: InsertDrone): Promise<Drone>;
  updateDrone(id: string, updates: Partial<InsertDrone>): Promise<Drone | undefined>;
  deleteDrone(id: string): Promise<boolean>;

  // Mission operations
  getMissions(): Promise<Mission[]>;
  getMission(id: string): Promise<Mission | undefined>;
  createMission(mission: InsertMission): Promise<Mission>;
  updateMission(id: string, updates: Partial<InsertMission>): Promise<Mission | undefined>;
  deleteMission(id: string): Promise<boolean>;

  // Organization stats
  getOrganizationStats(): Promise<Organization>;
}

export class MemStorage implements IStorage {
  private drones: Map<string, Drone>;
  private missions: Map<string, Mission>;

  constructor() {
    this.drones = new Map();
    this.missions = new Map();
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize mock drones
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

    mockDrones.forEach(drone => this.drones.set(drone.id, drone));

    // Initialize mock missions
    const mockMissions: Mission[] = [
      {
        id: 'mission-001',
        name: 'Weekly Security Patrol - North Wing',
        type: 'security-patrol',
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
          captureFrequency: 2,
          sensors: ['RGB Camera', 'Thermal']
        },
        priority: 'medium',
        progress: 65,
        scheduledAt: null,
        estimatedDuration: 25,
        createdAt: new Date('2024-01-28T10:00:00Z'),
        startedAt: new Date('2024-01-28T10:15:00Z'),
        actualDuration: null,
        completedAt: null,
        stats: {
          distanceCovered: 2.1,
          areasCovered: 0.8,
          dataPointsCollected: 156
        }
      },
      {
        id: 'mission-002',
        name: 'Infrastructure Inspection - Main Building',
        type: 'facility-inspection',
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
          captureFrequency: 1,
          sensors: ['RGB Camera', 'Thermal', 'LiDAR']
        },
        priority: 'high',
        scheduledAt: null,
        progress: 100,
        estimatedDuration: 35,
        actualDuration: 32,
        createdAt: new Date('2024-01-27T14:00:00Z'),
        startedAt: new Date('2024-01-27T14:30:00Z'),
        completedAt: new Date('2024-01-27T15:02:00Z'),
        stats: {
          distanceCovered: 4.2,
          areasCovered: 1.5,
          dataPointsCollected: 284
        }
      }
    ];

    mockMissions.forEach(mission => this.missions.set(mission.id, mission));
  }

  // Drone operations
  async getDrones(): Promise<Drone[]> {
    return Array.from(this.drones.values());
  }

  async getDrone(id: string): Promise<Drone | undefined> {
    return this.drones.get(id);
  }

  async createDrone(droneData: InsertDrone): Promise<Drone> {
    const id = `drone-${Date.now()}`;
    const drone: Drone = { 
      id,
      name: droneData.name,
      model: droneData.model,
      serialNumber: droneData.serialNumber,
      status: droneData.status || 'available',
      batteryLevel: droneData.batteryLevel || 0,
      location: droneData.location,
      flightHours: droneData.flightHours || 0,
      lastMaintenance: droneData.lastMaintenance,
      maxFlightTime: droneData.maxFlightTime,
      sensors: [...droneData.sensors]
    };
    this.drones.set(id, drone);
    return drone;
  }

  async updateDrone(id: string, updates: Partial<InsertDrone>): Promise<Drone | undefined> {
    const drone = this.drones.get(id);
    if (!drone) return undefined;
    
    const updatedDrone: Drone = { 
      ...drone, 
      ...updates,
      sensors: updates.sensors ? [...updates.sensors] : drone.sensors
    };
    this.drones.set(id, updatedDrone);
    return updatedDrone;
  }

  async deleteDrone(id: string): Promise<boolean> {
    return this.drones.delete(id);
  }

  // Mission operations
  async getMissions(): Promise<Mission[]> {
    return Array.from(this.missions.values());
  }

  async getMission(id: string): Promise<Mission | undefined> {
    return this.missions.get(id);
  }

  async createMission(missionData: InsertMission): Promise<Mission> {
    const id = `mission-${Date.now()}`;
    const mission: Mission = { 
      id,
      name: missionData.name,
      type: missionData.type,
      status: missionData.status || 'planned',
      droneId: missionData.droneId || null,
      area: { ...missionData.area, bounds: [...missionData.area.bounds] },
      flightPath: [...missionData.flightPath],
      pattern: missionData.pattern,
      parameters: missionData.parameters,
      progress: missionData.progress || 0,
      estimatedDuration: missionData.estimatedDuration,
      actualDuration: missionData.actualDuration || null,
      createdAt: new Date(),
      startedAt: missionData.startedAt || null,
      completedAt: missionData.completedAt || null,
      stats: missionData.stats || null
    };
    this.missions.set(id, mission);
    return mission;
  }

  async updateMission(id: string, updates: Partial<InsertMission>): Promise<Mission | undefined> {
    const mission = this.missions.get(id);
    if (!mission) return undefined;
    
    const updatedMission: Mission = { 
      ...mission, 
      ...updates,
      area: updates.area ? { ...updates.area, bounds: [...updates.area.bounds] } : mission.area,
      flightPath: updates.flightPath ? [...updates.flightPath] : mission.flightPath,
      parameters: updates.parameters ? { 
        ...updates.parameters, 
        sensors: [...updates.parameters.sensors] 
      } : mission.parameters
    };
    this.missions.set(id, updatedMission);
    return updatedMission;
  }

  async deleteMission(id: string): Promise<boolean> {
    return this.missions.delete(id);
  }

  // Organization stats
  async getOrganizationStats(): Promise<Organization> {
    const allMissions = Array.from(this.missions.values());
    const allDrones = Array.from(this.drones.values());
    
    return {
      totalSurveys: allMissions.length,
      totalFlightHours: allDrones.reduce((sum, drone) => sum + drone.flightHours, 0),
      activeDrones: allDrones.filter(drone => drone.status !== 'maintenance').length,
      completedMissions: allMissions.filter(mission => mission.status === 'completed').length
    };
  }
}

export const storage = new MemStorage();
