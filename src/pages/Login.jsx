import { useState } from "react";
import { isValidEmail } from "../lib/validation.js";
import { mockLogin } from "../lib/mockApi.js";
import { saveSession } from "../lib/session.js";
import { useNavigate } from "react-router-dom";
import FormField from "../components/FormField.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const res = await mockLogin({ email, password });
      saveSession(res);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = (hasError) => ({
    border: hasError ? "1px solid #ef4444" : "1px solid #d1d5db",
    padding: 10,
    borderRadius: 6,
    width: "100%",
  });

  return (
    <div>
      <h1>Login</h1>
      <p>Enter your credentials to continue.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
        <FormField label="Email" error={!!error && !isValidEmail(email) ? "Enter a valid email." : ""}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={inputStyle(!!error && !isValidEmail(email))}
            required
            aria-invalid={!!error && !isValidEmail(email)}
          />
        </FormField>

        <FormField label="Password" error={!!error && !password ? "Password is required." : ""}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle(!!error && !password)}
            required
            aria-invalid={!!error && !password}
          />
        </FormField>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error && (
        <div role="alert" style={{ marginTop: 16, padding: 12, background: "#fef2f2", border: "1px solid #ef4444", color: "#991b1b" }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <a href="/forgot">Forgot your password?</a>
      </div>
    </div>
  );
}


