import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, DollarSign, BarChart3, TrendingUp } from "lucide-react";

export default function AdminAnalyticsOverview() {
  const metrics = [
    { label: "Total Users", value: "42,380", icon: <Users className="h-5 w-5 text-purple-600" /> },
    { label: "Monthly Revenue", value: "$128,400", icon: <DollarSign className="h-5 w-5 text-green-600" /> },
    { label: "Active Salons", value: "562", icon: <BarChart3 className="h-5 w-5 text-blue-600" /> },
    { label: "Growth Rate", value: "+8.2%", icon: <TrendingUp className="h-5 w-5 text-yellow-600" /> },
  ];

  const data = [
    { month: "May", revenue: 72000 },
    { month: "Jun", revenue: 81000 },
    { month: "Jul", revenue: 94000 },
    { month: "Aug", revenue: 102000 },
    { month: "Sep", revenue: 114000 },
    { month: "Oct", revenue: 128400 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-10 lg:px-20 py-12 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Overview</h1>
          <p className="text-gray-500 mt-1">
            Track performance metrics and platform growth insights.
          </p>
        </div>
        <Button className="bg-black hover:bg-gray-900 text-white">
          Export Report
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-lg text-gray-800">{metric.label}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-gray-900">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue trend */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue growth across the platform</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagement summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle>Top Performing City</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-800">New York City</p>
            <p className="text-sm text-gray-500 mt-1">12,500 bookings this month</p>
            <Badge className="bg-green-100 text-green-700 mt-3">+15% vs last month</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle>Most Booked Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-800">Hair Coloring</p>
            <p className="text-sm text-gray-500 mt-1">23,200 total bookings</p>
            <Badge className="bg-purple-100 text-purple-700 mt-3">+9% vs last month</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle>Customer Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold text-gray-800">82%</p>
            <p className="text-sm text-gray-500 mt-1">Returning customer rate</p>
            <Badge className="bg-yellow-100 text-yellow-700 mt-3">Stable</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
