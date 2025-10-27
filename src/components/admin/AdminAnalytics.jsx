import React, { useState } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  BarChart3,
  PieChart,
  Download,
} from "lucide-react";

export default function AdminAnalytics() {
  const [tab, setTab] = useState("engagement");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Admin Analytics Dashboard
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Comprehensive insights into platform performance and user behavior.
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-8 gap-3">
          {["engagement", "appointments", "revenue", "retention"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                tab === t
                  ? "bg-purple-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === "engagement" && (
          <div className="grid md:grid-cols-4 gap-6">
            <Card title="Total Users" value="12,453" icon={<Users />} trend="+18%" />
            <Card title="Daily Active Users" value="3,247" icon={<BarChart3 />} trend="+12%" />
            <Card title="New Signups" value="847" icon={<Calendar />} trend="This month" />
            <Card title="Avg Session Duration" value="8m 42s" icon={<TrendingUp />} trend="+15%" />
          </div>
        )}

        {tab === "appointments" && (
          <div className="grid md:grid-cols-4 gap-6">
            <Card title="Total Appointments" value="45,678" icon={<Calendar />} trend="+24%" />
            <Card title="Completion Rate" value="94.2%" icon={<Check />} trend="High" />
            <Card title="Cancel Rate" value="5.8%" icon={<X />} trend="Normal" />
            <Card title="Avg Lead Time" value="3.2 days" icon={<Clock />} trend="Stable" />
          </div>
        )}

        {tab === "revenue" && (
          <div className="grid md:grid-cols-4 gap-6">
            <Card title="Total Revenue" value="$1.2 M" icon={<DollarSign />} trend="+32%" />
            <Card title="Avg Transaction" value="$67.50" icon={<BarChart3 />} trend="+8%" />
            <Card title="Platform Fee" value="$84,500" icon={<PieChart />} trend="7% of total" />
            <Card title="Top Salon" value="Elite Studio" icon={<TrendingUp />} trend="$38,450" />
          </div>
        )}

        {tab === "retention" && (
          <div className="grid md:grid-cols-4 gap-6">
            <Card title="Retention Rate" value="82%" icon={<Users />} trend="+5%" />
            <Card title="Churn Rate" value="18%" icon={<TrendingUp />} trend="Down from 23%" />
            <Card title="Lifetime Value" value="$542" icon={<DollarSign />} trend="Rising" />
            <Card title="Avg Lifetime" value="8.2 months" icon={<Calendar />} trend="Steady" />
          </div>
        )}

        <div className="flex justify-end mt-10">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon, trend }) {
  return (
    <div className="bg-gray-50 rounded-xl shadow p-6 hover:shadow-md transition text-center">
      <div className="flex justify-center mb-3 text-purple-600">{icon}</div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{trend}</p>
    </div>
  );
}
