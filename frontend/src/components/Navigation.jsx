import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#eee' }}>
      <Link to="/" style={{ marginRight: '10px' }}>Start</Link>
      <Link to="/create-room" style={{ marginRight: '10px' }}>Create Room</Link>
      <Link to="/join-room" style={{ marginRight: '10px' }}>Join Room</Link>
      <Link to="/tutorial">Tutorial</Link>
    </nav>
  );
}

export default Navigation;
