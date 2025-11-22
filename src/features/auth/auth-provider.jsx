import { createContext, useContext, useState, useEffect } from "react";
import { setAccessToken, setRefreshToken, clearTokens, getAccessToken } from "../../shared/api/client.js";

const AuthCtx = createContext(null);

/* ---------- REAL AUTH ---------- */
function RealAuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Login failed" }));
      throw new Error(errorData.error || "Login failed");
    }
    
    const data = await res.json(); // expect { access_token, refresh_token, user, ... }
    
    // Store tokens
    if (data.access_token) {
      setAccessToken(data.access_token);
    }
    if (data.refresh_token) {
      setRefreshToken(data.refresh_token);
    }
    
    // Set user from response
    const userData = data.user || { id: data.id, role: data.role, email: data.email };
    setUser(userData);
    return userData; // Return user data for role-based redirects
  };

  const logout = async () => {
    const token = getAccessToken();
    if (token) {
      try {
        await fetch(`${import.meta.env.VITE_API}/auth/logout`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
      } catch (error) {
        // Continue with logout even if API call fails
        console.error("Logout API call failed:", error);
      }
    }
    clearTokens();
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      const token = getAccessToken();
      if (!token) return;
      
      try {
        const r = await fetch(`${import.meta.env.VITE_API}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`
          },
        });
        if (r.ok) {
          const userData = await r.json();
          setUser(userData.user || userData);
        } else {
          // Token invalid, clear it
          clearTokens();
        }
      } catch (error) {
        // Network error or invalid token
        clearTokens();
      }
    })();
  }, []);

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

/* ---------- STUB (DEV) ---------- */
function StubAuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, _pw, role = "customer") => {
    await new Promise((r) => setTimeout(r, 200));
    const userData = { id: 1, role, email };
    setUser(userData);
    return userData; // Return user data for role-based redirects
  };
  const logout = async () => setUser(null);

  useEffect(() => {
    const role = new URLSearchParams(location.search).get("demo");
    if (role && !user) login("demo@example.com", "", role);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

/* ---------- SWITCH ---------- */
export function AuthProvider({ children }) {
  const mode = import.meta.env.VITE_AUTH_MODE || "real"; // 'stub' or 'real'
  const Provider = mode === "stub" ? StubAuthProvider : RealAuthProvider;
  return <Provider>{children}</Provider>;
}

export const useAuth = () => useContext(AuthCtx);
