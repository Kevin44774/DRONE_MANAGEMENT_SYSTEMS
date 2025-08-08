import React, { useState } from 'react';
import { Settings, Users, Shield, Bell, Database, Wifi } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'users', label: 'Users & Permissions', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integration', label: 'API & Integration', icon: Database },
    { id: 'connectivity', label: 'Connectivity', icon: Wifi }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-gray-800 rounded-lg border border-gray-700 p-6">
          {activeSection === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">General Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    defaultValue="FlytBase Drone Operations"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Flight Altitude (meters)
                  </label>
                  <input
                    type="number"
                    defaultValue="75"
                    min="10"
                    max="400"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time Zone
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="UTC">UTC</option>
                    <option value="PST">Pacific Standard Time</option>
                    <option value="EST">Eastern Standard Time</option>
                    <option value="GMT">Greenwich Mean Time</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoBackup"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-300">
                    Enable automatic data backup
                  </label>
                </div>
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                Save Changes
              </button>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Users & Permissions</h3>
              
              <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-center">
                  User management features would be implemented here, including role-based access control, 
                  user invitations, and permission management for different organizational levels.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                    <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                  </div>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Enable
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">Session Timeout</h4>
                    <p className="text-gray-400 text-sm">Automatically log out after inactivity</p>
                  </div>
                  <select className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="240">4 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Notification Settings</h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Mission Completion', description: 'Get notified when missions are completed' },
                  { label: 'Low Battery Alerts', description: 'Receive alerts when drone battery is low' },
                  { label: 'System Maintenance', description: 'Notifications about system updates and maintenance' },
                  { label: 'Emergency Alerts', description: 'Critical alerts for mission failures or emergencies' }
                ].map((notification) => (
                  <div key={notification.label} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{notification.label}</h4>
                      <p className="text-gray-400 text-sm">{notification.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'integration' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">API & Integration</h3>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <h4 className="text-white font-medium mb-4">API Configuration</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      API Base URL
                    </label>
                    <input
                      type="url"
                      defaultValue="https://api.droneflow.com/v1"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        defaultValue="sk_test_4eC39HqLyjWDarjtT1zdp7dc"
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        readOnly
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'connectivity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Connectivity Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-900 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Ground Control Connection</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Connected to Ground Control Station</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-900 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Telemetry Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Update Frequency</span>
                      <select className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm">
                        <option value="1">1 Hz</option>
                        <option value="5">5 Hz</option>
                        <option value="10" selected>10 Hz</option>
                        <option value="20">20 Hz</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;