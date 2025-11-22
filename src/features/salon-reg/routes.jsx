import { lazy } from "react";
import { RoleGate } from "../../shared/routing/RoleGate.jsx";

const SalonRegister = lazy(() => import("./pages/SalonRegister.jsx"));
const SalonSetup = lazy(() => import("./pages/SalonSetup.jsx"));

export default [
  {
    path: "/salon-registration",
    element: <RoleGate allow={["owner", "salon_owner"]}><SalonRegister /></RoleGate>,
  },
  {
    path: "/salon-setup",
    element: <RoleGate allow={["owner", "salon_owner"]}><SalonSetup /></RoleGate>,
  },
];
