import { lazy } from "react";
import { RoleGate } from "../../shared/routing/Protected.jsx";

const Loyalty = lazy(() => import("../../pages/customer/Loyalty.jsx"));
const Profile = lazy(() => import("../../pages/customer/Profile.jsx"));

// Import existing booking pages
const SalonSearch = lazy(() => import("../booking/pages/SalonSearch.jsx"));
const SalonProfile = lazy(() => import("../booking/pages/SalonProfile.jsx"));
const Appointments = lazy(() => import("../booking/pages/Appointments.jsx"));

export default [
  { 
    path: "/customer/browse", 
    element: <RoleGate allow={["customer"]}><SalonSearch /></RoleGate> 
  },
  { 
    path: "/customer/salon/:id", 
    element: <RoleGate allow={["customer"]}><SalonProfile /></RoleGate> 
  },
  { 
    path: "/customer/appointments", 
    element: <RoleGate allow={["customer"]}><Appointments /></RoleGate> 
  },
  { 
    path: "/customer/loyalty", 
    element: <RoleGate allow={["customer"]}><Loyalty /></RoleGate> 
  },
  { 
    path: "/customer/profile", 
    element: <RoleGate allow={["customer"]}><Profile /></RoleGate> 
  },
];

