
import  React, { useState, useEffect } from 'react';
import "./TasksBox";

//* -----------------------UPRATOVANIE & KOSENIE-----------------------*//

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
    
  
    return (
      <div className="tasks-box">
        <h3 className='title'>Práce tento mesiac</h3>
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

export default TasksBox; // export pre použitie inde