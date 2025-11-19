import React, { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm.jsx";
import RegisterForm from "./components/Registration.jsx";
import Dashboard from "./components/Dashboard.jsx";
import "./App.css";



function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login"); // login | register

  // -------------------------------------------------------
  // SAFE LocalStorage Loader (Fixes React Strict Mode error)
  // -------------------------------------------------------
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!savedToken || !savedUser) return;

    let parsedUser = null;

    try {
      parsedUser = JSON.parse(savedUser);
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      localStorage.removeItem("user");
      return;
    }

    // Delay state update to avoid synchronous setState warning
    setTimeout(() => {
      setToken(savedToken);
      setUser(parsedUser);
    }, 0);
  }, []);

  // -------------------------------------------------------
  // Handle login success
  // -------------------------------------------------------
  const handleLoginSuccess = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  // -------------------------------------------------------
  // Logout handler
  // -------------------------------------------------------
  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.clear();
  };

  // -------------------------------------------------------
  // If not logged in -> show login/register
  // -------------------------------------------------------
  if (!token) {
    return (
      <div className="app">
        <h1>EdTech Task Manager</h1>

        <div className="toggle">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <LoginForm onSuccess={handleLoginSuccess} />
        ) : (
          <RegisterForm onRegister={() => setMode("login")} />
        )}
      </div>
    );
  }

  // -------------------------------------------------------
  // Logged in -> show dashboard
  // -------------------------------------------------------
  return <Dashboard user={user} token={token} onLogout={handleLogout} />;
}

export default App;
