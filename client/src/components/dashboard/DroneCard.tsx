import React from 'react';
import { motion } from 'framer-motion';
import { Drone } from '../../types';
import { Battery, MapPin, Clock, Wrench, Activity, AlertTriangle, Zap, Wifi, Shield } from 'lucide-react';

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
    <motion.div 
      className="card-premium hover-lift relative overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-purple-100">
          <StatusIcon className="h-8 w-8 text-purple-600" />
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-bold text-high-contrast mb-1 text-center">
        {drone.name}
      </h3>
      <p className="text-sm text-medium-contrast mb-4 text-center">{drone.model}</p>
      
      {/* Status */}
      <div className="mb-6 text-center">
        <motion.span 
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(drone.status)} shadow-lg`}
          whileHover={{ scale: 1.05 }}
        >
          <StatusIcon className="h-3 w-3 mr-1.5" />
          {drone.status.replace('-', ' ').toUpperCase()}
        </motion.span>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-medium-contrast font-medium">Battery Level</span>
          <span className={`font-bold text-sm ${getBatteryColor(drone.batteryLevel)}`}>
            {drone.batteryLevel}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-medium-contrast font-medium">Flight Hours</span>
          <span className="font-bold text-sm text-high-contrast">{drone.flightHours}h</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-medium-contrast font-medium">Sensors</span>
          <span className="font-bold text-sm text-high-contrast">{drone.sensors.length}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <motion.button 
          className="flex-1 btn-primary text-white px-4 py-2.5 rounded-lg text-sm font-bold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Details
        </motion.button>
        {drone.status === 'available' && (
          <motion.button 
            className="flex-1 btn-secondary text-white px-4 py-2.5 rounded-lg text-sm font-bold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start Mission
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default DroneCard;