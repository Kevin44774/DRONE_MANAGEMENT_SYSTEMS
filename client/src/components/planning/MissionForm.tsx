import React, { useState } from 'react';
import { Mission, Drone } from '../../types';
import { MapPin, Settings, Calendar, Zap } from 'lucide-react';

interface MissionFormProps {
  drones: Drone[];
  onSubmit: (mission: Omit<Mission, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const MissionForm: React.FC<MissionFormProps> = ({ drones, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'inspection' as Mission['type'],
    droneId: '',
    areaName: '',
    pattern: 'crosshatch' as Mission['pattern'],
    altitude: 75,
    speed: 6,
    overlapPercentage: 70,
    captureFrequency: 1,
    estimatedDuration: 30
  });

  const [activeStep, setActiveStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate sample flight path based on pattern
    const flightPath = generateFlightPath(formData.pattern, formData.altitude);
    const area = {
      name: formData.areaName,
      bounds: [
        { lat: 37.7749, lng: -122.4194 },
        { lat: 37.7759, lng: -122.4184 },
        { lat: 37.7769, lng: -122.4204 },
        { lat: 37.7759, lng: -122.4214 }
      ]
    };

    const mission: Omit<Mission, 'id' | 'createdAt'> = {
      name: formData.name,
      type: formData.type,
      status: 'planned',
      droneId: formData.droneId,
      area,
      flightPath,
      pattern: formData.pattern,
      parameters: {
        altitude: formData.altitude,
        speed: formData.speed,
        overlapPercentage: formData.overlapPercentage,
        captureFrequency: formData.captureFrequency
      },
      progress: 0,
      estimatedDuration: formData.estimatedDuration
    };

    onSubmit(mission);
  };

  const generateFlightPath = (pattern: string, altitude: number) => {
    // Generate sample waypoints based on pattern
    const basePoints = [
      { lat: 37.7749, lng: -122.4194, altitude },
      { lat: 37.7759, lng: -122.4184, altitude },
      { lat: 37.7769, lng: -122.4204, altitude },
      { lat: 37.7759, lng: -122.4214, altitude }
    ];

    if (pattern === 'crosshatch') {
      return [
        ...basePoints,
        { lat: 37.7754, lng: -122.4199, altitude },
        { lat: 37.7764, lng: -122.4189, altitude },
        { lat: 37.7774, lng: -122.4209, altitude }
      ];
    }

    return basePoints;
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: Calendar },
    { number: 2, title: 'Area & Pattern', icon: MapPin },
    { number: 3, title: 'Parameters', icon: Settings },
    { number: 4, title: 'Review', icon: Zap }
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">Create New Mission</h3>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  activeStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-600 text-gray-400'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  activeStep >= step.number ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {step.number < steps.length && (
                  <div className={`ml-4 w-12 h-0.5 ${
                    activeStep > step.number ? 'bg-blue-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Info */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mission Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter mission name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mission Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Mission['type'] })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="inspection">Infrastructure Inspection</option>
                <option value="security">Security Patrol</option>
                <option value="mapping">Site Mapping</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Drone
              </label>
              <select
                value={formData.droneId}
                onChange={(e) => setFormData({ ...formData, droneId: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a drone</option>
                {drones.map((drone) => (
                  <option key={drone.id} value={drone.id}>
                    {drone.name} - {drone.model} (Battery: {drone.batteryLevel}%)
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Area & Pattern */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Survey Area Name
              </label>
              <input
                type="text"
                value={formData.areaName}
                onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter area name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Flight Pattern
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'crosshatch', label: 'Crosshatch', description: 'Grid pattern for comprehensive coverage' },
                  { value: 'perimeter', label: 'Perimeter', description: 'Follow boundary edges' },
                  { value: 'custom', label: 'Custom', description: 'Define custom waypoints' }
                ].map((pattern) => (
                  <div
                    key={pattern.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.pattern === pattern.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setFormData({ ...formData, pattern: pattern.value as Mission['pattern'] })}
                  >
                    <h4 className="font-medium text-white text-sm">{pattern.label}</h4>
                    <p className="text-gray-400 text-xs mt-1">{pattern.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Parameters */}
        {activeStep === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Flight Altitude (m)
              </label>
              <input
                type="number"
                value={formData.altitude}
                onChange={(e) => setFormData({ ...formData, altitude: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="10"
                max="400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Flight Speed (m/s)
              </label>
              <input
                type="number"
                value={formData.speed}
                onChange={(e) => setFormData({ ...formData, speed: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="15"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Overlap Percentage (%)
              </label>
              <input
                type="number"
                value={formData.overlapPercentage}
                onChange={(e) => setFormData({ ...formData, overlapPercentage: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="50"
                max="90"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Capture Frequency (sec)
              </label>
              <input
                type="number"
                value={formData.captureFrequency}
                onChange={(e) => setFormData({ ...formData, captureFrequency: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0.5"
                max="10"
                step="0.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="5"
                max="120"
              />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {activeStep === 4 && (
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="font-medium text-white mb-4">Mission Review</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 block">Name:</span>
                <span className="text-white">{formData.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Type:</span>
                <span className="text-white capitalize">{formData.type}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Drone:</span>
                <span className="text-white">
                  {drones.find(d => d.id === formData.droneId)?.name || 'Not selected'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Pattern:</span>
                <span className="text-white capitalize">{formData.pattern}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Altitude:</span>
                <span className="text-white">{formData.altitude}m</span>
              </div>
              <div>
                <span className="text-gray-400 block">Duration:</span>
                <span className="text-white">{formData.estimatedDuration} minutes</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-700">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Back
              </button>
            )}
          </div>
          
          <div>
            {activeStep < 4 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                disabled={
                  (activeStep === 1 && (!formData.name || !formData.droneId)) ||
                  (activeStep === 2 && !formData.areaName)
                }
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
              >
                Create Mission
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default MissionForm;