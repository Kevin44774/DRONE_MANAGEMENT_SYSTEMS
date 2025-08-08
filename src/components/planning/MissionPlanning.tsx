import React, { useState } from 'react';
import { useDrone } from '../../contexts/DroneContext';
import MissionForm from './MissionForm';
import { Mission } from '../../types';

const MissionPlanning: React.FC = () => {
  const { drones, addMission } = useDrone();
  const [showForm, setShowForm] = useState(false);

  const availableDrones = drones.filter(drone => drone.status === 'available');

  const handleMissionCreate = (missionData: Omit<Mission, 'id' | 'createdAt'>) => {
    addMission(missionData);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Mission Planning</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Create New Mission
        </button>
      </div>

      {showForm ? (
        <MissionForm
          drones={availableDrones}
          onSubmit={handleMissionCreate}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
          <h3 className="text-xl font-medium text-white mb-4">Plan autonomous drone surveys with precision flight paths and data collection parameters</h3>
          <p className="text-gray-400 mb-6">
            {availableDrones.length} drones available
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-premium rounded-xl p-6 text-center">
              <h4 className="text-sm font-medium text-medium-contrast mb-2">Survey Patterns</h4>
              <p className="text-high-contrast text-sm">Crosshatch, perimeter, or custom flight paths</p>
            </div>
            <div className="card-premium rounded-xl p-6 text-center">
              <h4 className="text-sm font-medium text-medium-contrast mb-2">Real-time Control</h4>
              <p className="text-high-contrast text-sm">Monitor and control missions as they happen</p>
            </div>
            <div className="card-premium rounded-xl p-6 text-center">
              <h4 className="text-sm font-medium text-medium-contrast mb-2">Detailed Analytics</h4>
              <p className="text-high-contrast text-sm">Comprehensive reporting and data insights</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Start Planning
          </button>
        </div>
      )}
    </div>
  );
};

export default MissionPlanning;