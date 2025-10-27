import React from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  Clock,
} from "lucide-react";

export default function PlatformMonitoring() {
  const metrics = [
    { name: "API Response Time", value: "142ms", status: "healthy", trend: "stable" },
    { name: "Database Queries", value: "98.7%", status: "healthy", trend: "up" },
    { name: "Error Rate", value: "0.3%", status: "healthy", trend: "down" },
    { name: "Server Uptime", value: "99.97%", status: "healthy", trend: "stable" },
  ];

  const alerts = [
    {
      id: 1,
      title: "High Traffic Detected",
      message: "Traffic is 2.5x above normal — auto-scaling active",
    },
  ];

  const recentErrors = [
    {
      id: 1,
      type: "Payment Gateway",
      message: "Stripe API timeout – retry successful",
      time: "2025-10-11 10:23 AM",
    },
    {
      id: 2,
      type: "Database",
      message: "Slow query detected on appointments table",
      time: "2025-10-11 09:45 AM",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Platform Monitoring Dashboard
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Real-time system health and performance overview.
        </p>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-10">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-4"
              >
                <p className="text-blue-700 font-semibold">{a.title}</p>
                <p className="text-blue-600 text-sm">{a.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {metrics.map((m) => (
            <div
              key={m.name}
              className="bg-gray-50 rounded-xl shadow p-6 text-center hover:shadow-md transition"
            >
              <div className="flex justify-center mb-3">
                <CheckCircle className="text-green-600" size={22} />
              </div>
              <p className="font-semibold text-gray-800">{m.name}</p>
              <p className="text-2xl font-bold text-gray-900">{m.value}</p>
              <p className="text-xs text-gray-500 mt-1">Trend: {m.trend}</p>
            </div>
          ))}
        </div>

        {/* Recent Errors */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Errors & Warnings
          </h3>
          <div className="space-y-4">
            {recentErrors.map((err) => (
              <div
                key={err.id}
                className="flex justify-between items-center bg-gray-50 border rounded-lg p-4"
              >
                <div>
                  <p className="font-medium text-gray-800">{err.type}</p>
                  <p className="text-gray-600 text-sm">{err.message}</p>
                </div>
                <p className="text-xs text-gray-500">{err.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Uptime History */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            30-Day Uptime History
          </h3>
          <div className="flex gap-1 mb-1">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="flex-1 h-6 bg-green-500 rounded hover:bg-green-600 transition"
                title={`Day ${i + 1}: 100% uptime`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
