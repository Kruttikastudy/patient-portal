import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "@fontsource-variable/bricolage-grotesque";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Login = () => {
  console.log("Environment variable:", process.env.REACT_APP_API_BASE_URL);
  console.log("API_BASE_URL being used:", API_BASE_URL);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid Username or Password");
      }

      const { patientId, fullName, firstName } = result.data || {};

      if (!patientId) {
        throw new Error("Patient record is missing an identifier.");
      }
      localStorage.setItem("currentPatientId", patientId);
      localStorage.setItem("currentPatientName", fullName || firstName || "");

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-panel">
        <h1>SSPD</h1>
        <h2>Patient Portal</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="forgot-password" onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </p>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;