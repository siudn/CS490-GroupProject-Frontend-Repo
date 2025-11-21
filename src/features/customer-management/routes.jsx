import { lazy } from "react";
import { RoleGate } from "../../shared/routing/RoleGate.jsx";

const Customers = lazy(() => import("./pages/Customers.jsx"));

export default [
  {
    path: "/clients",
    element: <RoleGate allow={["owner", "salon_owner"]}><Customers /></RoleGate>,
  },
];
