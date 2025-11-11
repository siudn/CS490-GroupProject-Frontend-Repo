import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-provider.jsx";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md font-semibold transition-colors duration-150 ${
    isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
  }`;

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Role-based navigation links
  const getNavLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case "customer":
        return (
          <>
            <NavLink to="/customer/browse" className={linkClass}>Browse Salons</NavLink>
            <NavLink to="/customer/appointments" className={linkClass}>My Appointments</NavLink>
            <NavLink to="/customer/loyalty" className={linkClass}>Loyalty</NavLink>
            <NavLink to="/customer/profile" className={linkClass}>Profile</NavLink>
          </>
        );
      case "owner":
        return (
          <>
            <NavLink to="/owner/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/owner/register" className={linkClass}>Registration</NavLink>
            <NavLink to="/owner/customers" className={linkClass}>Customers</NavLink>
            <NavLink to="/owner/loyalty" className={linkClass}>Loyalty Program</NavLink>
            <NavLink to="/owner/shop" className={linkClass}>My Shop</NavLink>
            <NavLink to="/owner/payments" className={linkClass}>Payments</NavLink>
          </>
        );
      case "barber":
        return (
          <>
            <NavLink to="/barber/schedule" className={linkClass}>My Schedule</NavLink>
          </>
        );
      case "admin":
        return (
          <>
            <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/admin/verify" className={linkClass}>Salon Verification</NavLink>
            <NavLink to="/admin/analytics" className={linkClass}>Analytics</NavLink>
            <NavLink to="/admin/health" className={linkClass}>Platform Health</NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="text-lg font-extrabold text-indigo-600 hover:text-indigo-700">
            Salonica
          </NavLink>
          <nav className="flex gap-2">
            {getNavLinks()}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md font-semibold text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <nav className="flex gap-2">
              <NavLink to="/auth/sign-in" className={linkClass}>Sign In</NavLink>
              <NavLink to="/auth/sign-up" className={linkClass}>Sign Up</NavLink>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}