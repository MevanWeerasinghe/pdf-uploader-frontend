import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api";
import "../../styles/auth.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setPasswordError("");

    try {
      const response = await API.post("/auth/login", {
        // Use the imported API instance
        username,
        password,
      });
      setToken(response.data.token);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "Invalid username") {
          setUsernameError(errorMessage);
        } else if (errorMessage === "password is incorrect") {
          setPasswordError(errorMessage);
        }
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-header">Login</h1>
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
          {usernameError && <p className="username-error">{usernameError}</p>}
          {/* Display username error */}
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
          {passwordError && <p className="password-error">{passwordError}</p>}
          {/* Display password error */}
        </div>
        <button className="auth-button" type="submit">
          Login
        </button>
      </form>
      <p className="switch-link" onClick={() => navigate("/signup")}>
        Click here to Signup
      </p>
    </div>
  );
};

export default Login;
