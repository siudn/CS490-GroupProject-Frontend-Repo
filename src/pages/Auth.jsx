import { useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ForgotPassword from "./ForgotPassword.jsx";

export default function Auth() {
  const [tab, setTab] = useState('signin');

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={{ fontWeight: 600, fontSize: 18, color: '#111827' }}>Salonica</div>
        <p style={{ margin: '8px 0 16px', color: '#6b7280' }}>Manage your salon appointments and loyalty rewards</p>

        <div style={styles.tabs}>
          <button onClick={() => setTab('signin')} style={tab === 'signin' ? styles.tabActive : styles.tab}>Sign In</button>
          <button onClick={() => setTab('signup')} style={tab === 'signup' ? styles.tabActive : styles.tab}>Sign Up</button>
          <button onClick={() => setTab('reset')} style={tab === 'reset' ? styles.tabActive : styles.tab}>Reset</button>
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

const styles = {
  wrap: {
    minHeight: 'calc(100vh - 64px)',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(180deg,#f5e9ff,#f7efff)'
  },
  card: {
    width: 480,
    maxWidth: '92vw',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 2px 10px rgba(17,24,39,0.06)'
  },
  tabs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 8,
    background: '#f3f4f6',
    padding: 6,
    borderRadius: 12
  },
  tab: {
    border: 'none',
    background: 'transparent',
    padding: '8px 10px',
    borderRadius: 10,
    cursor: 'pointer',
    color: '#374151'
  },
  tabActive: {
    border: 'none',
    background: '#fff',
    padding: '8px 10px',
    borderRadius: 10,
    cursor: 'pointer',
    color: '#111827',
    boxShadow: '0 1px 3px rgba(17,24,39,0.06)'
  }
};


