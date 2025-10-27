import { useState } from "react";
import { isValidEmail } from "../lib/validation.js";
import { mockRequestPasswordReset } from "../lib/mockApi.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
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

    setLoading(true);
    try {
      const res = await mockRequestPasswordReset(email);
      setSuccess(
        `If an account exists, a reset link was sent. For testing, use the mock link below.`
      );
    } catch (err) {
      setError(err?.message || "Unable to process request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Forgot Password</h1>
      <p>Enter your account email to receive a reset link.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
        <label>
          <div>Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{ border: error ? "1px solid #ef4444" : "1px solid #d1d5db", padding: 10, borderRadius: 6, width: "100%" }}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      {error && (
        <div role="alert" style={{ marginTop: 16, padding: 12, background: "#fef2f2", border: "1px solid #ef4444", color: "#991b1b" }}>
          {error}
        </div>
      )}

      {success && (
        <div role="status" style={{ marginTop: 16, padding: 12, background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46" }}>
          <div style={{ marginBottom: 8 }}>{success}</div>
          <a href="/reset?token=mock-reset-token">Open mock reset link</a>
        </div>
      )}
    </div>
  );
}


