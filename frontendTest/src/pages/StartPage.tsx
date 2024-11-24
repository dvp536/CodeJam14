import React from 'react';
import { Link } from 'react-router-dom';

function StartPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to the Trivia Game</h1>
      <p>
        <Link to="/create-room">Create Room</Link>
      </p>
      <p>
        <Link to="/join-room">Join Room</Link>
      </p>
      <p>
        <Link to="/tutorial">How to Play</Link>
      </p>
    </div>
  );
}

export default StartPage;
