import React from "react";
import "./Header.css";

const Header = ({ user, onLogout }) => {
  return (
    <div className="header">
      <div className="header-left">
        <span>
          {user.meno} {user.priezvisko}
        </span>
        <span className="header-apartment">Byt č. {user.cislo_bytu}</span>
      </div>
      <button className="logout-button" onClick={onLogout}>
        <img src="./Logout.svg" alt="Logout" className="logout-icon" />
      </button>
    </div>
  );
};

export default Header;
