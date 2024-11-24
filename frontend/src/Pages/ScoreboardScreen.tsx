import React from 'react';
import './Syling/ScoreboardScreen.css';

interface Player {
  name: string;
  points: number;
}

const ScoreboardScreen: React.FC = () => {
  const players: Player[] = [
    { name: 'Player 1', points: 150 },
    { name: 'Player 2', points: 100 },
    { name: 'Player 3', points: 50 },
  ];

  return (
    <div className="container">
      <button className="back-button">Back</button>
      <h2 className="title">Scoreboard</h2>
      <div className="scoreboard">
        {players.map((player, index) => (
          <div className="player-row" key={index}>
            <span>{player.name}</span>
            <span>{player.points} Points</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreboardScreen;
