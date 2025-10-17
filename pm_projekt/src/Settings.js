import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Settings.css";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [currentEmail, setCurrentEmail] = useState(user.email || "");
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
  const [error, setError] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/";
  };

  // Function to update email and password
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!oldPassword) {
      setError("Staré heslo je potrebné na uloženie zmien!");
      return;
    }
    if (!newEmail && !newPassword) {
      setError("Musíte zadať nový e-mail alebo nové heslo.");
      return;
    }
    if (
      (newPassword && !confirmPassword) ||
      (!newPassword && confirmPassword)
    ) {
      setError("Musíte potvrdiť heslo.");
      return;
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setError("Heslá sa nezhodujú!");
      return;
    }

    try {
      // Update email
      if (newEmail) {
        const response = await fetch("/api/update-user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            oldPassword: oldPassword,
            newEmail: newEmail,
            newPassword: newPassword, // Send password as well if provided
            confirmPassword: confirmPassword, // Send confirmPassword if provided
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setCurrentEmail(newEmail);
          setNewEmail("");
          alert("E-mail bol úspešne zmenený.");
        } else {
          setError(data.message || "Chyba pri aktualizácii e-mailu.");
        }
      }

      // Update password
      if (newPassword && confirmPassword) {
        const response = await fetch("/api/update-user", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            oldPassword: oldPassword,
            newPassword: newPassword,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setNewPassword("");
          setConfirmPassword("");
          alert("Heslo bolo úspešne zmenené.");
        } else {
          setError(data.message || "Chyba pri aktualizácii hesla.");
        }
      }

      setOldPassword(""); // Clear old password
      setError(""); // Clear errors
    } catch (error) {
      setError("Chyba pri aktualizácii údajov.");
    }
  };

  // Function to add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (
      !newUserName ||
      !newUserLastName ||
      !newUserEmail ||
      !newUserApartmentNumber ||
      !newUserPassword ||
      !newUserConfirmPassword
    ) {
      setError("Všetky polia sú povinné!");
      return;
    }
    if (newUserPassword !== newUserConfirmPassword) {
      setError("Heslá sa nezhodujú!");
      return;
    }

    try {
      // Send the new user data to the server
      const response = await fetch("/api/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newUserName,
          newUserLastName,
          newUserEmail,
          newUserApartmentNumber,
          newUserPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setNewUserName("");
        setNewUserLastName("");
        setNewUserEmail("");
        setNewUserApartmentNumber("");
        setNewUserPassword("");
        setNewUserConfirmPassword("");
        setError(""); // Clear errors
        alert(`Používateľ ${newUserName} ${newUserLastName} bol úspešne pridaný!`);
      } else {
        setError(data.message || "Chyba pri pridávaní nového používateľa.");
      }
    } catch (error) {
      setError("Chyba pri pridávaní nového používateľa.");
    }
  };

  return (
    <div className="settings-page">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={handleLogout} />
        <div className="settings-content">
          <div className="settings-box">
            <h1>Nastavenia</h1>
            <form className="settings-form" onSubmit={handleEmailUpdate}>
              <div className="form-row">
                <div className="form-group">
                  <div className="label-wrapper">
                    <label className="label-text">Aktuálny e-mail:</label>
                    <input
                      type="email"
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)} // Allow editing
                      className="input-field"
                      placeholder="Zadajte aktuálny e-mail"
                    />
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
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="save-btn">
                  Uložiť
                </button>
              </div>
            </form>
          </div>

          {/* Add new user */}
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
              {error && <div className="error-message">{error}</div>}
              <button type="submit" className="save-btn">
                Pridať používateľa
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
