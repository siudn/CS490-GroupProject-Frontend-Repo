import { lazy } from "react";
import { RoleGate } from "../../shared/routing/Protected.jsx";

const AdminDashboard = lazy(() => import("../../pages/admin/AdminDashboard.jsx"));
const PlatformHealth = lazy(() => import("../../pages/admin/PlatformHealth.jsx"));

// Import existing admin pages
const AdminVerify = lazy(() => import("../salon-reg/pages/AdminVerify.jsx"));
const AdminAnalytics = lazy(() => import("../salon-reg/pages/AdminAnalytics.jsx"));
const CustomerInsights = lazy(() => import("../salon-reg/pages/CustomerInsights.jsx"));
const PlatformMonitoring = lazy(() => import("../salon-reg/pages/PlatformMonitoring.jsx"));

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

