// src/pages/GameOverPage.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function GameOverPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { winner, players } = location.state || {};

  const handlePlayAgain = () => {
    navigate('/');
  };

  if (!winner || !players) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>No Game Results Available</h2>
        <button onClick={handlePlayAgain}>Back to Home</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Game Over</h2>
      <h3>Winner: {winner.username} with ${winner.money}</h3>
      <h3>Final Standings:</h3>
      <ul>
        {players
          .sort((a, b) => b.money - a.money)
          .map((player) => (
            <li key={player.username}>
              {player.username}: ${player.money}
            </li>
          ))}
      </ul>
      <button onClick={handlePlayAgain}>Back to Home</button>
    </div>
  );
}

export default GameOverPage;
