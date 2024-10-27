import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLoginClick = async (e) => {
    e.preventDefault(); // Prevent form submission behavior

    setError(""); // Reset error before each login attempt

    // Create login payload
    const loginData = {
      name: username,
      password: password,
    };

    try {
      // POST na server či je aktivny (na databazu)
      const response = await fetch("http://localhost:3003/login", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isAuthenticated", "true"); // pri spravnom logine nastavi na true(z dovodu aby si clovek nemohol dat len /Main do url)
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log('Login user data:', data.user); 
        navigate("/Main");
      }
       else {
        // pri zlom logine 
        setError(data.message || "Nesprávne meno alebo heslo");
      }
    } catch (err) {
      // fetch alebo network error
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
