import React from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css"; 

function Main() {
  const navigate = useNavigate(); 

  // Funkcia na logout
  const handleLogout = () => {
    // na odhlasenie vyčistí storage ktoru naplnilo v Login.js pri response
    localStorage.removeItem("isAuthenticated");

    // Redirect na login page
    navigate("/");
  };
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <p className="sidebar-address">Podivínska 12 Košice</p>
        <nav className="nav-links">
          <a href="#" className="nav-item">
            <div className="nav-icon">
              <img src="./Home.svg" alt="Home Icon" className="add-icon" />{" "}
            </div>
            <span>Home</span>
          </a>
          <a href="?" className="nav-item">
            <div className="nav-icon">
              <img
                src="./Calendar.svg"
                alt="Calendar Icon"
                className="add-icon"
              />{" "}
            </div>
            <span>Kalendár</span>
          </a>
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
          <span>Erik Lakatoš</span>
          <span>3.p</span>
          <span>Byt č. 7</span>
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>

        <div className="dashboard-body">
          <div className="account-box">
            <div className="account-header">
              <h3>Stav uctu: 5824,58€</h3>
              <button className="add-btn">
                <img src="./Add.svg" alt="User Icon" className="add-icon" />{" "}
              </button>
            </div>
            <hr />
            <div className="account-graph">TU GRAF xdd</div>
          </div>

          <div className="tasks-box">
            <h3>Práce tento mesiac</h3>
            <hr />
            <table>
              <thead>
                <tr>
                  <th>Upratovanie</th>
                  <th>Kosenie/Sneh</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Adam P.</td>
                  <td>Monika Z.</td>
                </tr>
                <tr>
                  <td>Maroš G.</td>
                  <td>Erik L.</td>
                </tr>
                <tr>
                  <td>Slávo V.</td>
                  <td>Michal K.</td>
                </tr>
                <tr>
                  <td>Daniela M.</td>
                  <td>Juraj F.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="voting-box">
            <div className="voting-header">
              <h3>Posledné hlasovanie</h3>
              <button className="add-btn">
                <img src="./Add.svg" alt="User Icon" className="add-icon" />{" "}
              </button>
            </div>
            <hr />
            <ul className="voting-results">
              <li>Za: 4</li>
              <li>Proti: 2</li>
              <li>Nezucastnilo sa: 7</li>
            </ul>
          </div>

          <div className="problems-box">
            <div className="problems-header">
              <h3>Problémy</h3>
              <button className="add-btn">
                <img src="./Add.svg" alt="User Icon" className="add-icon" />{" "}
              </button>
            </div>
            <hr />
            <ul className="problems-list">
              <li>Svetlo vo výťahu nesvieti</li>
              <li>Nezvládam to psychicky</li>
              <li>Smrad v kočikárni</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
