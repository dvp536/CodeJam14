// src/pages/LobbyPage.jsx

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
      // Set host if the username matches the first player
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
    <div style={{ padding: '20px' }}>
      <h2>Lobby - Room ID: {roomId}</h2>
      <h3>Players in Room:</h3>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.username}</li>
        ))}
      </ul>
      {isHost && (
        <button onClick={handleStartGame} style={{ marginTop: '20px' }}>
          Start Game
        </button>
      )}
    </div>
  );
}

export default LobbyPage;
