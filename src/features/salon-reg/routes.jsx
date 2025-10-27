// sample routes - write out your routes like this (replace the actual routes/elements with your pages)
import { lazy } from "react";
const SalonRegister = lazy(() => import("./pages/SalonRegister.jsx"));
const PendingReview = lazy(() => import("./pages/PendingReview.jsx"));
const AdminVerify = lazy(() => import("./pages/AdminVerify.jsx"));

export default [
  { path: "/salon/register", element: <SalonRegister /> },
  { path: "/salon/pending", element: <PendingReview /> },
  { path: "/admin/verify", element: <AdminVerify /> },
];
