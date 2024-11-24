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
      <div className="min-h-screen bg-gradient-to-b from-teal-500 to-cyan-400 flex flex-col items-center justify-center text-white p-6">
        <div className="w-full max-w-lg bg-white text-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-teal-600 mb-4">No Game Results Available</h2>
          <button
            onClick={handlePlayAgain}
            className="bg-teal-600 text-white font-semibold rounded-lg px-4 py-2 shadow-md hover:bg-teal-700 transition duration-300 mt-6"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-cyan-400 flex flex-col items-center justify-center text-white p-6">
      <div className="w-full max-w-lg bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-teal-600 mb-6 text-center">Game Over</h2>
        <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Winner: <span className="text-teal-600">{winner.username}</span> with <span className="font-bold">${winner.money}</span>
        </h3>

        <h4 className="text-lg font-bold text-gray-700 text-center mb-4">Final Standings</h4>
        <ul className="space-y-3">
          {players
            .sort((a, b) => b.money - a.money)
            .map((player, index) => (
              <li
                key={player.username}
                className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 shadow-sm"
              >
                <span className="text-lg font-medium text-gray-700">
                  {index + 1}. {player.username}
                </span>
                <span className="text-lg font-semibold text-teal-600">${player.money}</span>
              </li>
            ))}
        </ul>

        <button
          onClick={handlePlayAgain}
          className="w-full bg-teal-600 text-white font-semibold rounded-lg px-4 py-2 shadow-md hover:bg-teal-700 transition duration-300 mt-6"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default GameOverPage;
