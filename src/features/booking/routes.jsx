// sample routes - write out your routes like this (replace the actual routes/elements with your pages)
import { lazy } from "react";
const BrowseServices = lazy(() => import("./pages/BrowseServices.jsx"));
const BookingFlow = lazy(() => import("./pages/BookingFlow.jsx"));
const BookingConfirm = lazy(() => import("./pages/BookingConfirm.jsx"));

export default [
  { path: "/booking", element: <BrowseServices /> },
  { path: "/booking/new", element: <BookingFlow /> },
  { path: "/booking/confirm", element: <BookingConfirm /> },
];