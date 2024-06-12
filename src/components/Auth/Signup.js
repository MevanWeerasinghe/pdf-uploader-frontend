import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api";

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display error message */}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Signup</button>
      </form>
      <p onClick={() => navigate("/login")}>login</p>
    </div>
  );
};

export default Signup;
