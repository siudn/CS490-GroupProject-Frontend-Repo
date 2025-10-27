import { createContext, useContext, useState, useEffect } from "react";

const AuthCtx = createContext(null);

/* ---------- REAL AUTH ---------- */
function RealAuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json(); // expect { id, role, email }
    setUser(data);
  };

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${import.meta.env.VITE_API}/auth/me`, {
          credentials: "include",
        });
        if (r.ok) setUser(await r.json());
      } catch {}
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
    setUser({ id: 1, role, email });
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
