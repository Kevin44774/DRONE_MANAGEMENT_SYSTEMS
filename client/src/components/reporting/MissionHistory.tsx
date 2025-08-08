import React, { useState } from 'react';
import { Mission } from '../../types';
import { Search, Filter, Calendar, MapPin, Clock, BarChart } from 'lucide-react';

interface MissionHistoryProps {
  missions: Mission[];
}

const MissionHistory: React.FC<MissionHistoryProps> = ({ missions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredMissions = missions.filter(mission => {
    const matchesSearch = mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.area.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || mission.status === statusFilter;
    const matchesType = typeFilter === 'all' || mission.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'in-progress': return 'bg-blue-500 text-white';
      case 'aborted': return 'bg-red-500 text-white';
      case 'paused': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getTypeColor = (type: Mission['type']) => {
    switch (type) {
      case 'inspection': return 'bg-blue-100 text-blue-800';
      case 'security': return 'bg-green-100 text-green-800';
      case 'mapping': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search missions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="aborted">Aborted</option>
            <option value="paused">Paused</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="inspection">Inspection</option>
            <option value="security">Security</option>
            <option value="mapping">Mapping</option>
          </select>

          <div className="text-sm text-gray-400 flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            {filteredMissions.length} of {missions.length} missions
          </div>
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-4">
        {filteredMissions.map((mission) => (
          <div key={mission.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">{mission.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(mission.type)}`}>
                  {mission.type.charAt(0).toUpperCase() + mission.type.slice(1)}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                  {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                <div>
                  <span className="text-gray-400 block">Area</span>
                  <span className="text-white">{mission.area.name}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-300">
                <Calendar className="h-4 w-4 mr-2 text-green-400" />
                <div>
                  <span className="text-gray-400 block">Created</span>
                  <span className="text-white">{new Date(mission.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center text-gray-300">
                <Clock className="h-4 w-4 mr-2 text-yellow-400" />
                <div>
                  <span className="text-gray-400 block">Duration</span>
                  <span className="text-white">
                    {mission.actualDuration || mission.estimatedDuration}m
                  </span>
                </div>
              </div>

              <div className="flex items-center text-gray-300">
                <BarChart className="h-4 w-4 mr-2 text-purple-400" />
                <div>
                  <span className="text-gray-400 block">Progress</span>
                  <span className="text-white">{Math.round(mission.progress)}%</span>
                </div>
              </div>
            </div>

            {mission.stats && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block">Distance Covered</span>
                    <span className="text-white font-medium">{mission.stats.distanceCovered} km</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Area Covered</span>
                    <span className="text-white font-medium">{mission.stats.areasCovered} km²</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Data Points</span>
                    <span className="text-white font-medium">{mission.stats.dataPointsCollected}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMissions.length === 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
          <p className="text-gray-400 text-lg">No missions found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default MissionHistory;