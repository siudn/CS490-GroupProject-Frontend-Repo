import { lazy } from "react";
import { RoleGate } from "../../shared/routing/RoleGate.jsx";

const SalonSearch = lazy(() => import("./pages/SalonSearch.jsx"));
const SalonProfile = lazy(() => import("./pages/SalonProfile.jsx"));
const Appointments = lazy(() => import("./pages/Appointments.jsx"));
const VendorAppointments = lazy(() => import("./pages/VendorAppointments.jsx"));

export default [
  {
    path: "/browse",
    element: <RoleGate allow={["customer"]}><SalonSearch /></RoleGate>,
  },
  {
    path: "/salon/:id",
    element: <RoleGate allow={["customer"]}><SalonProfile /></RoleGate>,
  },
  {
    path: "/appointments",
    element: <RoleGate allow={["customer"]}><Appointments /></RoleGate>,
  },
  {
    path: "/appointments/manage",
    element: <RoleGate allow={["owner", "salon_owner", "barber"]}><VendorAppointments /></RoleGate>,
  },
];
