import React, { useState } from "react";

const API_URL = "http://localhost:5000";

function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [teacherId, setTeacherId] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("Registering...");

    try {
      const body = {
        email,
        password,
        role,
      };

      // backend requires teacherId ONLY for student
      if (role === "student") {
        body.teacherId = teacherId;
      }

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setMessage("Registered! Please login.");
      onRegister(); // switch to login tab in App.jsx
    } catch (err) {
      console.error(err);
      setMessage("Registration failed. Try again.");
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
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

        <div className="field">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {role === "student" && (
          <div className="field">
            <label>Teacher ID</label>
            <input
              type="text"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              placeholder="Mongo _id of teacher"
              required
            />
          </div>
        )}

        <button type="submit">Register</button>
      </form>

      {message && <p className="msg">{message}</p>}
    </div>
  );
}

export default RegisterForm;
