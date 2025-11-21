import { lazy } from "react";
import { RoleGate } from "../../shared/routing/RoleGate.jsx";

const SalonRegister = lazy(() => import("./pages/SalonRegister.jsx"));

export default [
  {
    path: "/salon-registration",
    element: <RoleGate allow={["owner", "salon_owner"]}><SalonRegister /></RoleGate>,
  },
];
