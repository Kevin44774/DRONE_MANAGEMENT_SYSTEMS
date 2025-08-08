import React from 'react';
import { motion } from 'framer-motion';
import { Mission } from '../../types';
import { Play, Pause, Square, MapPin, Clock, Activity, Zap, Target } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  isSelected: boolean;
  onSelect: () => void;
  onControl: (missionId: string, action: 'pause' | 'resume' | 'abort') => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, isSelected, onSelect, onControl }) => {
  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'in-progress': return 'text-white bg-blue-500';
      case 'paused': return 'text-white bg-yellow-500';
      case 'completed': return 'text-white bg-green-500';
      case 'aborted': return 'text-white bg-red-500';
      default: return 'text-gray-800 bg-gray-200';
    }
  };

  return (
    <motion.div
      className={`card-premium hover-lift cursor-pointer relative overflow-hidden group ${
        isSelected ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
      }`}
      onClick={onSelect}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Background animation */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 bg-purple-500/5 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-purple-100">
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold text-high-contrast mb-1 text-center">
          {mission.name}
        </h3>
        <p className="text-sm text-medium-contrast mb-4 text-center capitalize">{mission.type}</p>
        
        {/* Status */}
        <div className="mb-6 text-center">
          <motion.span 
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(mission.status)} shadow-lg`}
            whileHover={{ scale: 1.05 }}
          >
            {mission.status === 'in-progress' && <Activity className="h-3 w-3 mr-1.5" />}
            {mission.status === 'paused' && <Pause className="h-3 w-3 mr-1.5" />}
            {mission.status === 'completed' && <Zap className="h-3 w-3 mr-1.5" />}
            {mission.status.replace('-', ' ').toUpperCase()}
          </motion.span>
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-medium-contrast font-medium">Area</span>
            <span className="font-bold text-sm text-high-contrast">{mission.area.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-medium-contrast font-medium">Progress</span>
            <span className="font-bold text-sm text-high-contrast">{Math.round(mission.progress)}%</span>
          </div>
          {mission.stats && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-medium-contrast font-medium">Distance</span>
                <span className="font-bold text-sm text-high-contrast">{mission.stats.distanceCovered} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-medium-contrast font-medium">Data Points</span>
                <span className="font-bold text-sm text-high-contrast">{mission.stats.dataPointsCollected}</span>
              </div>
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            className="h-2 bg-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${mission.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Control Buttons */}
        {isSelected && (
          <div className="flex gap-2">
            {mission.status === 'in-progress' && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onControl(mission.id, 'pause');
                }}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </motion.button>
            )}
            {mission.status === 'paused' && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onControl(mission.id, 'resume');
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="h-4 w-4 mr-2" />
                Resume
              </motion.button>
            )}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onControl(mission.id, 'abort');
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Square className="h-4 w-4 mr-2" />
              Abort
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MissionCard;