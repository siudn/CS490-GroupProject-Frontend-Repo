import { lazy } from "react";

const Home = lazy(() => import("./pages/Home.jsx"));

export default [
  { index: true, element: <Home /> },
];
