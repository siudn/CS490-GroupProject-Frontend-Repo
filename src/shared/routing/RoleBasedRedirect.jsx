import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-provider.jsx";

export function RoleBasedRedirect() {
  const { user } = useAuth();
  
  // If not logged in, go to sign-in
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  
  // Redirect based on role
  const roleRedirects = {
    customer: "/customer/browse",
    owner: "/owner/dashboard",
    barber: "/barber/schedule",
    admin: "/admin/dashboard",
  };
  
  const destination = roleRedirects[user.role] || "/auth/sign-in";
  return <Navigate to={destination} replace />;
}

