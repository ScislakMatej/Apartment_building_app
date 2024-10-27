import React, { useState, useEffect } from 'react';

function ProblemsBox() {
  const [problems, setProblems] = useState([]);
  const [newProblem, setNewProblem] = useState('');

  // Vytiahnutie dat z databazy a jsonify
  useEffect(() => {
    fetch('http://localhost:3003/api/problems')
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .catch((error) => console.error('Error fetching problems:', error));
  }, []);

  // Add a new problem
  const addProblem = () => {
    fetch('http://localhost:3003/api/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem: newProblem }),
    })
      .then((res) => res.json())
      .then((addedProblem) => {
        setProblems([...problems, addedProblem]); // Pridanie noveho problemu lokalne
        setNewProblem(''); // Vyčistí input
      })
      .catch((error) => console.error('Error adding problem:', error));
  };

  // označenie problemu za vybavený
  const markProblemAsCompleted = (id) => {
    const confirmDelete = window.confirm("Určite chcete označiť problém za vyriešený?");
    if (!confirmDelete) return;

    fetch(`http://localhost:3003/api/problems/${id}`, { method: 'PUT' })
      .then(() => {
        setProblems(problems.filter((problem) => problem.id !== id)); // Vymazanie z lokalneho uloziska
      })
      .catch((error) => console.error('Error marking problem as completed:', error));
  };

  return (
    <div className="problems-box">
      <div className="problems-header">
        <h3>Problémy</h3>
        <button className="add-btn" onClick={addProblem}>
          <img src="./Add.svg" alt="Add Icon" className="add-icon" />
        </button>
      </div>
      <input
        type="text"
        value={newProblem}
        onChange={(e) => setNewProblem(e.target.value)}
        placeholder="Nový problém"
      />
      <hr />
      <ul className="problems-list">
        {problems.map((problem) => (
          <li key={problem.id}>
            {problem.problem}
            <button className="delete-btn" onClick={() => markProblemAsCompleted(problem.id)}>
              <img src="./Trashcan.svg" alt="Vymazať" className="delete-icon" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProblemsBox;
