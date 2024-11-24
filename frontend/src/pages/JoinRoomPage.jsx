// src/pages/JoinRoomPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function JoinRoomPage({ socket }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract roomId from query parameters if available
    const query = new URLSearchParams(location.search);
    const roomIdFromUrl = query.get('roomId');
    if (roomIdFromUrl) {
      setRoomId(roomIdFromUrl);
    }
  }, [location]);

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      alert('Please enter both a username and a room ID.');
      return;
    }
    socket.emit('joinRoom', { username, roomId });

    const handlePlayerJoined = () => {
      navigate(`/lobby?roomId=${roomId}&username=${username}`);
    };

    const handleError = ({ message }) => {
      alert(message);
    };

    socket.on('playerJoined', handlePlayerJoined);
    socket.on('error', handleError);

    // Clean up event listeners
    return () => {
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('error', handleError);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-500 to-cyan-400 flex flex-col items-center justify-center text-white p-6">
      <div className="w-full max-w-md bg-white text-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-teal-600 mb-6 text-center">Join Room</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Room ID:</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter the room ID"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300"
              readOnly={Boolean(roomId)} // Make read-only if roomId is from URL
            />
          </div>
        </div>

        <button
          onClick={handleJoinRoom}
          className="w-full mt-6 bg-teal-600 text-white font-semibold rounded-lg px-4 py-2 shadow-md hover:bg-teal-700 transition duration-300"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}

export default JoinRoomPage;
