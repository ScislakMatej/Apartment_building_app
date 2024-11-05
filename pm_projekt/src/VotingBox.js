import React from "react";
import "./VotingBox.css";

function VotingBox({ toggleVoteModal }) {
  return (
    <div className="voting-box">
      <div className="voting-header">
        <h3>Posledné hlasovanie</h3>
        <button className="add-btn" onClick={toggleVoteModal}>
          <img src="./Add.svg" alt="Add Vote" className="add-icon" />
        </button>
      </div>
      <hr />
      <ul className="voting-results">
        <li>Za: 4</li>
        <li>Proti: 2</li>
        <li>Nezucastnilo sa: 7</li>
      </ul>
    </div>
  );
}

export default VotingBox;
