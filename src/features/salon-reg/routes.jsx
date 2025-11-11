import { lazy } from "react";
import { RoleGate } from "../../shared/routing/Protected.jsx";

const SalonRegister = lazy(() => import("./pages/SalonRegister.jsx"));
const AdminVerify = lazy(() => import("./pages/AdminVerify.jsx"));
const CustomerInsights = lazy(() => import("./pages/CustomerInsights.jsx"));
const PlatformMonitoring = lazy(() => import("./pages/PlatformMonitoring.jsx"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics.jsx"));

export default [
  { 
    path: "/salon/register", 
    element: <RoleGate allow={["owner", "salon_owner"]}><SalonRegister /></RoleGate> 
  },
  { 
    path: "/admin/verify", 
    element: <RoleGate allow={["admin"]}><AdminVerify /></RoleGate> 
  },
  { 
    path: "/admin/customer-insights", 
    element: <RoleGate allow={["admin"]}><CustomerInsights /></RoleGate> 
  },
  { 
    path: "/admin/platform-monitoring", 
    element: <RoleGate allow={["admin"]}><PlatformMonitoring /></RoleGate> 
  },
  { 
    path: "/admin/analytics", 
    element: <RoleGate allow={["admin"]}><AdminAnalytics /></RoleGate> 
  },
];
