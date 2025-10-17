import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Dokumenty.css";
import DocumentsModal from "./DocumentsModal";
import InvoiceModal from "./InvoiceModal";

const Dokumenty = () => {
  const [documents, setDocuments] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const toggleDocumentsModal = () => {
    setIsDocumentsModalOpen(!isDocumentsModalOpen);
  };

  const toggleInvoiceModal = () => {
    setIsInvoiceModalOpen(!isInvoiceModalOpen);
  };

  useEffect(() => {
    const mockDocuments = [
      //docasne udaje
      {
        id: 1,
        name: "Faktúra Január",
        popis: "Faktúra za energie za január.",
        type: "faktúra",
        fileType: ".pdf",
        date: "2024-01-15",
        url: "/files/faktura_januar.pdf",
      },
      {
        id: 2,
        name: "Záznam zo schôdze",
        popis: "Záznam zo schôdze z januára 2023.",
        type: "záznam zo schôdze",
        fileType: ".txt",
        date: "2023-01-20",
        url: "/files/zaznam_schodza_jan.txt",
      },
      {
        id: 3,
        name: "Faktúra Február",
        popis: "Faktúra za energie za február.",
        type: "faktúra",
        fileType: ".pdf",
        date: "2024-02-10",
        url: "/files/faktura_februar.pdf",
      },
      {
        id: 4,
        name: "Plán údržby",
        popis: "Ročný plán údržby bytovky.",
        type: "plán",
        fileType: ".docx",
        date: "2023-12-01",
        url: "/files/plan_udrzby.docx",
      },
    ];

    const defaultSortedDocs = [...mockDocuments].sort((a, b) =>
      a.date < b.date ? 1 : -1
    );

    setDocuments(defaultSortedDocs);
  }, []);

  const sortDocuments = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    const sortedDocs = [...documents].sort((a, b) => {
      if (key === "date") {
        return direction === "asc"
          ? a.date > b.date
            ? 1
            : -1
          : a.date < b.date
          ? 1
          : -1;
      }
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setDocuments(sortedDocs);
    setSortConfig({ key, direction });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header user={user} onLogout={handleLogout} />
        <div className="dokumenty-content">
          <div className="header-with-button">
            <h1>Dokumenty</h1>
            <button className="add-btn" onClick={toggleDocumentsModal}>
              <img src="./Add.svg" alt="Add Icon" className="add-icon" />
            </button>
          </div>
          <table className="documents-table">
            <thead>
              <tr>
                <th onClick={() => sortDocuments("name")}>Názov</th>
                <th onClick={() => sortDocuments("popis")}>Popis</th>
                <th onClick={() => sortDocuments("type")}>Typ</th>
                <th onClick={() => sortDocuments("fileType")}>Typ súboru</th>
                <th onClick={() => sortDocuments("date")}>Dátum</th>
                <th>Stiahnuť</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>{doc.popis}</td>
                  <td>{doc.type}</td>
                  <td>{doc.fileType}</td>
                  <td>{doc.date}</td>
                  <td>
                    <a href={doc.url} download>
                      <img
                        src="./download-file.svg"
                        alt="Download"
                        className="download-icon"
                      />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DocumentsModal
          isOpen={isDocumentsModalOpen}
          toggleModal={toggleDocumentsModal}
          openInvoiceModal={toggleInvoiceModal}
        />
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          toggleModal={toggleInvoiceModal}
        />
      </div>
    </div>
  );
};

export default Dokumenty;
