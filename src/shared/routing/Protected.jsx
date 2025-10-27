import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-provider.jsx";

export function Protected({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/auth/sign-in" replace state={{ from: loc }} />;
  return children;
}

export function RoleGate({ allow, children }) {
  const { user } = useAuth();
  if (!user) return null;
  return allow.includes(user.role) ? children : <Navigate to="/auth/sign-in" replace />;
}
