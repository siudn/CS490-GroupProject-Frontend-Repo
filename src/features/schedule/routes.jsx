import { lazy } from "react";
import { RoleGate } from "../../shared/routing/Protected.jsx";

const ProviderDashboard = lazy(() => import("./pages/ProviderDashboard.jsx"));
const MySchedule = lazy(() => import("./pages/MySchedule.jsx"));
const ShiftEditor = lazy(() => import("./pages/ShiftEditor.jsx"));

export default [
  { 
    path: "/schedule", 
    element: <RoleGate allow={["owner", "salon_owner", "barber"]}><ProviderDashboard /></RoleGate> 
  },
  { 
    path: "/schedule/view", 
    element: <RoleGate allow={["owner", "salon_owner", "barber"]}><MySchedule /></RoleGate> 
  },
  { 
    path: "/schedule/edit", 
    element: <RoleGate allow={["owner", "salon_owner", "barber"]}><ShiftEditor /></RoleGate> 
  },
];
