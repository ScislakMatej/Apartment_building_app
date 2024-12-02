import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Settings.css";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [currentEmail] = useState(user.email || "");
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!oldPassword) {
      alert("Staré heslo je potrebné na uloženie zmien!");
      return;
    }

    if (!newEmail && !newPassword) {
      alert("Musíte zadať nový e-mail alebo nové heslo.");
      return;
    }

    if (
      (newPassword && !confirmPassword) ||
      (!newPassword && confirmPassword)
    ) {
      alert("Musíte potvrdiť heslo.");
      return;
    }

    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        alert("Heslá sa nezhodujú!");
        return;
      }
      console.log("Old Password:", oldPassword);
      console.log("Password updated successfully.");
      alert("Heslo bolo úspešne zmenené.");
      setNewPassword("");
      setConfirmPassword("");
    }

    if (newEmail) {
      console.log("Old Password:", oldPassword);
      console.log("Email updated to:", newEmail);
      alert("E-mail bol úspešne zmenený.");
      setNewEmail("");
    }

    setOldPassword("");
  };

  return (
    <div className="settings-page">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={handleLogout} />
        <div className="settings-content">
          <h1>Nastavenia</h1>
          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <div className="label-wrapper">
                  <label className="label-text">Aktuálny e-mail:</label>
                  <div className="current-email">{currentEmail}</div>
                </div>
                <div className="label-wrapper">
                  <label className="label-text new-email">Nový e-mail:</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="input-field"
                    placeholder="Zadajte nový e-mail"
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="label-wrapper">
                  <label className="label-text">Nové heslo:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field"
                    placeholder="Zadajte nové heslo"
                  />
                </div>
                <div className="label-wrapper">
                  <label className="label-text">Potvrdenie hesla:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field"
                    placeholder="Zopakujte nové heslo"
                  />
                </div>
              </div>
            </div>
            <div className="shared-section">
              <div className="label-wrapper old-password">
                <label className="label-text">Staré heslo:</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="input-field"
                  placeholder="Zadajte staré heslo"
                />
              </div>
              <button type="submit" className="save-btn">
                Uložiť
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
