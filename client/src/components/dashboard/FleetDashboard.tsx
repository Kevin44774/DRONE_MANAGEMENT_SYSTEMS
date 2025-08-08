import React from 'react';
import { useDrone } from '../../contexts/DroneContext';
import DroneCard from './DroneCard';
import StatsOverview from './StatsOverview';
import { Battery, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

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
      title: 'In Mission',
      value: (statusCounts['in-mission'] || 0).toString(),
      icon: Activity,
      color: 'text-orange-400',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Avg Battery',
      value: `${Math.round(averageBattery)}%`,
      icon: Battery,
      color: 'text-purple-400',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-high-contrast mb-1">Fleet Dashboard</h2>
        <p className="text-medium-contrast text-lg">Monitor and manage your drone fleet in real-time</p>
      </div>

      <div className="mb-10">
        <StatsOverview stats={stats} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-comfortable">
        {drones.map((drone) => (
          <DroneCard key={drone.id} drone={drone} />
        ))}
      </div>
    </div>
  );
};

export default FleetDashboard;