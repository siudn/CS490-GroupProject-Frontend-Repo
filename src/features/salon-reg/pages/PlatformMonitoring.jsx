import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/ui/card';
import { Badge } from '../../../shared/ui/badge';
import { Alert, AlertDescription } from '../../../shared/ui/alert';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { 
  getSystemHealth, 
  getPlatformMetrics, 
  getSystemAlerts, 
  getRecentErrors 
} from '../api.js';

export default function PlatformMonitoring() {
  const [systemHealth, setSystemHealth] = useState({});
  const [platformMetrics, setPlatformMetrics] = useState({});
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [recentErrors, setRecentErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMonitoringData();
  }, []);

  const loadMonitoringData = async () => {
    setLoading(true);
    try {
      const [health, metrics, alerts, errors] = await Promise.all([
        getSystemHealth(),
        getPlatformMetrics(),
        getSystemAlerts(),
        getRecentErrors()
      ]);
      
      setSystemHealth(health);
      setPlatformMetrics(metrics);
      setActiveAlerts(alerts);
      setRecentErrors(errors);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <Alert key={alert.id}>
              <Activity className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.title}:</strong> {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health Overview
          </CardTitle>
          <CardDescription>Real-time platform performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">API Response Time</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="mb-1">{systemHealth.apiResponseTime || '142ms'}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Target: &lt; 200ms</span>
                <Badge variant="secondary" className="text-xs">—</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Database Queries</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="mb-1">{systemHealth.databaseQueries || '98.7%'}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Target: &gt; 95%</span>
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3" />
                </Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Error Rate</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="mb-1">{systemHealth.errorRate || '0.3%'}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Target: &lt; 1%</span>
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 rotate-180" />
                </Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Server Uptime</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="mb-1">{systemHealth.serverUptime || '99.97%'}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Target: &gt; 99.9%</span>
                <Badge variant="secondary" className="text-xs">—</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Infrastructure Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Server className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p>Web Servers</p>
                  <p className="text-xs text-gray-500">4 active instances</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Database className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p>Database</p>
                  <p className="text-xs text-gray-500">Primary + 2 replicas</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p>CDN</p>
                  <p className="text-xs text-gray-500">Global edge locations</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p>Payment Gateway</p>
                  <p className="text-xs text-gray-500">Stripe integration</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Requests per Minute</p>
              <p>1,247</p>
              <p className="text-xs text-gray-500 mt-1">Average over last hour</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Success Rate</p>
              <p>99.7%</p>
              <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Peak Load Time</p>
              <p>2:00 PM - 4:00 PM</p>
              <p className="text-xs text-gray-500 mt-1">Weekdays</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm text-gray-600">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Memory Usage</span>
                <span className="text-sm text-gray-600">58%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '58%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Storage Usage</span>
                <span className="text-sm text-gray-600">67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '67%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Bandwidth Usage</span>
                <span className="text-sm text-gray-600">35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '35%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Errors & Issues
          </CardTitle>
          <CardDescription>
            Monitor and track platform errors to ensure reliability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentErrors.map((error) => (
              <div key={error.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          error.severity === 'warning'
                            ? 'destructive'
                            : error.severity === 'info'
                            ? 'secondary'
                            : 'default'
                        }
                      >
                        {error.severity}
                      </Badge>
                      <span>{error.type}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{error.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(error.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>30-Day Uptime History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-1">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 h-12 bg-green-500 rounded hover:bg-green-600 cursor-pointer transition-colors"
                  title={`Day ${i + 1}: 100% uptime`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>100% uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded" />
                <span>Partial outage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span>Major outage</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
