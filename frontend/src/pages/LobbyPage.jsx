// src/pages/LobbyPage.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

function LobbyPage({ socket }) {
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const query = new URLSearchParams(useLocation().search);
  const roomId = query.get('roomId');
  const username = query.get('username');
  const navigate = useNavigate();

  // **Updated invite link to match the route in App.tsx**
  const inviteLink = `${window.location.origin}/join-room?roomId=${roomId}`;

  useEffect(() => {
    // Event handlers
    const handlePlayerJoined = ({ players }) => {
      setPlayers(players);
      if (players[0]?.username === username) {
        setIsHost(true);
      } else {
        setIsHost(false);
      }
    };

    const handleGameStarted = () => {
      navigate(`/game?roomId=${roomId}&username=${username}`);
    };

    // Attach event listeners
    socket.on('playerJoined', handlePlayerJoined);
    socket.on('gameStarted', handleGameStarted);

    // Request the list of current players
    socket.emit('getPlayers', { roomId });

    // Clean up event listeners on unmount
    return () => {
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('gameStarted', handleGameStarted);
    };
  }, [socket, roomId, username, navigate]);

  const handleStartGame = () => {
    socket.emit('startGame', { roomId });
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        setCopySuccess('Link copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 3000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-cyan-400 flex flex-col items-center justify-center text-white p-6">
      {/* Room Info */}
      <div className="w-full max-w-lg bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-teal-600 mb-4">
          Lobby - Room ID: <span className="font-mono text-gray-700">{roomId}</span>
        </h2>

        {/* Invite Link Section */}
        <div className="mb-6">
          <p className="text-gray-700 mb-2">Invite your friends:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
            />
            <button
              onClick={handleCopyLink}
              className="bg-teal-600 text-white font-semibold rounded-lg px-4 py-2 shadow-md hover:bg-teal-700 transition duration-300"
            >
              Copy Link
            </button>
          </div>
          {copySuccess && (
            <p className="text-green-600 font-medium mt-2">{copySuccess}</p>
          )}
        </div>

        {/* QR Code */}
        <div className="mb-6 flex justify-center">
          <QRCode value={inviteLink} size={128} />
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-3">Players in Room:</h3>

        {/* Players List */}
        <ul className="space-y-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 shadow-sm"
            >
              {player.username}
            </li>
          ))}
        </ul>

        {/* Host-only Start Game Button */}
        {isHost && (
          <button
            onClick={handleStartGame}
            className="w-full mt-6 bg-teal-600 text-white font-semibold rounded-lg px-4 py-2 shadow-md hover:bg-teal-700 transition duration-300"
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}

export default LobbyPage;
