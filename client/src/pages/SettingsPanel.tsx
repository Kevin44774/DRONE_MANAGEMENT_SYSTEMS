import { Settings, Bell, Shield, Database, Globe } from 'lucide-react';

const SettingsPanel = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-high-contrast mb-1" data-testid="text-page-title">Settings</h2>
        <p className="text-medium-contrast text-lg">Manage your organization's drone operations preferences</p>
      </div>

      <div className="grid gap-8">
        {/* General Settings */}
        <div className="card-premium">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-purple-100">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-high-contrast">General Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-medium-contrast mb-2">
                Organization Name
              </label>
              <input
                type="text"
                defaultValue="DroneFlow Operations"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-high-contrast focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                data-testid="input-org-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-medium-contrast mb-2">
                Default Flight Altitude (m)
              </label>
              <input
                type="number"
                defaultValue="50"
                min="10"
                max="120"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-high-contrast focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                data-testid="input-default-altitude"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card-premium">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-green-100">
              <Bell className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-high-contrast">Notifications</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-high-contrast font-medium">Mission Alerts</div>
                <div className="text-sm text-medium-contrast">Get notified when missions start, complete, or encounter issues</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked data-testid="toggle-mission-alerts" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-high-contrast font-medium">Battery Warnings</div>
                <div className="text-sm text-medium-contrast">Alert when drone batteries are low</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked data-testid="toggle-battery-warnings" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card-premium">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-high-contrast">Security</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-high-contrast font-medium">Geofencing</div>
                <div className="text-sm text-medium-contrast">Restrict drone operations to designated areas</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked data-testid="toggle-geofencing" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-medium-contrast mb-2">
                Emergency Landing Protocol
              </label>
              <select
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-high-contrast focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                data-testid="select-emergency-protocol"
              >
                <option value="return-to-home">Return to Home</option>
                <option value="immediate-landing">Immediate Landing</option>
                <option value="manual-control">Manual Control</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card-premium">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-blue-100">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-high-contrast">Data Management</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-medium-contrast mb-2">
                Data Retention Period
              </label>
              <select
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-high-contrast focus:ring-2 focus:ring-purple-500 focus:border-transparent select-trigger-solid"
                data-testid="select-retention-period"
              >
                <option value="30">30 days</option>
                <option value="90" selected>90 days</option>
                <option value="365">1 year</option>
                <option value="forever">Forever</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-high-contrast font-medium">Automatic Backup</div>
                <div className="text-sm text-medium-contrast">Automatically backup mission data and settings</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked data-testid="toggle-auto-backup" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="card-premium">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-orange-100">
              <Globe className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-high-contrast">Integrations</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-medium-contrast mb-2">
                Weather Service API
              </label>
              <input
                type="text"
                placeholder="Enter API key"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-high-contrast focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                data-testid="input-weather-api"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-medium-contrast mb-2">
                Map Provider
              </label>
              <select
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-high-contrast focus:ring-2 focus:ring-purple-500 focus:border-transparent select-trigger-solid"
                data-testid="select-map-provider"
              >
                <option value="mapbox">Mapbox</option>
                <option value="google" selected>Google Maps</option>
                <option value="openstreetmap">OpenStreetMap</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            className="btn-primary text-white px-8 py-3 rounded-lg transition-colors"
            data-testid="button-save-settings"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;