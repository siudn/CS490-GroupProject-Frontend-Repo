import { useState } from "react";
import { isValidEmail, isStrongPassword } from "../lib/validation.js";
import { mockRegister } from "../lib/mockApi.js";
import FormField from "../components/FormField.jsx";
import { setFlash } from "../lib/flash.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isStrongPassword(password)) {
      setError("Password must be 8+ chars, include an uppercase letter and a number.");
      return;
    }

    setLoading(true);
    try {
      await mockRegister({ email, password, accountType });
      setFlash("Registration successful. Please sign in.", "success");
      navigate('/login');
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <p>Create your account to start booking or managing your salon.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
        <FormField label="Email" error={!!error && !isValidEmail(email) ? "Enter a valid email." : ""}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            aria-invalid={!!error && !isValidEmail(email)}
            style={{ border: !!error && !isValidEmail(email) ? "1px solid #ef4444" : "1px solid #d1d5db", padding: 10, borderRadius: 6, width: "100%" }}
          />
        </FormField>

        <FormField label="Password" error={!!error && !isStrongPassword(password) ? "Must be 8+ chars, include uppercase and number." : ""}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            aria-invalid={!!error && !isStrongPassword(password)}
            style={{ border: !!error && !isStrongPassword(password) ? "1px solid #ef4444" : "1px solid #d1d5db", padding: 10, borderRadius: 6, width: "100%" }}
          />
        </FormField>

        <label>
          <div>Account Type</div>
          <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
            <option value="user">User</option>
            <option value="barber">Barber</option>
            <option value="owner">Owner</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
      </form>

      {error && (
        <div role="alert" style={{ marginTop: 16, padding: 12, background: "#fef2f2", border: "1px solid #ef4444", color: "#991b1b" }}>
          {error}
        </div>
      )}

      {success && (
        <div role="status" style={{ marginTop: 16, padding: 12, background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46" }}>
          {success}
        </div>
      )}
    </div>
  );
}


