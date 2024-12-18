import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';

// Import pages
import Page from './Pages/Menu';
import CreateRoom from './Pages/CreateRoom';
import WaitingRoom from './Pages/WaitingRoom';
import JoinRoom from './Pages/JoinRoom';
import ScoreboardScreen from './Pages/ScoreboardScreen';

// DO NOT CHANGE THESE PAGES
import Navigation from './components/Navigation';
import ItemStore from './components/ItemStore';

import StartPage from './pages/StartPage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import GamePage from './pages/GamePage';
import TutorialPage from './pages/TutorialPage';
import LobbyPage from './pages/LobbyPage';
import GameOverPage from './pages/GameOverPage';
import PageApp from './components/PageApp';
// Import GameComponent
import GameComponent from './game-logic/MainGame';

// Dynamically set the WebSocket URL
const socket = io(
  import.meta.env.VITE_APP_SOCKET_URL || window.location.origin,
  { transports: ['websocket', 'polling'] }
);


// Development mode toggle
const devMode = false;

const App: React.FC = () => {
  return (
    <Router>
      {devMode ? (
        <Routes>
          <Route path="/" element={<Page />} />
          <Route path="/createRoom" element={<CreateRoom />} />
          <Route path="/waitingRoom" element={<WaitingRoom />} />
          <Route path="/joinRoom" element={<JoinRoom />} />
          <Route path="/scoreboard" element={<ScoreboardScreen />} />
          <Route path="/game" element={<GameComponent />} />
        </Routes>
      ) : (
        <>
          {/* DO NOT CHANGE THESE ROUTES */}
          <Navigation />
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/create-room" element={<CreateRoomPage socket={socket} />} />
            <Route path="/join-room" element={<JoinRoomPage socket={socket} />} />
            <Route path="/lobby" element={<LobbyPage socket={socket} />} />
            <Route path="/game" element={<GamePage socket={socket} />} />
            <Route path="/game-over" element={<GameOverPage />} />
            <Route path="/tutorial" element={<TutorialPage />} />
            <Route path="/audio" element={<PageApp />} />
            <Route path="/item-store" element={<ItemStore />} />
          </Routes>
        </>
      )}
    </Router>
  );
};

export default App;
