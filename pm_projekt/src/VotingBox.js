import React, { useState, useEffect } from "react";
import "./VotingBox.css";

function VotingBox({ votes, toggleVoteModal, setVotes }) {
  const [expandedVoteIndex, setExpandedVoteIndex] = useState(null);
  const [voteCounts, setVoteCounts] = useState([]);
  const [userVotes, setUserVotes] = useState({});

  // Funkcia na získanie prihláseného používateľa z localStorage
  const getUserFromLocalStorage = () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  };

  // Overenie, či je používateľ prihlásený
  const isAuthenticated = () => {
    const user = getUserFromLocalStorage();
    return user && user.meno && user.priezvisko;
  };

  const getUserStorageKey = (key) => {
    const user = getUserFromLocalStorage();
    if (user && user.meno && user.priezvisko) {
      return `${key}_${user.meno}_${user.priezvisko}`;
    }
    return key;
  };

  useEffect(() => {
    const user = getUserFromLocalStorage();

    if (!isAuthenticated()) {
      return;
    }

    const savedIndex = localStorage.getItem(getUserStorageKey("expandedVoteIndex"));
    if (savedIndex !== null) {
      setExpandedVoteIndex(JSON.parse(savedIndex));
    }

    const savedVoteCounts = localStorage.getItem(getUserStorageKey("voteCounts"));
    if (savedVoteCounts) {
      setVoteCounts(JSON.parse(savedVoteCounts));
    } else {
      const initialVoteCounts = votes.map(vote => new Array(vote.answers.length).fill(0));
      setVoteCounts(initialVoteCounts);
      localStorage.setItem(getUserStorageKey("voteCounts"), JSON.stringify(initialVoteCounts));
    }

    const savedUserVotes = localStorage.getItem(getUserStorageKey("userVotes"));
    if (savedUserVotes) {
      setUserVotes(JSON.parse(savedUserVotes));
    }
  }, [votes]);

  const handleVoteClick = (index) => {
    const newExpandedIndex = expandedVoteIndex === index ? null : index;
    setExpandedVoteIndex(newExpandedIndex);
    localStorage.setItem(getUserStorageKey("expandedVoteIndex"), JSON.stringify(newExpandedIndex));
  };

  const handleVote = (voteIndex, answerIndex) => {
    const user = getUserFromLocalStorage(); // Získame prihláseného používateľa

    if (!isAuthenticated()) {
      alert("Musíte byť prihlásený, aby ste mohli túto akciu vykonať.");
      return;
    }

    if (userVotes[voteIndex] !== undefined) {
      alert("Už ste hlasovali!");
      return;
    }

    const updatedVoteCounts = [...voteCounts];
    if (!updatedVoteCounts[voteIndex]) {
      updatedVoteCounts[voteIndex] = new Array(votes[voteIndex].answers.length).fill(0);
    }

    updatedVoteCounts[voteIndex][answerIndex] += 1;
    setVoteCounts(updatedVoteCounts);
    localStorage.setItem(getUserStorageKey("voteCounts"), JSON.stringify(updatedVoteCounts));

    const updatedUserVotes = { ...userVotes, [voteIndex]: answerIndex };
    setUserVotes(updatedUserVotes);
    localStorage.setItem(getUserStorageKey("userVotes"), JSON.stringify(updatedUserVotes));
  };

  const handleRemoveVote = (voteIndex) => {
    const user = getUserFromLocalStorage(); // Získame prihláseného používateľa

    if (!isAuthenticated()) {
      alert("Musíte byť prihlásený, aby ste mohli túto akciu vykonať.");
      return;
    }

    if (userVotes[voteIndex] === undefined) {
      alert("Žiadny hlas pre túto anketu nebol odovzdaný.");
      return;
    }

    const updatedVoteCounts = [...voteCounts];
    const answerIndex = userVotes[voteIndex];
    updatedVoteCounts[voteIndex][answerIndex] -= 1;

    setVoteCounts(updatedVoteCounts);
    localStorage.setItem(getUserStorageKey("voteCounts"), JSON.stringify(updatedVoteCounts));

    const updatedUserVotes = { ...userVotes };
    delete updatedUserVotes[voteIndex];
    setUserVotes(updatedUserVotes);
    localStorage.setItem(getUserStorageKey("userVotes"), JSON.stringify(updatedUserVotes));
  };

  const deleteVote = (voteIndex) => {
    const user = getUserFromLocalStorage();

    if (!isAuthenticated()) {
      alert("Musíte byť prihlásený, aby ste mohli túto akciu vykonať.");
      return;
    }

    // Odstránime hlasovanie zo zoznamu
    const updatedVotes = votes.filter((_, index) => index !== voteIndex);
    setVotes(updatedVotes);
    localStorage.setItem("votes", JSON.stringify(updatedVotes));

    // Odstránime všetky hlasovania používateľa z daného hlasovania
    const updatedUserVotes = { ...userVotes };
    delete updatedUserVotes[voteIndex];
    setUserVotes(updatedUserVotes);
    localStorage.setItem(getUserStorageKey("userVotes"), JSON.stringify(updatedUserVotes));
  };

  return (
    <div className="voting-box">
      <div className="voting-header">
        <h3>Posledné hlasovanie</h3>
        <button className="add-btn" onClick={toggleVoteModal}>
          <img src="./Add.svg" alt="Add Vote" className="add-icon" />
        </button>
      </div>
      <hr />
      {votes.length > 0 ? (
        votes.map((vote, voteIndex) => (
          <div key={voteIndex}>
            <div className="vote-header">
              <h4
                onClick={() => handleVoteClick(voteIndex)}
                className="vote-title"
              >
                {vote.title}
              </h4>
              <button
                onClick={() => deleteVote(voteIndex)}
                className="delete-btn1"
              >
                Vymazať
              </button>
            </div>

            {expandedVoteIndex === voteIndex && (
              <div>
                <p>{vote.description}</p>
                <ul className="voting-results">
                  {vote.answers.map((answer, answerIndex) => (
                    <li key={answerIndex}>
                      <button
                        onClick={() => handleVote(voteIndex, answerIndex)}
                        className="vote-answer-btn"
                        disabled={userVotes[voteIndex] !== undefined}
                      >
                        {answer}
                      </button>
                      {voteCounts[voteIndex] && voteCounts[voteIndex][answerIndex] !== undefined ? (
                        <span>{voteCounts[voteIndex][answerIndex]} hlasov</span>
                      ) : (
                        <span>0 hlasov</span>
                      )}
                      {userVotes[voteIndex] === answerIndex && (
                        <span className="voted-text">
                          Hlasovali ste za túto možnosť!
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {userVotes[voteIndex] !== undefined && (
                  <button
                    onClick={() => handleRemoveVote(voteIndex)}
                    className="remove-vote-btn"
                  >
                    Vymazať môj hlas
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Žiadne hlasovanie ešte nebolo pridané.</p>
      )}
    </div>
  );
}

export default VotingBox;
