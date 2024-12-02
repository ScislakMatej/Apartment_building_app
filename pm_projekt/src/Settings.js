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
  const [newUserName, setNewUserName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserApartmentNumber, setNewUserApartmentNumber] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserConfirmPassword, setNewUserConfirmPassword] = useState("");

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
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      alert("Heslá sa nezhodujú!");
      return;
    }
    if (newPassword && confirmPassword) {
      alert("Heslo bolo úspešne zmenené.");
      setNewPassword("");
      setConfirmPassword("");
    }
    if (newEmail) {
      alert("E-mail bol úspešne zmenený.");
      setNewEmail("");
    }
    setOldPassword("");
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (
      !newUserName ||
      !newUserLastName ||
      !newUserEmail ||
      !newUserApartmentNumber ||
      !newUserPassword ||
      !newUserConfirmPassword
    ) {
      alert("Všetky polia sú povinné!");
      return;
    }
    if (newUserPassword !== newUserConfirmPassword) {
      alert("Heslá sa nezhodujú!");
      return;
    }
    alert(`Používateľ ${newUserName} ${newUserLastName} bol úspešne pridaný!`);
    setNewUserName("");
    setNewUserLastName("");
    setNewUserEmail("");
    setNewUserApartmentNumber("");
    setNewUserPassword("");
    setNewUserConfirmPassword("");
  };

  return (
    <div className="settings-page">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={handleLogout} />
        <div className="settings-content">
          <div className="settings-box">
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
          <div className="new-user-box">
            <h1>Pridať nového používateľa</h1>
            <form className="new-user-form" onSubmit={handleAddUser}>
              <div className="label-wrapper">
                <label className="label-text">Meno:</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="input-field"
                  placeholder="Zadajte meno používateľa"
                />
              </div>
              <div className="label-wrapper">
                <label className="label-text">Priezvisko:</label>
                <input
                  type="text"
                  value={newUserLastName}
                  onChange={(e) => setNewUserLastName(e.target.value)}
                  className="input-field"
                  placeholder="Zadajte priezvisko"
                />
              </div>
              <div className="label-wrapper">
                <label className="label-text">E-mail:</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="input-field"
                  placeholder="Zadajte e-mail"
                />
              </div>
              <div className="label-wrapper">
                <label className="label-text">Číslo bytu:</label>
                <input
                  type="text"
                  value={newUserApartmentNumber}
                  onChange={(e) => setNewUserApartmentNumber(e.target.value)}
                  className="input-field"
                  placeholder="Zadajte číslo bytu"
                />
              </div>
              <div className="label-wrapper">
                <label className="label-text">Heslo:</label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="input-field"
                  placeholder="Zadajte heslo"
                />
              </div>
              <div className="label-wrapper">
                <label className="label-text">Potvrdenie hesla:</label>
                <input
                  type="password"
                  value={newUserConfirmPassword}
                  onChange={(e) => setNewUserConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Zopakujte heslo"
                />
              </div>
              <button type="submit" className="save-btn">
                Pridať
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
