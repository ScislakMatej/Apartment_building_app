import React from "react";
import { Link } from "react-router-dom"; 
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <p className="sidebar-address">Podivínska 12 Košice</p>
      <nav className="nav-links">
        <Link to="/Main" className="nav-item">
          <div className="nav-button">
            <img src="./Home.svg" alt="Home Icon" className="nav-icon" />
          </div>
          <span>Home</span>
        </Link>
        <Link to="/Dokumenty" className="nav-item">
          <div className="nav-button">
            <img
              src="./Document.svg"
              alt="Document Icon"
              className="nav-icon"
            />
          </div>
          <span>Dokumenty</span>
        </Link>
        <Link to="/Settings" className="nav-item">
          <div className="nav-button">
            <img src="./gear.svg" alt="Settings Icon" className="nav-icon" />
          </div>
          <span>Nastavenia</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
