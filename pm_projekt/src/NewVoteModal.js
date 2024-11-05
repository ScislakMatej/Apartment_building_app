import React, { useState, useEffect } from "react";
import "./Modal.css";

function NewVoteModal({ isOpen, toggleModal }) {
  // premenné pre polia formulára
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answers, setAnswers] = useState([""]); // Začína s jedným poľom odpovede
  // Stavové premenné pre chybové hlásenia
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [answerError, setAnswerError] = useState("");
  // Resetuje polia formulára a chyby pri zatvorení modalu
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setAnswers([""]);
      setTitleError("");
      setDescriptionError("");
      setAnswerError("");
    }
  }, [isOpen]);
  // Funkcia na pridanie nového políčka pre odpoveď
  const addAnswerField = () => {
    setAnswers([...answers, ""]);
  };
  // Funkcia na sledovanie zmien v odpoveďových poliach
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  // Funkcia na spracovanie odoslania formulára
  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    // Kontrola názvu
    if (!title.trim()) {
      setTitleError("Prosím, zadajte názov hlasovania.");
      isValid = false;
    } else {
      setTitleError("");
    }
    // Kontrola popisu
    if (!description.trim()) {
      setDescriptionError("Prosím, zadajte popis hlasovania.");
      isValid = false;
    } else {
      setDescriptionError("");
    }
    // Kontrola odpovedí overí, či je aspoň jedna odpoveď je ne-prázdna
    const hasNonEmptyAnswer = answers.some((answer) => answer.trim() !== "");
    if (!hasNonEmptyAnswer) {
      setAnswerError("Prosím, zadajte aspoň jednu odpoveď.");
      isValid = false;
    } else {
      setAnswerError("");
    }
    // Ak sú všetky polia ok, odošle formulár
    if (!isValid) return;
    // Resetuje formulár a zatvorí modal po úspešnom odoslaní
    setTitle("");
    setDescription("");
    setAnswers([""]);
    toggleModal(); // Zatvorí modal
  };
  // Ak modal nie je otvorený, nevykresľuje komponent
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={toggleModal}>
      <div
        className="modal-content hlasovanie-modal"
        onClick={(e) => e.stopPropagation()} // Zabraňuje zatvoreniu modalu pri kliknutí vnútri obsahu
      >
        <h2>Pridať nové hlasovanie</h2>
        <form onSubmit={handleSubmit}>
          {/* Pole pre názov hlasovania */}
          <label>
            <input
              type="text"
              placeholder="Názov"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
            {titleError && <span className="error-message">{titleError}</span>}
          </label>
          {/* Pole pre popis hlasovania */}
          <label>
            <input
              type="text"
              placeholder="Popis hlasovania"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
            {descriptionError && (
              <span className="error-message">{descriptionError}</span>
            )}
          </label>
          {/* Dynamické polia pre odpovede */}
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
          {answerError && <span className="error-message">{answerError}</span>}
          {/* Tlačidlo na pridanie nového políčka pre odpoveď a tlačidlo na odoslanie */}
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
        {/* Tlačidlo na zatvorenie modalu */}
        <button className="close-btn" onClick={toggleModal}>
          X
        </button>
      </div>
    </div>
  );
}

export default NewVoteModal;
