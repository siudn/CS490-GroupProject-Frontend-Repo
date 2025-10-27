import { clearSession, isAuthenticated } from "../lib/session.js";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();
  if (!isAuthenticated()) return null;
  function onLogout() {
    clearSession();
    navigate('/login');
  }
  return (
    <button onClick={onLogout} style={{ padding: 8, borderRadius: 6, border: '1px solid #d1d5db', background: '#fff' }}>
      Logout
    </button>
  );
}


