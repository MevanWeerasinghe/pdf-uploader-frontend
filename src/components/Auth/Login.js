import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api"; // Ensure you import your axios instance

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
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {usernameError && <p className="text-red-500">{usernameError}</p>}
          {/* Display username error */}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}
          {/* Display password error */}
        </div>
        <button type="submit">Login</button>
      </form>
      <p onClick={() => navigate("/signup")}>Signup</p>
    </div>
  );
};

export default Login;
