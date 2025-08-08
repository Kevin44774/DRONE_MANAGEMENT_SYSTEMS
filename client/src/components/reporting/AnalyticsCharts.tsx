import React from 'react';
import { Mission } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AnalyticsChartsProps {
  missions: Mission[];
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ missions }) => {
  // Mission types data
  const typeData = ['inspection', 'security', 'mapping'].map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    count: missions.filter(m => m.type === type).length,
    color: type === 'inspection' ? '#3B82F6' : type === 'security' ? '#10B981' : '#8B5CF6'
  }));

  // Monthly missions data
  const monthlyData = React.useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return monthNames.map((month, index) => ({
      month,
      missions: Math.floor(Math.random() * 20) + 10,
      flightTime: Math.floor(Math.random() * 50) + 30
    }));
  }, []);

  // Flight duration distribution
  const durationData = React.useMemo(() => {
    const ranges = ['0-15min', '15-30min', '30-45min', '45-60min', '60min+'];
    return ranges.map(range => ({
      range,
      count: Math.floor(Math.random() * 15) + 5
    }));
  }, []);

  // Success rate data
  const successData = React.useMemo(() => {
    const total = missions.length;
    const completed = missions.filter(m => m.status === 'completed').length;
    const aborted = missions.filter(m => m.status === 'aborted').length;
    const inProgress = total - completed - aborted;

    return [
      { name: 'Completed', value: completed, color: '#10B981' },
      { name: 'In Progress', value: inProgress, color: '#F59E0B' },
      { name: 'Aborted', value: aborted, color: '#EF4444' }
    ];
  }, [missions]);

  return (
    <div className="space-y-6">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mission Types Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Mission Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Success Rate Pie Chart */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Mission Success Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={successData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {successData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Monthly Mission Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
              <YAxis tick={{ fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Line
                type="monotone"
                dataKey="missions"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                name="Missions"
              />
              <Line
                type="monotone"
                dataKey="flightTime"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
                name="Flight Hours"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Duration Distribution */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Flight Duration Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={durationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: '#9CA3AF' }} />
              <YAxis dataKey="range" type="category" tick={{ fill: '#9CA3AF' }} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Bar dataKey="count" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Average Mission Duration</h4>
          <p className="text-2xl font-bold text-white">
            {missions.length > 0 
              ? Math.round(missions.reduce((sum, m) => sum + (m.actualDuration || m.estimatedDuration), 0) / missions.length)
              : 0
            } min
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Success Rate</h4>
          <p className="text-2xl font-bold text-green-400">
            {missions.length > 0
              ? Math.round((missions.filter(m => m.status === 'completed').length / missions.length) * 100)
              : 0
            }%
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Total Distance</h4>
          <p className="text-2xl font-bold text-blue-400">
            {missions
              .filter(m => m.stats)
              .reduce((sum, m) => sum + (m.stats?.distanceCovered || 0), 0)
              .toFixed(1)} km
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Data Points Collected</h4>
          <p className="text-2xl font-bold text-purple-400">
            {missions
              .filter(m => m.stats)
              .reduce((sum, m) => sum + (m.stats?.dataPointsCollected || 0), 0)
              .toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;