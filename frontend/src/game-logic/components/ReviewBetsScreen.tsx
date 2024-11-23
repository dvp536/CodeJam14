import React from "react";
import { Player } from "../data/DataTypes";

interface ReviewBetsScreenProps {
  players: Player[];
  bettingAmounts: Record<number, number>;
  onStartQuestions: () => void;
}

const ReviewBetsScreen: React.FC<ReviewBetsScreenProps> = ({ players, bettingAmounts, onStartQuestions }) => {
  return (
    <div>
      <h2>Players' Bets</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {players.map((player) => (
          <div key={player.id} style={{ border: "1px solid #ccc", padding: "16px", width: "250px" }}>
            <h3>{player.name}</h3>
            <p>Bet Amount: {bettingAmounts[player.id]}</p>
          </div>
        ))}
      </div>
      <button onClick={onStartQuestions}>Start Questions Phase</button>
    </div>
  );
};

export default ReviewBetsScreen;