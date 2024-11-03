import React, { useState } from "react";
import "./Modal.css";

function InvoiceModal({ isOpen, toggleModal }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="modal-overlay" onClick={toggleModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Pridať uhradenú faktúru</h2>
        <form>
          <label>
            Dátum úhrady
            <input
              type="date"
              placeholder="Popis objednavky"
              className="input-date"
            />
          </label>
          <label>
            <input
              type="text"
              placeholder="Popis"
              className="input-description"
            />
          </label>
          <label>
            <input
              type="number"
              placeholder="Cena"
              className="input-price"
              min="0"
            />
          </label>
          <label>
            <input
              type="text"
              placeholder="IČO dodávateľa"
              className="input-supplier-id"
            />
          </label>
          <div className="button-container">
            <div
              className="custom-upload-button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src="./Upload.svg"
                alt="Upload Icon"
                className="upload-icon"
              />
              <input type="file" className="input-upload" />
              {showTooltip && (
                <span
                  className="tooltip"
                  style={{
                    top: mousePosition.y + 15,
                    left: mousePosition.x + 15,
                  }}
                >
                  Pridaj fotku faktúry
                </span>
              )}
            </div>
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

export default InvoiceModal;
