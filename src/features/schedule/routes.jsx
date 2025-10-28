import { lazy } from "react";
const ProviderDashboard = lazy(() => import("./pages/ProviderDashboard.jsx"));
const MySchedule = lazy(() => import("./pages/MySchedule.jsx"));
const ShiftEditor = lazy(() => import("./pages/ShiftEditor.jsx"));

export default [
  { path: "/schedule", element: <ProviderDashboard /> },
  { path: "/schedule/view", element: <MySchedule /> },
  { path: "/schedule/edit", element: <ShiftEditor /> },
];
