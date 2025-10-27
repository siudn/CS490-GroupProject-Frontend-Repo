import { Navigate } from "react-router-dom";
import authRoutes from "../features/auth/routes.jsx";
import salonAdminRoutes from "../features/salon-reg/routes.jsx";
import bookingRoutes from "../features/booking/routes.jsx";
import scheduleRoutes from "../features/schedule/routes.jsx";
import NotFound from "./NotFound.jsx";

export default [
    { index: true, element: <Navigate to="/auth/sign-in" replace /> },
    ...authRoutes,
    ...salonAdminRoutes,
    ...bookingRoutes,
    ...scheduleRoutes,
    { path: "*", element: <NotFound /> },
];