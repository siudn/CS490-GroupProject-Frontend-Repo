import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("user");
  const [success, setSuccess] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setSuccess("Registration successful. You may now log in.");
  }

  return (
    <div>
      <h1>Register</h1>
      <p>Create your account to start booking or managing your salon.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
        <label>
          <div>Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          <div>Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <label>
          <div>Account Type</div>
          <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
            <option value="user">User</option>
            <option value="barber">Barber</option>
            <option value="owner">Owner</option>
          </select>
        </label>

        <button type="submit">Create account</button>
      </form>

      {success && (
        <div role="status" style={{ marginTop: 16, padding: 12, background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46" }}>
          {success}
        </div>
      )}
    </div>
  );
}


