import { lazy } from "react";
import { RoleGate } from "../../shared/routing/RoleGate.jsx";

const CustomerLoyalty = lazy(() => import("./pages/CustomerLoyalty.jsx"));
const LoyaltyProgram = lazy(() => import("./pages/LoyaltyProgram.jsx"));

export default [
  {
    path: "/rewards",
    element: <RoleGate allow={["customer"]}><CustomerLoyalty /></RoleGate>,
  },
  {
    path: "/loyalty-program",
    element: <RoleGate allow={["owner", "salon_owner"]}><LoyaltyProgram /></RoleGate>,
  },
];
