import { useState, useEffect } from "react";
import { isStrongPassword } from "../lib/validation.js";
import { mockResetPassword } from "../lib/mockApi.js";
import FormField from "../components/FormField.jsx";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isStrongPassword(password)) {
      setError("Password must be 8+ chars, include an uppercase letter and a number.");
      return;
    }

    setLoading(true);
    try {
      await mockResetPassword({ resetToken: token, newPassword: password });
      setSuccess("Password reset successful. You may now log in.");
    } catch (err) {
      setError(err?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Reset Password</h1>
      <p>Enter a new password for your account.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
        <FormField label="New Password" error={!!error && !isStrongPassword(password) ? "Must be 8+ chars, include uppercase and number." : ""}>
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

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset password"}
        </button>
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


