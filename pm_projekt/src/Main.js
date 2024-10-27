import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Main.css"; 

function Main() {
  const navigate = useNavigate(); 
  const [user, setUser] = useState({});

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/"); // Redirect if no user data is found
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

          <div className="problems-box">
            <div className="problems-header">
              <h3>Problémy</h3>
              <button className="add-btn">
                <img src="./Add.svg" alt="User Icon" className="add-icon" />
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

//* --Komponenta pre zobrazenie úloh---------------------UPRATOVANIE-----------------------*//
function TasksBox() {
  const [clenovia, setClenovia] = useState([]);
  fetch('http://localhost:3003/api/clenovia') // Uistite sa, že port je správny

  
  // Načítanie údajov z backendu pri načítaní komponentu
  useEffect(() => {
    fetch('http://localhost:3003/api/clenovia') // Pridaj celú URL
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json(); // Získaj JSON
        })
        .then((data) => {
            //console.log('Parsed Data:', data);
            setClenovia(data);
        })
        .catch((err) => console.error('Error:', err));
    }, []);

    // Otočím členov, aby som ich mohol použiť v opačnom poradí
  const reversedClenovia = [...clenovia].reverse();


  
  

  //* ---------------------------------UPRATOVANIE-----------------------------------*//

  return (
    <div className="tasks-box">
      <h3>Práce tento mesiac</h3>
      <hr />
      <div className="table-container"> {/* Wrapper for the table */}
        <table>
          <thead>
            <tr>
              <th>Týždeň</th> {/* Prvý stĺpec pre týždeň */}
              <th>Upratovanie</th> {/* Druhý stĺpec pre upratovanie */}
              <th>Kosenie</th> {/* Tretí stĺpec pre kosenie */}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 52 }).map((_, weekIndex) => {
              const clenIndex = weekIndex % clenovia.length; // Cycle through clenovia
              const clen = clenovia[clenIndex]; // Get current member for cleaning
              const kosenieIndex = Math.floor(weekIndex / 2); // For kosenie every second week
              const kosenie =
                weekIndex % 2 === 0 && kosenieIndex < reversedClenovia.length
                  ? `${reversedClenovia[kosenieIndex].meno} ${reversedClenovia[kosenieIndex].priezvisko}`
                  : '---'; // For odd weeks
  
              return (
                <tr key={weekIndex}>
                  <td>{weekIndex + 1}</td> {/* Zobrazenie týždňa */}
                  <td>{clen ? `${clen.meno} ${clen.priezvisko}` : '---'}</td> {/* Zobrazenie mena a priezviska pre upratovanie */}
                  <td>{kosenie}</td> {/* Zobrazenie kosenia */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  
  

}

export default Main;
