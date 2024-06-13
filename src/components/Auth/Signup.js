import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api";
import "../../styles/auth.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to store error message
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await API.post("/auth/signup", {
        username,
        password,
      });
      setToken(response.data.token);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Capture the error message from the response
        setError(error.response.data.message);
      } else {
        // Log unexpected errors to console
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-header">Signup</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="uername-sec">
          <label className="username-label">Username</label>
          <input
            type="text"
            className="username-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {error && <p className="username-error">{error}</p>}{" "}
          {/* Display error message */}
        </div>
        <div className="password-sec">
          <label className="password-label">Password</label>
          <input
            type="password"
            className="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Signup
        </button>
      </form>
      <p className="switch-link" onClick={() => navigate("/login")}>
        Click here to Login
      </p>
    </div>
  );
};

export default Signup;
