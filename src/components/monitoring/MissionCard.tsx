import React from 'react';
import { Mission } from '../../types';
import { Play, Pause, Square, MapPin, Clock, Activity } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  isSelected: boolean;
  onSelect: () => void;
  onControl: (missionId: string, action: 'pause' | 'resume' | 'abort') => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, isSelected, onSelect, onControl }) => {
  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'in-progress': return 'text-green-400 bg-green-100';
      case 'paused': return 'text-yellow-400 bg-yellow-100';
      case 'completed': return 'text-blue-400 bg-blue-100';
      case 'aborted': return 'text-red-400 bg-red-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-700 hover:border-gray-600'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-white text-sm">{mission.name}</h4>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
          {mission.status === 'in-progress' && <Activity className="h-3 w-3 mr-1" />}
          {mission.status === 'paused' && <Pause className="h-3 w-3 mr-1" />}
          {mission.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Area
          </span>
          <span className="text-white">{mission.area.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Progress
          </span>
          <span className="text-white">{Math.round(mission.progress)}%</span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${mission.progress}%` }}
          />
        </div>

        {mission.stats && (
          <div className="pt-2 mt-2 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-400 block">Distance</span>
                <span className="text-white">{mission.stats.distanceCovered} km</span>
              </div>
              <div>
                <span className="text-gray-400 block">Data Points</span>
                <span className="text-white">{mission.stats.dataPointsCollected}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {isSelected && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex gap-2">
            {mission.status === 'in-progress' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onControl(mission.id, 'pause');
                }}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
              >
                Pause
              </button>
            )}
            {mission.status === 'paused' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onControl(mission.id, 'resume');
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
              >
                Resume
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onControl(mission.id, 'abort');
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
            >
              Abort
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionCard;