import { lazy } from "react";
const SalonSearch = lazy(() => import("./pages/SalonSearch.jsx"));
const SalonProfile = lazy(() => import("./pages/SalonProfile.jsx"));
const Appointments = lazy(() => import("./pages/Appointments.jsx"));
const VendorAppointments = lazy(() => import("./pages/VendorAppointments.jsx"));

export default [
  { path: "/booking", element: <SalonSearch /> },
  { path: "/booking/salon/:id", element: <SalonProfile /> },
  { path: "/account/appointments", element: <Appointments /> },
  { path: "/vendor/appointments", element: <VendorAppointments /> },
];
