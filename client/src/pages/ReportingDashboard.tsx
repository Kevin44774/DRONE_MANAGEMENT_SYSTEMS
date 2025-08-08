import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart,
  Download,
  TrendingUp,
  Clock,
  MapPin,
  Activity,
  Calendar,
  FileText,
  PieChart,
  Target,
  Zap,
  Users,
  AlertCircle
} from 'lucide-react';
import type { Drone, Mission, Organization } from '@shared/schema';

export default function ReportingDashboard() {
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [reportType, setReportType] = useState<string>('overview');

  const { data: missions = [], isLoading: missionsLoading } = useQuery<Mission[]>({
    queryKey: ['/api/missions'],
  });

  const { data: drones = [], isLoading: dronesLoading } = useQuery<Drone[]>({
    queryKey: ['/api/drones'],
  });

  const { data: orgStats, isLoading: orgLoading } = useQuery<Organization>({
    queryKey: ['/api/organization/stats'],
  });

  // Filter missions by time range
  const filterMissionsByTimeRange = (missions: Mission[], range: string) => {
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        return missions;
    }

    return missions.filter(m => 
      m.createdAt && new Date(m.createdAt) >= startDate
    );
  };

  const filteredMissions = filterMissionsByTimeRange(missions, timeRange);

  // Calculate analytics
  const analytics = {
    totalMissions: filteredMissions.length,
    completedMissions: filteredMissions.filter(m => m.status === 'completed').length,
    inProgressMissions: filteredMissions.filter(m => m.status === 'in-progress').length,
    abortedMissions: filteredMissions.filter(m => m.status === 'aborted').length,
    totalFlightTime: filteredMissions.reduce((sum, m) => sum + (m.actualDuration || 0), 0),
    totalDistance: filteredMissions.reduce((sum, m) => 
      sum + (m.stats?.distanceCovered || 0), 0
    ),
    totalAreaSurveyed: filteredMissions.reduce((sum, m) => 
      sum + (m.stats?.areasCovered || 0), 0
    ),
    totalDataPoints: filteredMissions.reduce((sum, m) => 
      sum + (m.stats?.dataPointsCollected || 0), 0
    ),
    averageFlightTime: filteredMissions.length > 0 
      ? filteredMissions.reduce((sum, m) => sum + (m.actualDuration || 0), 0) / filteredMissions.length
      : 0,
    successRate: filteredMissions.length > 0 
      ? (filteredMissions.filter(m => m.status === 'completed').length / filteredMissions.length) * 100
      : 0,
  };

  // Mission type distribution
  const missionTypeStats = filteredMissions.reduce((acc, mission) => {
    acc[mission.type] = (acc[mission.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Priority distribution
  const priorityStats = filteredMissions.reduce((acc, mission) => {
    acc[mission.priority] = (acc[mission.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Drone utilization
  const droneUtilization = drones.map(drone => {
    const droneMissions = filteredMissions.filter(m => m.droneId === drone.id);
    const completedMissions = droneMissions.filter(m => m.status === 'completed');
    const totalFlightTime = completedMissions.reduce((sum, m) => sum + (m.actualDuration || 0), 0);
    
    return {
      drone,
      missionsCompleted: completedMissions.length,
      totalFlightTime,
      utilizationRate: drone.maxFlightTime > 0 ? (totalFlightTime / drone.maxFlightTime) * 100 : 0,
    };
  });

  const generateReport = () => {
    // In a real implementation, this would generate and download a PDF/CSV report
    const reportData = {
      timeRange,
      reportType,
      analytics,
      missions: filteredMissions,
      drones: droneUtilization,
      generatedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drone-survey-report-${timeRange}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (missionsLoading || dronesLoading || orgLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading analytics data...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-high-contrast mb-2">Survey Reports & Analytics</h1>
          <p className="text-medium-contrast text-lg">
            Comprehensive survey summaries and organizational flight statistics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 select-trigger-solid" data-testid="select-time-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="select-content-solid">
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateReport} data-testid="button-generate-report">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div>
        <h3 className="text-xl font-semibold text-high-contrast mb-6">Performance Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 grid-comfortable">
        <div className="card-premium rounded-xl p-6 text-center" data-testid="kpi-total-missions">
          <Activity className="h-10 w-10 text-purple-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-medium-contrast mb-2">Total Missions</h4>
          <span className="text-3xl font-bold text-high-contrast">{analytics.totalMissions}</span>
        </div>

        <div className="card-premium rounded-xl p-6 text-center" data-testid="kpi-completed-missions">
          <Target className="h-10 w-10 text-green-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-medium-contrast mb-2">Completed</h4>
          <span className="text-3xl font-bold text-green-400">{analytics.completedMissions}</span>
        </div>

        <div className="card-premium rounded-xl p-6 text-center" data-testid="kpi-success-rate">
          <TrendingUp className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-medium-contrast mb-2">Success Rate</h4>
          <span className="text-3xl font-bold text-emerald-400">{analytics.successRate.toFixed(1)}%</span>
        </div>

        <div className="card-premium rounded-xl p-6 text-center" data-testid="kpi-flight-time">
          <Clock className="h-10 w-10 text-purple-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-medium-contrast mb-2">Total Flight Time</h4>
          <span className="text-3xl font-bold text-purple-400">{Math.round(analytics.totalFlightTime)}</span>
          <p className="text-xs text-medium-contrast mt-1">minutes</p>
        </div>

        <div className="card-premium rounded-xl p-6 text-center" data-testid="kpi-area-surveyed">
          <MapPin className="h-10 w-10 text-orange-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-medium-contrast mb-2">Area Surveyed</h4>
          <span className="text-3xl font-bold text-orange-400">{analytics.totalAreaSurveyed.toFixed(1)}</span>
          <p className="text-xs text-medium-contrast mt-1">km²</p>
        </div>

        <div className="card-premium rounded-xl p-6 text-center" data-testid="kpi-data-points">
          <BarChart className="h-10 w-10 text-cyan-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-medium-contrast mb-2">Data Points</h4>
          <span className="text-3xl font-bold text-cyan-400">{analytics.totalDataPoints}</span>
        </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-high-contrast mb-6">Analysis Dashboard</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setReportType('overview')}
            data-testid="tab-overview"
            className="group relative p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 bg-white hover:bg-purple-50"
            style={{
              borderColor: reportType === 'overview' ? '#8b5cf6' : '#e5e7eb',
              borderWidth: reportType === 'overview' ? '2px' : '1px',
              backgroundColor: reportType === 'overview' ? '#faf5ff' : 'white',
              transform: reportType === 'overview' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: reportType === 'overview' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg transition-colors duration-300 ${
                reportType === 'overview'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
              }`}>
                <BarChart className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h4 className={`font-semibold transition-colors duration-300 ${
                  reportType === 'overview'
                    ? 'text-purple-700'
                    : 'text-gray-700 group-hover:text-purple-600'
                }`}>
                  Overview
                </h4>
                <p className="text-xs text-gray-500 group-hover:text-purple-500 transition-colors duration-300">
                  Key metrics
                </p>
              </div>
            </div>
            {reportType === 'overview' && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-10 animate-pulse"></div>
            )}
          </button>

          <button
            onClick={() => setReportType('missions')}
            data-testid="tab-missions"
            className="group relative p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 bg-white hover:bg-blue-50"
            style={{
              borderColor: reportType === 'missions' ? '#3b82f6' : '#e5e7eb',
              borderWidth: reportType === 'missions' ? '2px' : '1px',
              backgroundColor: reportType === 'missions' ? '#eff6ff' : 'white',
              transform: reportType === 'missions' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: reportType === 'missions' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg transition-colors duration-300 ${
                reportType === 'missions'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
              }`}>
                <Target className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h4 className={`font-semibold transition-colors duration-300 ${
                  reportType === 'missions'
                    ? 'text-blue-700'
                    : 'text-gray-700 group-hover:text-blue-600'
                }`}>
                  Mission Analysis
                </h4>
                <p className="text-xs text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
                  Performance data
                </p>
              </div>
            </div>
            {reportType === 'missions' && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-10 animate-pulse"></div>
            )}
          </button>

          <button
            onClick={() => setReportType('fleet')}
            data-testid="tab-fleet"
            className="group relative p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 bg-white hover:bg-green-50"
            style={{
              borderColor: reportType === 'fleet' ? '#10b981' : '#e5e7eb',
              borderWidth: reportType === 'fleet' ? '2px' : '1px',
              backgroundColor: reportType === 'fleet' ? '#f0fdf4' : 'white',
              transform: reportType === 'fleet' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: reportType === 'fleet' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg transition-colors duration-300 ${
                reportType === 'fleet'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600'
              }`}>
                <Users className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h4 className={`font-semibold transition-colors duration-300 ${
                  reportType === 'fleet'
                    ? 'text-green-700'
                    : 'text-gray-700 group-hover:text-green-600'
                }`}>
                  Fleet Performance
                </h4>
                <p className="text-xs text-gray-500 group-hover:text-green-500 transition-colors duration-300">
                  Drone utilization
                </p>
              </div>
            </div>
            {reportType === 'fleet' && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-10 animate-pulse"></div>
            )}
          </button>

          <button
            onClick={() => setReportType('detailed')}
            data-testid="tab-detailed"
            className="group relative p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 bg-white hover:bg-orange-50"
            style={{
              borderColor: reportType === 'detailed' ? '#f97316' : '#e5e7eb',
              borderWidth: reportType === 'detailed' ? '2px' : '1px',
              backgroundColor: reportType === 'detailed' ? '#fff7ed' : 'white',
              transform: reportType === 'detailed' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: reportType === 'detailed' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="p-3 rounded-lg transition-colors duration-300"
                style={{
                  backgroundColor: reportType === 'detailed' ? '#ea580c' : '#f3f4f6',
                  color: reportType === 'detailed' ? 'white' : '#4b5563'
                }}
              >
                <FileText className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h4 className={`font-semibold transition-colors duration-300 ${
                  reportType === 'detailed'
                    ? 'text-orange-700'
                    : 'text-gray-700 group-hover:text-orange-600'
                }`}>
                  Detailed Reports
                </h4>
                <p className="text-xs text-gray-500 group-hover:text-orange-500 transition-colors duration-300">
                  Export options
                </p>
              </div>
            </div>
            {reportType === 'detailed' && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 opacity-10 animate-pulse"></div>
            )}
          </button>
        </div>

        <div className="space-y-6">

        {reportType === 'overview' && (
          <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mission Type Distribution */}
            <Card data-testid="chart-mission-types">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Mission Type Distribution
                </CardTitle>
                <CardDescription className="card-description">Breakdown of survey missions by type ({timeRange})</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(missionTypeStats).map(([type, count]) => {
                    const percentage = analytics.totalMissions > 0 ? (count / analytics.totalMissions) * 100 : 0;
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="capitalize">{type.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{count}</span>
                          <span className="text-sm text-muted-foreground">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card data-testid="chart-priority-distribution">
              <CardHeader className="card-header">
                <CardTitle className="card-title flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Priority Distribution
                </CardTitle>
                <CardDescription className="card-description">Mission priorities over selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(priorityStats).map(([priority, count]) => {
                    const percentage = analytics.totalMissions > 0 ? (count / analytics.totalMissions) * 100 : 0;
                    const color = priority === 'emergency' ? 'bg-red-500' : 
                                priority === 'high' ? 'bg-orange-500' :
                                priority === 'medium' ? 'bg-blue-500' : 'bg-green-500';
                    return (
                      <div key={priority} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${color} rounded`}></div>
                          <span className="capitalize">{priority}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{count}</span>
                          <span className="text-sm text-muted-foreground">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Mission Summary */}
          <Card>
            <CardHeader className="card-header">
              <CardTitle className="card-title flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Mission Summary
              </CardTitle>
              <CardDescription className="card-description">Latest completed survey missions and their statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMissions
                  .filter(m => m.status === 'completed')
                  .slice(0, 5)
                  .map((mission) => (
                    <div key={mission.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`recent-mission-${mission.id}`}>
                      <div className="flex-1">
                        <h4 className="font-medium">{mission.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {mission.type.replace('-', ' ')} • {mission.area.name} • 
                          {mission.completedAt && new Date(mission.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold">{mission.actualDuration || mission.estimatedDuration}min</p>
                          <p className="text-muted-foreground">Duration</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{mission.stats?.distanceCovered?.toFixed(1) || 0}km</p>
                          <p className="text-muted-foreground">Distance</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold">{mission.stats?.dataPointsCollected || 0}</p>
                          <p className="text-muted-foreground">Data Points</p>
                        </div>
                      </div>
                    </div>
                  ))}
                {filteredMissions.filter(m => m.status === 'completed').length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No completed missions in selected time range
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {reportType === 'missions' && (
          <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mission Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-muted-foreground -mt-4">Detailed analysis of mission execution and efficiency</p>
                {/* Mission Status Overview */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{analytics.inProgressMissions}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{analytics.completedMissions}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{analytics.abortedMissions}</p>
                    <p className="text-sm text-muted-foreground">Aborted</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{analytics.averageFlightTime.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Avg Duration (min)</p>
                  </div>
                </div>

                {/* Individual Mission Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Mission Details</h4>
                  <div className="max-h-96 overflow-y-auto">
                    {filteredMissions.map((mission) => (
                      <div key={mission.id} className="p-4 border rounded-lg space-y-2" data-testid={`mission-detail-${mission.id}`}>
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">{mission.name}</h5>
                          <Badge 
                            className={`text-white ${
                              mission.status === 'in-progress' ? 'bg-blue-500 hover:bg-blue-600' :
                              mission.status === 'completed' ? 'bg-green-500 hover:bg-green-600' :
                              mission.status === 'paused' ? 'bg-yellow-500 hover:bg-yellow-600' :
                              mission.status === 'aborted' ? 'bg-red-500 hover:bg-red-600' :
                              'bg-gray-500 hover:bg-gray-600'
                            }`}
                          >
                            {mission.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Type</span>
                            <p className="capitalize">{mission.type.replace('-', ' ')}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Priority</span>
                            <p className="capitalize">{mission.priority}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration</span>
                            <p>{mission.actualDuration || mission.estimatedDuration}min</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Progress</span>
                            <p>{mission.progress}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {reportType === 'fleet' && (
          <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Fleet Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-muted-foreground -mt-4">Individual drone utilization and performance metrics</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {droneUtilization.map(({ drone, missionsCompleted, totalFlightTime, utilizationRate }) => (
                    <div key={drone.id} className="p-4 border rounded-lg space-y-3" data-testid={`drone-performance-${drone.id}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{drone.name}</h4>
                          <p className="text-sm text-muted-foreground">{drone.model}</p>
                        </div>
                        <Badge 
                          className={`
                            transition-all duration-300 ease-in-out transform hover:scale-105 font-medium
                            ${drone.status === 'available' 
                              ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                              : drone.status === 'in-mission'
                              ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
                              : drone.status === 'charging'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                            }
                          `}
                        >
                          <div className={`
                            flex items-center gap-1
                            ${drone.status === 'available' ? 'animate-pulse' : ''}
                          `}>
                            <div className={`
                              w-2 h-2 rounded-full
                              ${drone.status === 'available' 
                                ? 'bg-green-500' 
                                : drone.status === 'in-mission'
                                ? 'bg-blue-500 animate-ping'
                                : drone.status === 'charging'
                                ? 'bg-yellow-500 animate-bounce'
                                : 'bg-gray-500'
                              }
                            `} />
                            {drone.status === 'in-mission' ? 'In Mission' : drone.status.charAt(0).toUpperCase() + drone.status.slice(1)}
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Missions</span>
                          <p className="font-semibold">{missionsCompleted}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Flight Hours</span>
                          <p className="font-semibold">{(totalFlightTime / 60).toFixed(1)}h</p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Utilization Rate</span>
                          <span className="font-semibold">{utilizationRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${Math.min(utilizationRate, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Battery
                        </span>
                        <span className="font-semibold">{drone.batteryLevel}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {reportType === 'detailed' && (
          <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detailed Survey Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-muted-foreground -mt-4">Comprehensive mission reports and data analysis</p>
                {/* Organization-wide Statistics */}
                {orgStats && (
                  <div className="p-6 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-4">Organization-wide Statistics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{orgStats.totalSurveys}</p>
                        <p className="text-sm text-muted-foreground">Total Surveys</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{orgStats.totalFlightHours.toFixed(1)}</p>
                        <p className="text-sm text-muted-foreground">Flight Hours</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{orgStats.activeDrones}</p>
                        <p className="text-sm text-muted-foreground">Active Drones</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{orgStats.completedMissions}</p>
                        <p className="text-sm text-muted-foreground">Completed Missions</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Export Options */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Export Options</h4>
                  <p className="text-sm text-muted-foreground -mt-2">Generate comprehensive reports for different analysis needs</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" onClick={generateReport} className="h-auto p-8 export-button" data-testid="export-summary">
                      <div className="flex flex-col items-center space-y-4">
                        <FileText className="h-20 w-20" />
                        <div className="text-center space-y-1">
                          <div className="font-medium">Summary Report</div>
                          <div className="text-xs text-muted-foreground">Key metrics and KPIs</div>
                        </div>
                      </div>
                    </Button>
                    <Button variant="outline" onClick={generateReport} className="h-auto p-8 export-button" data-testid="export-detailed">
                      <div className="flex flex-col items-center space-y-4">
                        <BarChart className="h-20 w-20" />
                        <div className="text-center space-y-1">
                          <div className="font-medium">Detailed Analytics</div>
                          <div className="text-xs text-muted-foreground">Full mission data</div>
                        </div>
                      </div>
                    </Button>
                    <Button variant="outline" onClick={generateReport} className="h-auto p-8 export-button" data-testid="export-fleet">
                      <div className="flex flex-col items-center space-y-4">
                        <Users className="h-20 w-20" />
                        <div className="text-center space-y-1">
                          <div className="font-medium">Fleet Report</div>
                          <div className="text-xs text-muted-foreground">Drone performance data</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}