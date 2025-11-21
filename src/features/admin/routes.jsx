import { lazy } from "react";
import { RoleGate } from "../../shared/routing/RoleGate.jsx";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const PlatformHealth = lazy(() => import("./pages/PlatformHealth.jsx"));
const AdminVerify = lazy(() => import("./pages/AdminVerify.jsx"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics.jsx"));
const CustomerInsights = lazy(() => import("./pages/CustomerInsights.jsx"));
const PlatformMonitoring = lazy(() => import("./pages/PlatformMonitoring.jsx"));

export default [
  { 
    path: "/admin/dashboard", 
    element: <RoleGate allow={["admin"]}><AdminDashboard /></RoleGate> 
  },
  { 
    path: "/admin/verify", 
    element: <RoleGate allow={["admin"]}><AdminVerify /></RoleGate> 
  },
  { 
    path: "/admin/analytics", 
    element: <RoleGate allow={["admin"]}><AdminAnalytics /></RoleGate> 
  },
  { 
    path: "/admin/health", 
    element: <RoleGate allow={["admin"]}><PlatformHealth /></RoleGate> 
  },
  { 
    path: "/admin/customer-insights", 
    element: <RoleGate allow={["admin"]}><CustomerInsights /></RoleGate> 
  },
  { 
    path: "/admin/platform-monitoring", 
    element: <RoleGate allow={["admin"]}><PlatformMonitoring /></RoleGate> 
  },
];
