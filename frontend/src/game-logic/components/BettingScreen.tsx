import React from "react";
import BettingPhase from "./BettingPhase";
import ItemSelection from "./ItemSelection";
import { Player } from "../data/DataTypes";

interface BettingScreenProps {
  players: Player[];
  onItemPurchase: (playerId: number, itemId: number) => void;
  onBet: (playerId: number, amount: number) => void;
  onLockInBet: () => void;
}

const BettingScreen: React.FC<BettingScreenProps> = ({ players, onItemPurchase, onBet, onLockInBet }) => {
  return (
    <div>
      <h2>Betting Phase</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {players.map((player) => (
          <div key={player.id} style={{ border: "1px solid #ccc", padding: "16px", width: "250px" }}>
            <h2>{player.name}</h2>
            <p>Money: {player.money}</p>
            <ItemSelection player={player} onItemPurchase={onItemPurchase} />
            <BettingPhase player={player} onBet={onBet} />
          </div>
        ))}
      </div>
      <button onClick={onLockInBet}>Lock In Bet</button>
    </div>
  );
};

export default BettingScreen;