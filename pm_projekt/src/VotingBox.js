import React, { useState, useEffect } from "react";
import "./VotingBox.css";

function VotingBox({ votes, toggleVoteModal, setVotes }) {
  const [expandedVoteIndex, setExpandedVoteIndex] = useState(null);
  const [voteCounts, setVoteCounts] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [showAllVotes, setShowAllVotes] = useState(false);

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
    if (!isAuthenticated()) {
      return;
    }

    const savedVoteCounts = localStorage.getItem(
      getUserStorageKey("voteCounts")
    );
    if (savedVoteCounts) {
      setVoteCounts(JSON.parse(savedVoteCounts));
    } else {
      const initialVoteCounts = votes.map((vote) =>
        new Array(vote.answers.length).fill(0)
      );
      setVoteCounts(initialVoteCounts);
      localStorage.setItem(
        getUserStorageKey("voteCounts"),
        JSON.stringify(initialVoteCounts)
      );
    }

    const savedUserVotes = localStorage.getItem(getUserStorageKey("userVotes"));
    if (savedUserVotes) {
      setUserVotes(JSON.parse(savedUserVotes));
    }

    // default zobrazenie otvorene
    if (votes.length > 0) {
      setExpandedVoteIndex(votes.length - 1);
    }
  }, [votes]);

  const handleVoteClick = (index) => {
    const newExpandedIndex = expandedVoteIndex === index ? null : index;
    setExpandedVoteIndex(newExpandedIndex);
  };

  const handleVote = (voteIndex, answerIndex) => {
    if (!isAuthenticated()) {
      alert("Musíte byť prihlásený, aby ste mohli túto akciu vykonať.");
      return;
    }

    if (userVotes[voteIndex] !== undefined) {
      alert("Už ste hlasovali!");
      return;
    }

    const updatedVoteCounts = [...voteCounts];
    updatedVoteCounts[voteIndex][answerIndex] += 1;

    setVoteCounts(updatedVoteCounts);
    localStorage.setItem(
      getUserStorageKey("voteCounts"),
      JSON.stringify(updatedVoteCounts)
    );

    const updatedUserVotes = { ...userVotes, [voteIndex]: answerIndex };
    setUserVotes(updatedUserVotes);
    localStorage.setItem(
      getUserStorageKey("userVotes"),
      JSON.stringify(updatedUserVotes)
    );
  };

  const handleRemoveVote = (voteIndex) => {
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
    localStorage.setItem(
      getUserStorageKey("voteCounts"),
      JSON.stringify(updatedVoteCounts)
    );

    const updatedUserVotes = { ...userVotes };
    delete updatedUserVotes[voteIndex];
    setUserVotes(updatedUserVotes);
    localStorage.setItem(
      getUserStorageKey("userVotes"),
      JSON.stringify(updatedUserVotes)
    );
  };

  const deleteVote = (voteIndex) => {
    if (!isAuthenticated()) {
      alert("Musíte byť prihlásený, aby ste mohli túto akciu vykonať.");
      return;
    }

    const updatedVotes = votes.filter((_, index) => index !== voteIndex);
    setVotes(updatedVotes);
    localStorage.setItem("votes", JSON.stringify(updatedVotes));

    const updatedUserVotes = { ...userVotes };
    delete updatedUserVotes[voteIndex];
    setUserVotes(updatedUserVotes);
    localStorage.setItem(
      getUserStorageKey("userVotes"),
      JSON.stringify(updatedUserVotes)
    );
  };

  // zobrazenie poctu hlasovani
  const renderVoteCounts = (vote, voteIndex) => (
    <ul className="voting-results">
      {vote.answers.map((answer, answerIndex) => (
        <li key={answerIndex} className="voting-item">
          <div className="answer-container">
            <button
              onClick={() => handleVote(voteIndex, answerIndex)}
              className="square-btn"
            >
              <img
                src={
                  userVotes[voteIndex] === answerIndex
                    ? "./Tick-checkbox.svg"
                    : "./Square.svg"
                }
                alt={
                  userVotes[voteIndex] === answerIndex ? "Checked" : "Unchecked"
                }
              />
            </button>
            <span className="answer-text">{answer}</span>
          </div>
          <span className="vote-count">
            {voteCounts[voteIndex]?.[answerIndex] || 0}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="voting-box">
      <div className="voting-header">
        <h3>
          Posledné hlasovanie
          <button className="add-btn" onClick={toggleVoteModal}>
            <img src="./Add.svg" alt="Add Vote" className="icon add-icon" />
          </button>
        </h3>
        <button
          className="list-btn"
          onClick={() => setShowAllVotes(!showAllVotes)}
        >
          <img src="./List.svg" alt="List Votes" className="icon list-icon" />
        </button>
      </div>
      <hr />
      {votes.length > 0 ? (
        showAllVotes ? (
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
                  {renderVoteCounts(vote, voteIndex)}
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
          <div>
            <div className="vote-header">
              <h4 className="vote-title">{votes[votes.length - 1].title}</h4>
              <button
                onClick={() => deleteVote(votes.length - 1)}
                className="delete-btn1"
              >
                Vymazať
              </button>
            </div>
            <div>
              <p>{votes[votes.length - 1].description}</p>
              {renderVoteCounts(votes[votes.length - 1], votes.length - 1)}
              {userVotes[votes.length - 1] !== undefined && (
                <button
                  onClick={() => handleRemoveVote(votes.length - 1)}
                  className="remove-vote-btn"
                >
                  Vymazať môj hlas
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        <p>Žiadne hlasovanie ešte nebolo pridané.</p>
      )}
    </div>
  );
}

export default VotingBox;
