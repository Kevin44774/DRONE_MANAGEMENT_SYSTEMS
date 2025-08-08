import React, { useState } from 'react';
import Navigation from './components/Navigation';
import FleetDashboard from './components/dashboard/FleetDashboard';
import LiveMonitoring from './components/monitoring/LiveMonitoring';
import MissionPlanning from './components/planning/MissionPlanning';
import ReportingDashboard from './components/reporting/ReportingDashboard';
import SettingsPanel from './components/settings/SettingsPanel';
import { DroneProvider } from './contexts/DroneContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <FleetDashboard />;
      case 'monitoring':
        return <LiveMonitoring />;
      case 'planning':
        return <MissionPlanning />;
      case 'reporting':
        return <ReportingDashboard />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <FleetDashboard />;
    }
  };

  return (
    <DroneProvider>
      <div className="min-h-screen bg-gray-900">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </DroneProvider>
  );
}

export default App;