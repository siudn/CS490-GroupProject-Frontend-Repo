import { lazy } from "react";
const SalonRegister = lazy(() => import("./pages/SalonRegister.jsx"));
const AdminVerify = lazy(() => import("./pages/AdminVerify.jsx"));
const CustomerInsights = lazy(() => import("./pages/CustomerInsights.jsx"));
const PlatformMonitoring = lazy(() => import("./pages/PlatformMonitoring.jsx"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics.jsx"));

export default [
  { path: "/salon/register", element: <SalonRegister /> },
  { path: "/admin/verify", element: <AdminVerify /> },
  { path: "/admin/customer-insights", element: <CustomerInsights /> },
  { path: "/admin/platform-monitoring", element: <PlatformMonitoring /> },
  { path: "/admin/analytics", element: <AdminAnalytics /> },
];
