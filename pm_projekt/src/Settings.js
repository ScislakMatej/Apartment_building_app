import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Settings.css";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [currentEmail, setCurrentEmail] = useState(user.email || "");
  const [newEmail, setNewEmail] = useState("");
  const [oldPasswordForEmail, setOldPasswordForEmail] = useState("");
  const [oldPasswordForPasswordChange, setOldPasswordForPasswordChange] =
    useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/";
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!oldPasswordForEmail) {
      alert("Staré heslo je potrebné na zmenu e-mailu!");
      return;
    }
    console.log("Old Password:", oldPasswordForEmail);
    console.log("Email updated to:", newEmail);
    alert("E-mail bol úspešne zmenený.");
    setNewEmail("");
    setOldPasswordForEmail("");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!oldPasswordForPasswordChange) {
      alert("Staré heslo je potrebné na zmenu hesla!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Heslá sa nezhodujú!");
      return;
    }
    console.log("Old Password:", oldPasswordForPasswordChange);
    console.log("Password updated successfully.");
    alert("Heslo bolo úspešne zmenené.");
    setOldPasswordForPasswordChange("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="settings-page">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={handleLogout} />
        <div className="settings-content">
          <h1>Nastavenia</h1>
          <form className="settings-form" onSubmit={handleEmailSubmit}>
            <h2>Zmena e-mailu</h2>
            <div className="current-email">
              <strong>Aktuálny e-mail:</strong> {currentEmail}
            </div>
            <label>
              Nový e-mail
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="input-field"
                placeholder="Zadajte nový e-mail"
                required
              />
            </label>
            <label>
              Staré heslo
              <input
                type="password"
                value={oldPasswordForEmail}
                onChange={(e) => setOldPasswordForEmail(e.target.value)}
                className="input-field"
                placeholder="Zadajte staré heslo"
                required
              />
            </label>
            <button type="submit" className="save-btn">
              Zmeniť e-mail
            </button>
          </form>
          <hr />
          <form className="settings-form" onSubmit={handlePasswordSubmit}>
            <h2>Zmena hesla</h2>
            <label>
              Staré heslo
              <input
                type="password"
                value={oldPasswordForPasswordChange}
                onChange={(e) =>
                  setOldPasswordForPasswordChange(e.target.value)
                }
                className="input-field"
                placeholder="Zadajte staré heslo"
                required
              />
            </label>
            <label>
              Nové heslo
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="Zadajte nové heslo"
                required
              />
            </label>
            <label>
              Potvrdenie hesla
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="Zopakujte nové heslo"
                required
              />
            </label>
            <button type="submit" className="save-btn">
              Zmeniť heslo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
