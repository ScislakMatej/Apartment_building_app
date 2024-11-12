import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import ProblemsBox from "./ProblemsBox";
import TasksBox from "./TasksBox";
import InvoiceModal from "./InvoiceModal";
import NewVoteModal from "./NewVoteModal";
import VotingBox from "./VotingBox";
import GraphBox from "./GraphBox";  

function Main() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [votes, setVotes] = useState([]);  // Stav pre hlasovania
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/"); // Redirect ak nie sú nájdené údaje
    }

    const savedVotes = JSON.parse(localStorage.getItem("votes"));
    if (savedVotes) {
      setVotes(savedVotes);
    } else {
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  const toggleInvoiceModal = () => {
    setIsInvoiceModalOpen(!isInvoiceModalOpen);
  };

  const toggleVoteModal = () => {
    setIsVoteModalOpen(!isVoteModalOpen);
  };

  // Pridanie nového hlasovania a jeho uloženie
  const addNewVote = (newVote) => {
    const updatedVotes = [...votes, newVote];
    setVotes(updatedVotes);
    localStorage.setItem("votes", JSON.stringify(updatedVotes));
  };

  // Funkcia pre správu hlasovania užívateľa
  const handleVote = (voteIndex, answerIndex) => {
    const updatedVotes = [...votes];
    const currentVote = updatedVotes[voteIndex];
    const userVote = { userId: user.id, answerIndex };

    if (!currentVote.userVotes) currentVote.userVotes = {}; // Inicializujeme userVotes pre tento hlas
    currentVote.userVotes[user.id] = answerIndex;

    // Ak už používateľ hlasoval, nebude môcť zmeniť svoj hlas
    if (currentVote.userVotes[user.id] !== undefined) {
      currentVote.answers[answerIndex].votes += 1;
      setVotes(updatedVotes);
      localStorage.setItem("votes", JSON.stringify(updatedVotes));
    } else {
      alert("Tento používateľ už hlasoval!");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <p className="sidebar-address">Podivínska 12 Košice</p>
        <nav className="nav-links">
          <a href="#" className="nav-item">
            <div className="nav-button">
              <img src="./Home.svg" alt="Home Icon" className="nav-icon" />
            </div>
            <span>Home</span>
          </a>
          <a href="?" className="nav-item">
            <div className="nav-button">
              <img
                src="./Document.svg"
                alt="Document Icon"
                className="nav-icon"
              />
            </div>
            <span>Dokumenty</span>
          </a>
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
          <span>
            {user.meno} {user.priezvisko}
          </span>
          <span>Byt č. {user.cislo_bytu}</span>
          <button className="logout-button" onClick={handleLogout}>
            <img src="./Logout.svg" alt="Logout" className="logout-icon" />
          </button>
        </div>

        <div className="dashboard-body">
          <div className="account-box">
            <div className="account-header">
              <h3>Stav uctu: 5824,58€</h3>
              <button className="add-btn" onClick={toggleInvoiceModal}>
                <img src="./Add.svg" alt="Add Icon" className="add-icon" />
              </button>
            </div>
            <hr />
            <div className="account-graph">
            <GraphBox />
            </div>
          </div>

          {/* Komponent pre zobrazenie uloh */}
          <TasksBox />

          {/* Predáme votes a setVotes ako prop */}
          <VotingBox 
            votes={votes} 
            setVotes={setVotes}  
            toggleVoteModal={toggleVoteModal} 
            handleVote={handleVote}  // Predáme funkciu pre hlasovanie
          />
          
          {/* Komponent pre zobrazenie problémov */}
          <ProblemsBox />
        </div>
      </div>
      {/* Komponent pre zobrazenie submit boxy pre faktúry */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        toggleModal={toggleInvoiceModal}
      />

      {/* Hlasovanie Modal */}
      <NewVoteModal 
        isOpen={isVoteModalOpen} 
        toggleModal={toggleVoteModal} 
        addNewVote={addNewVote} 
      />
    </div>
  );
}

export default Main;
