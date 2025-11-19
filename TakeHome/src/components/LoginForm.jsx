import React, { useState } from "react";

const API_URL = "http://localhost:5000";

function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // If backend not reachable or URL wrong
      if (!res.ok) {
        const text = await res.text(); // might be HTML on 404
        console.error("Login error response:", res.status, text);
        setMessage(`Login failed (${res.status}). Check server URL.`);
        return;
      }

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Login failed");
        return;
      }

      setMessage("Login successful ✅");
      onSuccess(data.token, data.user);
    } catch (err) {
      console.error("Login request failed:", err);
      setMessage("Cannot connect to server. Please try again.");
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      {message && <p className="msg">{message}</p>}
    </div>
  );
}

export default LoginForm;
