import { lazy } from "react";
import { RoleGate } from "../../shared/routing/RoleGate.jsx";

const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard.jsx"));
const SalonSettings = lazy(() => import("./pages/SalonSettings.jsx"));
const Customers = lazy(() => import("./pages/Customers.jsx"));
const Employees = lazy(() => import("./pages/Employees.jsx"));

export default [
  {
    path: "/salon-dashboard",
    element: <RoleGate allow={["owner", "salon_owner"]}><OwnerDashboard /></RoleGate>,
  },
  {
    path: "/salon-settings",
    element: <RoleGate allow={["owner", "salon_owner"]}><SalonSettings /></RoleGate>,
  },
  {
    path: "/clients",
    element: <RoleGate allow={["owner", "salon_owner"]}><Customers /></RoleGate>,
  },
  {
    path: "/employees",
    element: <RoleGate allow={["owner", "salon_owner"]}><Employees /></RoleGate>,
  },
];
