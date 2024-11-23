import React, { useState } from "react";
import { Player } from "../data/DataTypes";

interface Props {
  player: Player;
  onBet: (playerId: number, amount: number) => void;
}

const BettingPhase: React.FC<Props> = ({ player, onBet }) => {
  const [betAmount, setBetAmount] = useState("");

  const handleBet = () => {
    const amount = parseInt(betAmount, 10);
    if (amount <= 0 || amount > player.money) {
      alert("You cannot bet that amount");
      return;
    }
    onBet(player.id, amount);
    setBetAmount(""); // Clear input
  };

  return (
    <div>
      <h3>Place Your Bet</h3>
      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        placeholder="Enter bet amount"
        min={1}
        max={player.money}
      />
      <button onClick={handleBet}>Bet</button>
    </div>
  );
};

export default BettingPhase;