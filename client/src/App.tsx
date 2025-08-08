import { Router, Route, Switch } from 'wouter';
import Navigation from './components/Navigation';
import FleetDashboard from './pages/FleetDashboard.tsx';
import LiveMonitoring from './pages/LiveMonitoring.tsx';
import MissionPlanning from './pages/MissionPlanning.tsx';
import ReportingDashboard from './pages/ReportingDashboard.tsx';
import SettingsPanel from './pages/SettingsPanel.tsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen relative" style={{
        background: 'rgb(248, 250, 252)'
      }}>
        {/* Subtle background pattern */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.05) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        <Navigation />
        <main className="relative z-10 max-w-8xl mx-auto px-6 sm:px-8 lg:px-12 py-12 container-comfortable">
          <Switch>
            <Route path="/" component={FleetDashboard} />
            <Route path="/dashboard" component={FleetDashboard} />
            <Route path="/monitoring" component={LiveMonitoring} />
            <Route path="/planning" component={MissionPlanning} />
            <Route path="/reporting" component={ReportingDashboard} />
            <Route path="/settings" component={SettingsPanel} />
            <Route>
              <FleetDashboard />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;