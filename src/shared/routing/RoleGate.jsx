import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-provider.jsx";

export function RoleGate({ allow, children }) {
  const { user } = useAuth();
  const loc = useLocation();
  
  // Redirect to sign-in if not logged in
  if (!user) {
    return <Navigate to="/auth/sign-in" replace state={{ from: loc }} />;
  }
  
  // Check if user has allowed role
  if (!allow.includes(user.role)) {
    // Redirect to appropriate page based on their actual role
    const roleRedirects = {
      customer: "/browse",
      owner: "/salon-dashboard",
      salon_owner: "/salon-dashboard",
      barber: "/schedule",
      admin: "/admin/dashboard",
    };
    return <Navigate to={roleRedirects[user.role] || "/"} replace />;
  }
  
  return children;
}
