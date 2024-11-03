import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import ProblemsBox from "./ProblemsBox";
import TasksBox from "./TasksBox";
import InvoiceModal from "./InvoiceModal";

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
  {
    /* logika pre box s fakturami */
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <p className="sidebar-address">Podivínska 12 Košice</p>
        <nav className="nav-links">
          <a href="#" className="nav-item">
            <div className="nav-button">
              <img src="./Home.svg" alt="Home Icon" className="nav-icon" />
            </div>
            <span>Home</span>
          </a>
          <a href="?" className="nav-item">
            <div className="nav-button">
              <img
                src="./Document.svg"
                alt="Document Icon"
                className="nav-icon"
              />
            </div>
            <span>Dokumenty</span>
          </a>
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
          <span>
            {user.meno} {user.priezvisko}
          </span>
          <span>Byt č. {user.cislo_bytu}</span>
          <button className="logout-button" onClick={handleLogout}>
            <img src="./Logout.svg" alt="Logout" className="logout-icon" />
          </button>
        </div>

        <div className="dashboard-body">
          <div className="account-box">
            <div className="account-header">
              <h3>Stav uctu: 5824,58€</h3>
              <button className="add-btn" onClick={toggleModal}>
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
      {/* Komponent pre zobrazenie sumbmit boxy pre faktury */}
      <InvoiceModal isOpen={isModalOpen} toggleModal={toggleModal} />
    </div>
  );
}

export default Main;
