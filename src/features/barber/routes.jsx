import { lazy } from "react";
import { RoleGate } from "../../shared/routing/Protected.jsx";

// Import existing schedule pages
const MySchedule = lazy(() => import("../schedule/pages/MySchedule.jsx"));
const ProviderDashboard = lazy(() => import("../schedule/pages/ProviderDashboard.jsx"));
const ShiftEditor = lazy(() => import("../schedule/pages/ShiftEditor.jsx"));

export default [
  { 
    path: "/barber/schedule", 
    element: <RoleGate allow={["barber"]}><ProviderDashboard /></RoleGate> 
  },
  { 
    path: "/barber/schedule/view", 
    element: <RoleGate allow={["barber"]}><MySchedule /></RoleGate> 
  },
  { 
    path: "/barber/schedule/edit", 
    element: <RoleGate allow={["barber"]}><ShiftEditor /></RoleGate> 
  },
];

