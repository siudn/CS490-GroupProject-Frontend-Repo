import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Activity, Server, Wifi, AlertTriangle } from "lucide-react";

export default function PlatformMonitoring() {
  const metrics = [
    { label: "API Uptime", value: "99.97%", status: "good" },
    { label: "Server Load", value: "63%", status: "warn" },
    { label: "Avg. Response Time", value: "284 ms", status: "good" },
    { label: "Error Rate", value: "0.4%", status: "warn" },
    { label: "Database Queries / min", value: "1,320", status: "good" },
    { label: "Active Connections", value: "823", status: "good" },
  ];

  const incidents = [
    { id: 1, title: "Minor latency detected", date: "Oct 25, 2025", status: "resolved" },
    { id: 2, title: "API outage in region US-East", date: "Oct 22, 2025", status: "resolved" },
    { id: 3, title: "Database replication delay", date: "Oct 18, 2025", status: "active" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-10 lg:px-20 py-12 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Platform Monitoring</h1>
          <p className="text-gray-500 mt-1">
            Live overview of server uptime, performance metrics, and incident activity.
          </p>
        </div>
        <Button className="bg-black hover:bg-gray-900 text-white">Refresh Data</Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-3xl font-semibold ${
                  metric.status === "good"
                    ? "text-green-600"
                    : metric.status === "warn"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {metric.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {metric.status === "good"
                  ? "Operational"
                  : metric.status === "warn"
                  ? "Monitor closely"
                  : "Attention required"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Health Summary */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader className="flex items-center gap-2">
          <Server className="h-5 w-5 text-purple-600" />
          <CardTitle>System Health Summary</CardTitle>
          <CardDescription>Updated in real-time every 30 seconds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              All systems operational. No major outages detected across regions.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-3 text-sm text-gray-600">
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">US-East</span>
              <span>Normal load</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">US-West</span>
              <span>Normal load</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">EU-Central</span>
              <span className="text-yellow-600">Minor latency</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          <CardTitle>Incident History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {incidents.map((incident) => (
              <div key={incident.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">{incident.title}</p>
                  <p className="text-xs text-gray-500">{incident.date}</p>
                </div>
                {incident.status === "resolved" ? (
                  <Badge className="bg-green-100 text-green-700">Resolved</Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-700">Ongoing</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Status */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader className="flex items-center gap-2">
          <Wifi className="h-5 w-5 text-purple-600" />
          <CardTitle>Network Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-lg font-semibold text-green-600">Low</p>
              <p className="text-xs text-gray-500">Latency</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-green-600">Stable</p>
              <p className="text-xs text-gray-500">Packet Loss</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-yellow-600">Moderate</p>
              <p className="text-xs text-gray-500">Jitter</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-green-600">Up</p>
              <p className="text-xs text-gray-500">Connectivity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Summary */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-purple-600" />
          <CardTitle>Alert Center</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert variant="destructive">
            <AlertDescription>
              Scheduled maintenance window — Nov 2, 2025 (12:00 AM – 3:00 AM EST)
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertDescription>
              Elevated database CPU usage detected, monitoring closely.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
