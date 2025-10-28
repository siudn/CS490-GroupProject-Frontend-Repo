import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/auth-provider.jsx";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md font-semibold transition-colors duration-150 ${
    isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
  }`;

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-4">
          <div className="text-lg font-extrabold text-indigo-600">Salonica</div>
          <nav className="flex gap-2">
            <NavLink to="/booking" className={linkClass}>Booking</NavLink>
            <NavLink to="/schedule" className={linkClass}>Schedule</NavLink>
            <NavLink to="/salon/register" className={linkClass}>Salon Register</NavLink>
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