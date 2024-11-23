import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styling/JoinRoom.css';

function JoinRoom() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const validateRoomCode = (code) => /^[A-Z0-9]{6}$/.test(code);

  const handleJoinRoom = () => {
    if (!validateRoomCode(roomCode)) {
      setError('Invalid room code. Please enter a 6-character alphanumeric code.');
      return;
    }
    setError('');
    navigate(`/waiting/${roomCode}`);
  };

  return (
    <div className="join-room-container">
      <h2 className="join-room-title">Join Room</h2>
      <input
        type="text"
        className="join-room-input"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      {error && <p className="join-room-error">{error}</p>}
      <button
        className="join-room-button"
        onClick={handleJoinRoom}
        disabled={!roomCode.trim()}
      >
        Join Room
      </button>
    </div>
  );
}

export default JoinRoom;
