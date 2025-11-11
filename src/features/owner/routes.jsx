import { lazy } from "react";
import { RoleGate } from "../../shared/routing/Protected.jsx";

const OwnerDashboard = lazy(() => import("../../pages/owner/OwnerDashboard.jsx"));
const Customers = lazy(() => import("../../pages/owner/Customers.jsx"));
const LoyaltyProgram = lazy(() => import("../../pages/owner/LoyaltyProgram.jsx"));
const MyShop = lazy(() => import("../../pages/owner/MyShop.jsx"));
const Payments = lazy(() => import("../../pages/owner/Payments.jsx"));

// Import existing salon registration
const SalonRegister = lazy(() => import("../salon-reg/pages/SalonRegister.jsx"));

export default [
  { 
    path: "/owner/dashboard", 
    element: <RoleGate allow={["owner"]}><OwnerDashboard /></RoleGate> 
  },
  { 
    path: "/owner/register", 
    element: <RoleGate allow={["owner"]}><SalonRegister /></RoleGate> 
  },
  { 
    path: "/owner/customers", 
    element: <RoleGate allow={["owner"]}><Customers /></RoleGate> 
  },
  { 
    path: "/owner/loyalty", 
    element: <RoleGate allow={["owner"]}><LoyaltyProgram /></RoleGate> 
  },
  { 
    path: "/owner/shop", 
    element: <RoleGate allow={["owner"]}><MyShop /></RoleGate> 
  },
  { 
    path: "/owner/payments", 
    element: <RoleGate allow={["owner"]}><Payments /></RoleGate> 
  },
];

