import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinRoomPage({ socket }) {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    socket.emit('joinRoom', { username, roomId });
    socket.on('playerJoined', () => {
      navigate(`/game?roomId=${roomId}&username=${username}`);
    });
    socket.on('error', ({ message }) => {
      alert(message);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Join Room</h2>
      <div>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>
          Room ID:
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <button onClick={handleJoinRoom} style={{ marginTop: '20px' }}>
        Join Room
      </button>
    </div>
  );
}

export default JoinRoomPage;
