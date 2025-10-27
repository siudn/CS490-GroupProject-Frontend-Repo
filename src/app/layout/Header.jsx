import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md font-semibold transition-colors duration-150 ${
    isActive ? "bg-indigo-100 text-indigo-700" : "text-gray-700 hover:bg-gray-100"
  }`;

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center gap-4 p-4">
        <div className="text-lg font-extrabold text-indigo-600">SalonApp</div>
        <nav className="flex gap-2">
          <NavLink to="/auth/sign-in" className={linkClass}>Sign In</NavLink>
          <NavLink to="/auth/sign-up" className={linkClass}>Sign Up</NavLink>
          <NavLink to="/salon/register" className={linkClass}>Salon Register</NavLink>
          <NavLink to="/booking" className={linkClass}>Booking</NavLink>
          <NavLink to="/schedule" className={linkClass}>Schedule</NavLink>
        </nav>
      </div>
    </header>
  );
}