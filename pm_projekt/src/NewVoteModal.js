import React, { useState } from "react";
import "./Modal.css"; // Add relevant styles here

function NewVoteModal({ isOpen, toggleModal }) {
  const [answers, setAnswers] = useState([""]); // Start with one answer field
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  // Function to add a new answer field
  const addAnswerField = () => {
    setAnswers([...answers, ""]);
  };

  // Function to handle answer changes
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className="modal-overlay" onClick={toggleModal}>
      <div
        className="modal-content hlasovanie-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Pridať nové hlasovanie</h2>
        <form>
          <label>
            <input
              type="text"
              placeholder="Názov"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </label>
          <label>
            <input
              type="text"
              placeholder="Popis hlasovania"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          </label>

          {answers.map((answer, index) => (
            <label key={index}>
              <input
                type="text"
                placeholder={`Odpoved ${index + 1}`}
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="input-field"
              />
            </label>
          ))}

          {/* Add Answer Button */}

          <div className="button-container">
            <button
              type="button"
              className="add-answer-btn"
              onClick={addAnswerField}
            >
              <img
                src="./Plus_circle.svg"
                alt="Add Answer"
                className="add-answer-icon"
              />
            </button>
            <button type="submit" className="submit-btn">
              Odošli
            </button>
          </div>
        </form>
        <button className="close-btn" onClick={toggleModal}>
          X
        </button>
      </div>
    </div>
  );
}

export default NewVoteModal;
