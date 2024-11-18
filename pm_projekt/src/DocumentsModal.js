import React, { useState, useEffect } from "react";
import "./Modal.css";

function DocumentsModal({ isOpen, toggleModal, openInvoiceModal }) {
  const [description, setDescription] = useState("");
  const [type, setType] = useState("plán");
  const [date, setDate] = useState(() => {
    // Set default to today's date in YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setDescription("");
      setType("plán");
      setDate(() => {
        // Reset to today's date when the modal is closed
        const today = new Date();
        return today.toISOString().split("T")[0];
      });
      setFiles([]);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setType(selectedType);

    if (selectedType === "faktúra") {
      toggleModal();
      openInvoiceModal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !date || files.length === 0) {
      alert("Vyplňte všetky polia a pridajte súbor.");
      return;
    }
    console.log({ description, type, date, files });
    toggleModal();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={toggleModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={toggleModal}>
          X
        </button>
        <h2>Pridať nový dokument</h2>
        <form onSubmit={handleSubmit}>
          <select
            value={type}
            onChange={handleTypeChange}
            className="dropdown"
            required
          >
            <option value="plán">Plán</option>
            <option value="záznam zo schôdze">Záznam zo schôdze</option>
            <option value="faktúra">Faktúra</option>
          </select>

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
            placeholder="Popis dokumentu"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
            required
          />
          <div className="button-container">
            <label htmlFor="file-upload" className="custom-upload-button">
              <img
                src="./Upload.svg"
                alt="Upload Icon"
                className="upload-icon"
              />
            </label>
            <input
              type="file"
              id="file-upload"
              className="input-upload"
              onChange={handleFileChange}
              multiple
              required
            />
            <button type="submit" className="submit-btn">
              Odošli
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DocumentsModal;
