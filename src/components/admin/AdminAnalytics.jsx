import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function AdminAnalytics() {
  const stats = [
    { label: "Total Bookings", value: "12,490", growth: "+12%" },
    { label: "Active Users", value: "4,312", growth: "+8%" },
    { label: "Monthly Revenue", value: "$82,540", growth: "+15%" },
    { label: "Returning Customers", value: "2,140", growth: "+5%" },
  ];

  const recentActivity = [
    { user: "Glam Studio", action: "Reached 100 bookings", date: "Oct 25" },
    { user: "Style Hub", action: "New 5-star review added", date: "Oct 24" },
    { user: "Elite Cuts", action: "Joined Salonica platform", date: "Oct 22" },
    { user: "Bliss Beauty", action: "Crossed $10k monthly revenue", date: "Oct 21" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Engagement Overview</h2>
          <p className="text-gray-500 text-sm">Track performance across salons</p>
        </div>
        <Button>Download Report</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <Card key={item.label} className="text-center shadow-md border">
            <CardHeader>
              <CardTitle className="text-sm text-gray-500">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800">{item.value}</p>
              <Badge className="mt-2 bg-green-100 text-green-700">{item.growth}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Analytics Insights */}
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle>Weekly Engagement Summary</CardTitle>
          <CardDescription>
            Insights from all partner salons across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <div className="space-y-2">
              <p className="font-medium">Average Bookings per Salon</p>
              <p className="text-2xl font-semibold text-purple-600">36.8</p>
              <p className="text-sm text-gray-500">Up 9% from last week</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Customer Retention Rate</p>
              <p className="text-2xl font-semibold text-purple-600">84%</p>
              <p className="text-sm text-gray-500">Steady performance</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Avg. Rating Across Salons</p>
              <p className="text-2xl font-semibold text-purple-600">4.7 / 5</p>
              <p className="text-sm text-gray-500">Based on 9,240 reviews</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle>Recent Platform Activity</CardTitle>
          <CardDescription>Latest updates from verified salons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((item, idx) => (
              <div
                key={idx}
                className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-md transition"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.user}</p>
                  <p className="text-sm text-gray-500">{item.action}</p>
                </div>
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
