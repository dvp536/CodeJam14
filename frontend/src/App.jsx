import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';

import Navigation from './components/Navigation';
import StartPage from './pages/StartPage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import GamePage from './pages/GamePage';
import TutorialPage from './pages/TutorialPage';
import LobbyPage from './pages/LobbyPage';

const socket = io('http://localhost:5000'); // Update the URL if needed

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/create-room" element={<CreateRoomPage socket={socket} />} />
        <Route path="/join-room" element={<JoinRoomPage socket={socket} />} />
        <Route path="/lobby" element={<LobbyPage socket={socket} />} />
        <Route path="/game" element={<GamePage socket={socket} />} />
        <Route path="/tutorial" element={<TutorialPage />} />
      </Routes>
    </Router>
  );
}

export default App;
