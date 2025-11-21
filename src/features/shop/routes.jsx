import { lazy } from "react";
import { RoleGate } from "../../shared/routing/RoleGate.jsx";

const MyShop = lazy(() => import("./pages/MyShop.jsx"));

export default [
  {
    path: "/retail",
    element: <RoleGate allow={["owner", "salon_owner"]}><MyShop /></RoleGate>,
  },
];
