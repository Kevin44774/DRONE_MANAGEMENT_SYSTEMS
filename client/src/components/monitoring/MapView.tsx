import React from 'react';
import { Mission, Drone } from '../../types';

interface MapViewProps {
  mission: Mission;
  drones: Drone[];
}

const MapView: React.FC<MapViewProps> = ({ mission, drones }) => {
  // Find the drone for this mission
  const missionDrone = drones.find(d => d.id === mission.droneId);
  
  // Calculate bounds for the map view
  const bounds = mission.area.bounds;
  const minLat = Math.min(...bounds.map(p => p.lat));
  const maxLat = Math.max(...bounds.map(p => p.lat));
  const minLng = Math.min(...bounds.map(p => p.lng));
  const maxLng = Math.max(...bounds.map(p => p.lng));
  
  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;
  
  // Calculate current drone position based on mission progress
  const progressIndex = Math.floor((mission.progress / 100) * mission.flightPath.length);
  const currentWaypoint = mission.flightPath[Math.min(progressIndex, mission.flightPath.length - 1)];

  return (
    <div className="h-96 bg-gray-900 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
      
      {/* Map Content */}
      <div className="absolute inset-0 p-4">
        <div className="text-white text-sm mb-4">
          <h4 className="font-medium mb-2">{mission.area.name}</h4>
          <p className="text-gray-400 text-xs">
            Center: {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
          </p>
        </div>

        {/* Flight Path Visualization */}
        <div className="bg-gray-800/80 rounded-lg p-4 mb-4">
          <h5 className="text-white text-sm font-medium mb-2">Flight Path</h5>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block">Pattern</span>
              <span className="text-white capitalize">{mission.pattern}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Waypoints</span>
              <span className="text-white">{mission.flightPath.length}</span>
            </div>
            <div>
              <span className="text-gray-400 block">Current Position</span>
              <span className="text-white">
                {currentWaypoint.lat.toFixed(4)}, {currentWaypoint.lng.toFixed(4)}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block">Altitude</span>
              <span className="text-white">{currentWaypoint.altitude}m</span>
            </div>
          </div>
        </div>

        {/* Drone Status */}
        {missionDrone && (
          <div className="bg-gray-800/80 rounded-lg p-4">
            <h5 className="text-white text-sm font-medium mb-2">Drone Status</h5>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block">Drone</span>
                <span className="text-white">{missionDrone.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Battery</span>
                <span className={`font-medium ${
                  missionDrone.batteryLevel > 60 ? 'text-green-400' :
                  missionDrone.batteryLevel > 30 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {missionDrone.batteryLevel}%
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Speed</span>
                <span className="text-white">{mission.parameters.speed} m/s</span>
              </div>
              <div>
                <span className="text-gray-400 block">ETA</span>
                <span className="text-white">
                  {Math.max(0, Math.round(mission.estimatedDuration * (1 - mission.progress / 100)))}m
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Visual indicator of drone position */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg">
            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75" />
          </div>
          <div className="text-xs text-white mt-1 text-center">Drone</div>
        </div>
      </div>
    </div>
  );
};

export default MapView;