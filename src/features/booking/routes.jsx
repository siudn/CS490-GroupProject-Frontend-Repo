import { lazy } from "react";
import { RoleGate, Protected } from "../../shared/routing/Protected.jsx";

const SalonSearch = lazy(() => import("./pages/SalonSearch.jsx"));
const SalonProfile = lazy(() => import("./pages/SalonProfile.jsx"));
const Appointments = lazy(() => import("./pages/Appointments.jsx"));
const VendorAppointments = lazy(() => import("./pages/VendorAppointments.jsx"));

export default [
  { 
    path: "/booking", 
    element: <Protected><SalonSearch /></Protected> 
  },
  { 
    path: "/booking/salon/:id", 
    element: <Protected><SalonProfile /></Protected> 
  },
  { 
    path: "/account/appointments", 
    element: <Protected><Appointments /></Protected> 
  },
  { 
    path: "/vendor/appointments", 
    element: <RoleGate allow={["owner", "salon_owner", "barber"]}><VendorAppointments /></RoleGate> 
  },
];
