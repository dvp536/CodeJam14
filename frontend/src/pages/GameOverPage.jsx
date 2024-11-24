// src/pages/GameOverPage.jsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTrophy } from 'react-icons/fa'; // Import the trophy icon

function GameOverPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { winner, players } = location.state || {};

  // Get the current player's username from query parameters
  const query = new URLSearchParams(location.search);
  const username = query.get('username');

  const handlePlayAgain = () => {
    navigate('/');
  };

  if (!winner || !players) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-500 to-cyan-400 flex flex-col items-center justify-center text-white p-6">
        <div className="w-full max-w-lg bg-white text-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-teal-600 mb-4">
            No Game Results Available
          </h2>
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
        <h2 className="text-3xl font-bold text-teal-600 mb-6 text-center">
          Game Over
        </h2>
        <h3 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Winner:{' '}
          <span className="text-teal-600">{winner.username}</span> with{' '}
          <span className="font-bold">${winner.money}</span>
        </h3>

        <h4 className="text-lg font-bold text-gray-700 text-center mb-4">
          Final Standings
        </h4>
        <ul className="space-y-3">
          {players
            .sort((a, b) => b.money - a.money)
            .map((player, index) => (
              <li
                key={player.username}
                className={`flex justify-between items-center px-4 py-2 rounded-lg border border-gray-300 shadow-sm ${player.username === username
                    ? 'bg-teal-100 font-bold border-yellow-500' // Highlight the current player
                    : 'bg-gray-100'
                  }`}
              >
                <span className="text-lg font-medium text-gray-700 flex items-center">
                  {index + 1}. {player.username}
                  {index === 0 && (
                    <FaTrophy
                      className={`text-yellow-500 ml-2 ${player.username === username ? 'animate-bounce' : ''
                        }`}
                    />
                  )}
                </span>
                <span className="text-lg font-semibold text-teal-600">
                  ${player.money}
                </span>
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
