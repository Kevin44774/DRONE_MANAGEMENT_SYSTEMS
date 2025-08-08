import React, { useState } from 'react';
import { useDrone } from '../../contexts/DroneContext';
import MissionHistory from './MissionHistory';
import AnalyticsCharts from './AnalyticsCharts';
import StatsCards from './StatsCards';
import { FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const ReportingDashboard: React.FC = () => {
  const { missions, organization } = useDrone();
  const [activeTab, setActiveTab] = useState('overview');

  const completedMissions = missions.filter(m => m.status === 'completed');
  const totalDistance = completedMissions.reduce((sum, mission) => 
    sum + (mission.stats?.distanceCovered || 0), 0);
  const totalDataPoints = completedMissions.reduce((sum, mission) => 
    sum + (mission.stats?.dataPointsCollected || 0), 0);
  const avgMissionDuration = completedMissions.length > 0 
    ? completedMissions.reduce((sum, mission) => sum + (mission.actualDuration || mission.estimatedDuration), 0) / completedMissions.length
    : 0;

  const stats = [
    {
      title: 'Total Surveys',
      value: organization.totalSurveys.toString(),
      icon: FileText,
      color: 'text-blue-400',
      change: '+12% from last month'
    },
    {
      title: 'Flight Hours',
      value: `${organization.totalFlightHours.toFixed(1)}h`,
      icon: Clock,
      color: 'text-green-400',
      change: '+8% from last month'
    },
    {
      title: 'Completed Missions',
      value: completedMissions.length.toString(),
      icon: CheckCircle,
      color: 'text-purple-400',
      change: '+15% from last month'
    },
    {
      title: 'Data Points Collected',
      value: totalDataPoints.toLocaleString(),
      icon: TrendingUp,
      color: 'text-orange-400',
      change: '+22% from last month'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'missions', label: 'Mission History' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Reports & Analytics</h2>
        <div className="flex bg-gray-800 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <StatsCards stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {missions.slice(0, 5).map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                    <div>
                      <h4 className="text-white text-sm font-medium">{mission.name}</h4>
                      <p className="text-gray-400 text-xs">{mission.area.name}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        mission.status === 'completed' ? 'bg-green-100 text-green-800' :
                        mission.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        mission.status === 'aborted' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {mission.status}
                      </span>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(mission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Mission Types</h3>
              <div className="space-y-3">
                {['inspection', 'security', 'mapping'].map((type) => {
                  const count = missions.filter(m => m.type === type).length;
                  const percentage = missions.length > 0 ? (count / missions.length) * 100 : 0;
                  return (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300 capitalize">{type}</span>
                        <span className="text-white">{count} missions</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            type === 'inspection' ? 'bg-blue-500' :
                            type === 'security' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'missions' && <MissionHistory missions={missions} />}
      
      {activeTab === 'analytics' && (
        <div className="pt-8">
          <AnalyticsCharts missions={completedMissions} />
        </div>
      )}
    </div>
  );
};

export default ReportingDashboard;