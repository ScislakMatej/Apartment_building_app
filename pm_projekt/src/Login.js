import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate(); // Initialize the navigation hook
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For showing login error messages

  const handleLoginClick = async (e) => {
    e.preventDefault(); // Prevent form submission behavior

    setError(""); // Reset error before each login attempt

    // Create login payload
    const loginData = {
      name: username,
      password: password,
    };

    try {
      // Send a POST request to the server to verify the credentials
      const response = await fetch("http://localhost:3001/login", { // Adjusted to the server's URL and port
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, navigate to the main page
        navigate("/Main");
      } else {
        // If login fails, display the error message
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      // Handle fetch or network errors
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icon">
          <img src="./Profile.svg" alt="User Icon" />
        </div>
        <form className="login-form" onSubmit={handleLoginClick}>
          <input
            type="text"
            placeholder="Prihlasovanie meno"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Prihlásiť sa</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p className="address">Podivínska 12 Košice</p>
      </div>
    </div>
  );
}

export default Login;
