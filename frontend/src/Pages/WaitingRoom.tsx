import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Styling/WaitingRoom.css';

interface Params {
  roomCode?: string; // `roomCode` is optional as it could be undefined
}

const WaitingRoom: React.FC = () => {
  const navigate = useNavigate();
  const { roomCode } = useParams<Params>();

  return (
    <div className="waiting-room-container">
      <h2 className="waiting-room-title">Waiting Room</h2>
      <p className="waiting-room-info">
        Room Code: <strong>{roomCode || 'N/A'}</strong>
      </p>
      <p className="waiting-room-message">Waiting for the host to start the game...</p>
      <div className="waiting-room-players">
        <p className="player">Player 1</p>
        <p className="player">Player 2</p>
        <p className="player">Player 3</p>
        <p className="player">Player 4</p>
      </div>
      <button
        className="waiting-room-button"
        onClick={() => navigate('/game')}
      >
        Start Game
      </button>
    </div>
  );
};

export default WaitingRoom;
