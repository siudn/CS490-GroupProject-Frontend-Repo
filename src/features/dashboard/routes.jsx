import { lazy } from "react";
import { RoleGate } from "../../shared/routing/RoleGate.jsx";

const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard.jsx"));

export default [
  {
    path: "/salon-dashboard",
    element: <RoleGate allow={["owner", "salon_owner"]}><OwnerDashboard /></RoleGate>,
  },
];
