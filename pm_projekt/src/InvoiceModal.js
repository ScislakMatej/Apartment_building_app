import React, { useState, useEffect } from "react";
import "./Modal.css";

function InvoiceModal({ isOpen, toggleModal }) {
  // Stavove premenne pre polia formulara
  const [paymentDate, setPaymentDate] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [files, setFiles] = useState([]); // Pole pre ukladanie vybranych suborov

  // Stavove premenne pre chybove hlasenia
  const [paymentDateError, setPaymentDateError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [supplierIdError, setSupplierIdError] = useState("");

  // Resetuje polia formulara a chyby pri zatvoreni modalu
  useEffect(() => {
    if (!isOpen) {
      setPaymentDate("");
      setDescription("");
      setPrice("");
      setSupplierId("");
      setFiles([]); // Vymazanie suborov pri zatvoreni modalu
      setPaymentDateError("");
      setDescriptionError("");
      setPriceError("");
      setSupplierIdError("");
    }
  }, [isOpen]);

  // Funkcia na spracovanie zmeny suboru
  const handleFileChange = (e) => {
    setFiles([...e.target.files]); // Ulozi vybrane subory do pola
  };

  // Funkcia na spracovanie odoslania formulara s validaciou
  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    // Validacia len pre povinne polia (napr. Datum a Popis)
    if (!paymentDate) {
      setPaymentDateError("Prosim, zadajte datum uhrady.");
      isValid = false;
    } else {
      setPaymentDateError("");
    }

    if (!description.trim()) {
      setDescriptionError("Prosim, zadajte popis.");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    // Cena je nepovinna, ale ak je vyplnena, musi byt validne nezaporne cislo
    if (price !== "" && (isNaN(price) || parseFloat(price) < 0)) {
      setPriceError("Prosim, zadajte platnu cenu (0 alebo vyssiu).");
      isValid = false;
    } else {
      setPriceError("");
    }

    // Zastavi odoslanie, ak validacia zlyhala
    if (!isValid) return;

    // Resetuje polia formulara po uspesnom odoslani
    setPaymentDate("");
    setDescription("");
    setPrice("");
    setSupplierId("");
    setFiles([]); // Vymazanie suborov po odoslani
    toggleModal(); // Zatvori modal
  };

  // Stavove premenne pre tooltip a poziciu mysi
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Funkcia na sledovanie pozicie mysi pre tooltip
  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Ak modal nie je otvoreny, nevykresluje komponent
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={toggleModal}>
      <div
        className="modal-content faktury-modal"
        onClick={(e) => e.stopPropagation()} // Zabranuje zatvoreniu modalu pri kliknuti vnutri
      >
        <h2>Pridat uhradenu fakturu</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Datum uhrady
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="input-date"
            />
            {paymentDateError && (
              <span className="error-message">{paymentDateError}</span>
            )}
          </label>
          <label>
            <input
              type="text"
              placeholder="Popis"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-description"
            />
            {descriptionError && (
              <span className="error-message">{descriptionError}</span>
            )}
          </label>
          <label>
            <input
              type="number"
              placeholder="Cena"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              className="input-price"
            />
            {priceError && <span className="error-message">{priceError}</span>}
          </label>
          <label>
            <input
              type="text"
              placeholder="ICO dodavatela"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="input-supplier-id"
            />
            {supplierIdError && (
              <span className="error-message">{supplierIdError}</span>
            )}
          </label>

          <div className="button-container">
            <label
              htmlFor="file-upload"
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
              {showTooltip && (
                <span
                  className="tooltip"
                  style={{
                    top: mousePosition.y + 15,
                    left: mousePosition.x + 15,
                  }}
                >
                  Pridaj fotku faktury
                </span>
              )}
            </label>

            {/* Skryty vstup pre nahravanie suboru */}
            <input
              type="file"
              id="file-upload"
              className="input-upload"
              style={{ display: "none" }}
              onChange={handleFileChange}
              multiple // Umoznuje vyber viacerych suborov
            />

            <button type="submit" className="submit-btn">
              Odosli
            </button>
          </div>

          {/* Zobrazenie mien vybranych suborov */}
          <div className="file-list">
            {files.length > 0 && (
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li> // Zobrazenie mena kazdeho suboru
                ))}
              </ul>
            )}
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
