import { useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ForgotPassword from "./ForgotPassword.jsx";

export default function Auth() {
  const [tab, setTab] = useState('signin');

  return (
    <div className="wrap-center">
      <div className="card" style={{ width: 480, maxWidth: '92vw' }}>
        <div style={{ fontWeight: 600, fontSize: 18, color: '#111827' }}>Salonica</div>
        <p style={{ margin: '8px 0 16px', color: '#6b7280' }}>Manage your salon appointments and loyalty rewards</p>

        <div className="segmented">
          <button onClick={() => setTab('signin')} className={tab === 'signin' ? 'active' : ''}>Sign In</button>
          <button onClick={() => setTab('signup')} className={tab === 'signup' ? 'active' : ''}>Sign Up</button>
          <button onClick={() => setTab('reset')} className={tab === 'reset' ? 'active' : ''}>Reset</button>
        </div>

        <div style={{ marginTop: 12 }}>
          {tab === 'signin' && <Login />}
          {tab === 'signup' && <Register />}
          {tab === 'reset' && <ForgotPassword />}
        </div>
      </div>
    </div>
  );
}


