import React from 'react';
import { useDrone } from '../../contexts/DroneContext';
import DroneCard from './DroneCard';
import StatsOverview from './StatsOverview';
import { Battery, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const FleetDashboard: React.FC = () => {
  const { drones, organization } = useDrone();

  const statusCounts = drones.reduce((acc, drone) => {
    acc[drone.status] = (acc[drone.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageBattery = drones.reduce((sum, drone) => sum + drone.batteryLevel, 0) / drones.length;

  const stats = [
    {
      title: 'Total Drones',
      value: organization.activeDrones.toString(),
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Available',
      value: (statusCounts.available || 0).toString(),
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Missions',
      value: (statusCounts['in-mission'] || 0).toString(),
      icon: Activity,
      color: 'text-orange-400',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Charging',
      value: (statusCounts.charging || 0).toString(),
      icon: Battery,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Avg Battery',
      value: `${Math.round(averageBattery)}%`,
      icon: Battery,
      color: 'text-purple-400',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Flight Hours',
      value: `${organization.totalFlightHours}`,
      icon: Clock,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Fleet Dashboard</h2>
        <div className="flex gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {statusCounts.available || 0} Available
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <Activity className="h-3 w-3 mr-1" />
            {statusCounts['in-mission'] || 0} Active
          </span>
          {statusCounts.maintenance && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {statusCounts.maintenance} Maintenance
            </span>
          )}
        </div>
      </div>

      <StatsOverview stats={stats} />

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Fleet Management</h3>
          <p className="text-sm text-gray-400">Monitor and manage your drone fleet inventory</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {drones.map((drone) => (
            <DroneCard key={drone.id} drone={drone} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FleetDashboard;