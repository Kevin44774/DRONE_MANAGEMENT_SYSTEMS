import React from 'react';
import { Drone } from '../../types';
import { Battery, MapPin, Clock, Wrench, Activity, AlertTriangle } from 'lucide-react';

interface DroneCardProps {
  drone: Drone;
}

const DroneCard: React.FC<DroneCardProps> = ({ drone }) => {
  const getStatusColor = (status: Drone['status']) => {
    switch (status) {
      case 'available': return 'text-green-400 bg-green-100';
      case 'in-mission': return 'text-orange-400 bg-orange-100';
      case 'maintenance': return 'text-red-400 bg-red-100';
      case 'charging': return 'text-yellow-400 bg-yellow-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Drone['status']) => {
    switch (status) {
      case 'available': return Activity;
      case 'in-mission': return MapPin;
      case 'maintenance': return Wrench;
      case 'charging': return Battery;
      default: return AlertTriangle;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-green-500';
    if (level > 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const StatusIcon = getStatusIcon(drone.status);

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-lg">{drone.name}</h3>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(drone.status)}`}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {drone.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Model</span>
          <span className="text-white font-medium">{drone.model}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1">
            <Battery className="h-3 w-3" />
            Battery
          </span>
          <span className={`font-medium ${getBatteryColor(drone.batteryLevel)}`}>
            {drone.batteryLevel}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Flight Hours
          </span>
          <span className="text-white font-medium">{drone.flightHours}h</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Location
          </span>
          <span className="text-white font-medium">
            {drone.location.lat.toFixed(3)}, {drone.location.lng.toFixed(3)}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-700">
          <span className="text-gray-400 text-xs">Sensors</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {drone.sensors.map((sensor) => (
              <span
                key={sensor}
                className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
              >
                {sensor}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
            View Details
          </button>
          {drone.status === 'available' && (
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Start Mission
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DroneCard;