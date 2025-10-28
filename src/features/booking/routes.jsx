import { lazy } from "react";
const SalonSearch = lazy(() => import("./pages/SalonSearch.jsx"));

export default [
  { path: "/booking", element: <SalonSearch /> },
];
