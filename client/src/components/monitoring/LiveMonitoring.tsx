import React, { useState, useEffect } from 'react';
import { useDrone } from '../../contexts/DroneContext';
import MissionCard from './MissionCard';
import MapView from './MapView';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

const LiveMonitoring: React.FC = () => {
  const { missions, updateMission, drones } = useDrone();
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  
  const activeMissions = missions.filter(m => m.status === 'in-progress' || m.status === 'paused');
  const selectedMissionData = selectedMission 
    ? missions.find(m => m.id === selectedMission)
    : activeMissions[0];

  const handleMissionControl = (missionId: string, action: 'pause' | 'resume' | 'abort') => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    switch (action) {
      case 'pause':
        updateMission(missionId, { status: 'paused' });
        break;
      case 'resume':
        updateMission(missionId, { status: 'in-progress' });
        break;
      case 'abort':
        updateMission(missionId, { status: 'aborted', progress: 0 });
        break;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-high-contrast mb-2">Live Mission Monitoring</h2>
          <p className="text-medium-contrast text-lg">Track active missions and control drone operations</p>
        </div>
        <div className="glass-effect-strong px-6 py-3 rounded-xl">
          <span className="text-high-contrast text-lg font-bold">
            {activeMissions.length} Active Mission{activeMissions.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 grid-comfortable">
        {/* Mission List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-4">Active Missions</h3>
          {activeMissions.length === 0 ? (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
              <p className="text-gray-400">No active missions</p>
            </div>
          ) : (
            activeMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                isSelected={selectedMission === mission.id}
                onSelect={() => setSelectedMission(mission.id)}
                onControl={handleMissionControl}
              />
            ))
          )}
        </div>

        {/* Map and Controls */}
        <div className="lg:col-span-2 space-y-4">
          {selectedMissionData && (
            <>
              {/* Mission Controls */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white">{selectedMissionData.name}</h4>
                  <div className="flex items-center gap-2">
                    {selectedMissionData.status === 'in-progress' && (
                      <button
                        onClick={() => handleMissionControl(selectedMissionData.id, 'pause')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-md transition-colors"
                      >
                        <Pause className="h-4 w-4" />
                      </button>
                    )}
                    {selectedMissionData.status === 'paused' && (
                      <button
                        onClick={() => handleMissionControl(selectedMissionData.id, 'resume')}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleMissionControl(selectedMissionData.id, 'abort')}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                    >
                      <Square className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(selectedMissionData.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${selectedMissionData.progress}%` }}
                    />
                  </div>
                </div>

                {/* Mission Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block">Status</span>
                    <span className="text-white font-medium">{selectedMissionData.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Duration</span>
                    <span className="text-white font-medium">{selectedMissionData.estimatedDuration}m</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Altitude</span>
                    <span className="text-white font-medium">{selectedMissionData.parameters.altitude}m</span>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                <MapView mission={selectedMissionData} drones={drones} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;