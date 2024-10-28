import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Main.css"; 
import ProblemsBox from './ProblemsBox';
import TasksBox from './TasksBox';



function Main() {
  const navigate = useNavigate(); 
  const [user, setUser] = useState({});

  useEffect(() => {
    // Vytiahnutie user dat z lokal uloziska
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/"); // Redirect ak nie su najdene data
    }
  }, [navigate]);

  // Funkcia na logout
  const handleLogout = () => {
    // Na odhlásenie vyčistí storage, ktorú naplnilo v Login.js pri response
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
              <img src="./Home.svg" alt="Home Icon" className="add-icon" />
            </div>
            <span>Home</span>
          </a>
          <a href="?" className="nav-item">
            <div className="nav-icon">
              <img src="./Calendar.svg" alt="Calendar Icon" className="add-icon" />
            </div>
            <span>Kalendár</span>
          </a>
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
          <span>{user.meno} {user.priezvisko}</span>
          <span>Byt č. {user.cislo_bytu}</span>
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </div>

        <div className="dashboard-body">
          <div className="account-box">
            <div className="account-header">
              <h3>Stav uctu: 5824,58€</h3>
              <button className="add-btn">
                <img src="./Add.svg" alt="User Icon" className="add-icon" />
              </button>
            </div>
            <hr />
            <div className="account-graph">TU GRAF xdd</div>
          </div>

          {/* Komponenta pre zobrazenie úloh */}
          <TasksBox />

          <div className="voting-box">
            <div className="voting-header">
              <h3>Posledné hlasovanie</h3>
              <button className="add-btn">
                <img src="./Add.svg" alt="User Icon" className="add-icon" />
              </button>
            </div>
            <hr />
            <ul className="voting-results">
              <li>Za: 4</li>
              <li>Proti: 2</li>
              <li>Nezucastnilo sa: 7</li>
            </ul>
          </div>

          
          {/* Komponenta pre zobrazenie problémov */}
          <ProblemsBox />

        </div>
      </div>
    </div>
  );
}


  
  



export default Main;
