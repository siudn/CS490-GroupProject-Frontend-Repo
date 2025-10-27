// sample routes - write out your routes like this (replace the actual routes/elements with your pages)
import { lazy } from "react";
const MySchedule = lazy(() => import("./pages/MySchedule.jsx"));
const ShiftEditor = lazy(() => import("./pages/ShiftEditor.jsx"));

export default [
  { path: "/schedule", element: <MySchedule /> },
  { path: "/schedule/edit", element: <ShiftEditor /> },
];
