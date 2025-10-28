import { lazy } from "react";
const SalonSearch = lazy(() => import("./pages/SalonSearch.jsx"));
const SalonProfile = lazy(() => import("./pages/SalonProfile.jsx"));
const Appointments = lazy(() => import("./pages/Appointments.jsx"));

export default [
  { path: "/booking", element: <SalonSearch /> },
  { path: "/booking/salon/:id", element: <SalonProfile /> },
  { path: "/account/appointments", element: <Appointments /> },
];
