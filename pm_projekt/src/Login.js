import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate(); // Initialize the navigation hook

  const handleLoginClick = (e) => {
    e.preventDefault(); // Prevent form submission behavior
    navigate("/Main"); // Navigate to the Cigan page
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icon">
          <img src="./Profile.svg" alt="User Icon" />{" "}
        </div>
        <form className="login-form" onSubmit={handleLoginClick}>
          <input type="text" placeholder="Prihlasovanie meno" required />
          <input type="password" placeholder="Heslo" required />
          <button type="submit">Prihlásiť sa</button>
        </form>
        <p className="address">Podivínska 12 Košice</p>
      </div>
    </div>
  );
}

export default Login;
