import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function LobbyPage({ socket }) {
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const query = new URLSearchParams(useLocation().search);
  const roomId = query.get('roomId');
  const username = query.get('username');
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-cyan-400 flex flex-col items-center justify-center text-white p-6">
      {/* Room Info */}
      <div className="w-full max-w-lg bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-teal-600 mb-4">
          Lobby - Room ID: <span className="font-mono text-gray-700">{roomId}</span>
        </h2>
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
