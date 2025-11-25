import { lazy } from "react";

const NotificationsPage = lazy(() => import("./pages/NotificationsPage.jsx"));

export default [
  {
    path: "/notifications",
    element: <NotificationsPage />,
  },
];

