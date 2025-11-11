import { Navigate } from "react-router-dom";
import authRoutes from "../features/auth/routes.jsx";
import customerRoutes from "../features/customer/routes.jsx";
import ownerRoutes from "../features/owner/routes.jsx";
import barberRoutes from "../features/barber/routes.jsx";
import adminRoutes from "../features/admin/routes.jsx";
import NotFound from "./NotFound.jsx";
import { RoleBasedRedirect } from "../shared/routing/RoleBasedRedirect.jsx";
import Home from "../pages/Home.jsx";

export default [
    { index: true, element: <Home /> },
    ...authRoutes,
    ...customerRoutes,
    ...ownerRoutes,
    ...barberRoutes,
    ...adminRoutes,
    { path: "*", element: <NotFound /> },
];